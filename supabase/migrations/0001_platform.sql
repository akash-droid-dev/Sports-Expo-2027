-- India Sports Expo 2027 platform: roles, registrations, exhibitors, live content.
-- Every table has row-level security; the website talks to the database directly with the
-- public (publishable) key, so these policies are what keeps data private.

-- ---------------------------------------------------------------- Staff and roles
-- Staff are identified by their verified sign-in email. Roles, highest first:
-- owner (everything, cannot be removed), admin (everything incl. approvals and staff),
-- editor (website content, exhibitors, programme), viewer (read-only).
create table public.staff (
  email text primary key check (email = lower(email)),
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  name text,
  invited_by text,
  created_at timestamptz not null default now()
);

create or replace function public.role_rank(r text) returns int
language sql immutable set search_path = '' as $$
  select case r when 'owner' then 4 when 'admin' then 3 when 'editor' then 2 when 'viewer' then 1 else 0 end
$$;

create or replace function public.my_email() returns text
language sql stable set search_path = '' as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create or replace function public.my_role() returns text
language sql stable security definer set search_path = '' as $$
  select s.role from public.staff s where s.email = public.my_email()
$$;

create or replace function public.has_role(min_role text) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.role_rank(public.my_role()) >= public.role_rank(min_role), false)
$$;

alter table public.staff enable row level security;
create policy staff_read on public.staff for select to authenticated
  using (public.has_role('viewer') or email = public.my_email());
create policy staff_add on public.staff for insert to authenticated
  with check (public.has_role('admin') and role <> 'owner');
create policy staff_change on public.staff for update to authenticated
  using (public.has_role('admin') and role <> 'owner')
  with check (public.has_role('admin') and role <> 'owner');
create policy staff_remove on public.staff for delete to authenticated
  using (public.has_role('admin') and role <> 'owner');

insert into public.staff (email, role, name) values ('akash@beyondthearena.co', 'owner', 'Akash');

-- ---------------------------------------------------------------- Shared helpers
create or replace function public.touch_updated() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------- Website catalogue
-- Everything the public pages list (zones, hall areas, exhibitors, products, speakers,
-- sessions, states, countries, startups, buyer matches, stages, ...), one record per item,
-- stored in the same shape the pages use. Editors change it live from the Super Admin panel.
create table public.catalog (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  sort int not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by text,
  primary key (collection, id)
);
create trigger catalog_touch before update on public.catalog for each row execute function public.touch_updated();
alter table public.catalog enable row level security;
create policy catalog_read on public.catalog for select to anon, authenticated
  using (active or public.has_role('viewer'));
create policy catalog_write on public.catalog for all to authenticated
  using (public.has_role('editor')) with check (public.has_role('editor'));

-- ---------------------------------------------------------------- Live page edits
-- Overrides made with "Edit this page": a text, image, video or link on a given page, or an
-- element hidden. `page` is the route ('/', '/explore', ...), `key` locates the element.
create table public.content (
  page text not null,
  key text not null,
  kind text not null check (kind in ('text', 'image', 'video', 'link', 'hide', 'bg')),
  value jsonb not null default '{}'::jsonb,
  label text,
  updated_at timestamptz not null default now(),
  updated_by text,
  primary key (page, key)
);
create trigger content_touch before update on public.content for each row execute function public.touch_updated();
alter table public.content enable row level security;
create policy content_read on public.content for select to anon, authenticated using (true);
create policy content_write on public.content for all to authenticated
  using (public.has_role('editor')) with check (public.has_role('editor'));

-- ---------------------------------------------------------------- Registration forms
-- The fields of the visitor and exhibitor registration forms. Core fields (stored in their own
-- columns) can be relabelled and reordered but not removed; admins add any further fields.
create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form text not null check (form in ('visitor', 'exhibitor')),
  key text not null check (key ~ '^[a-z][a-z0-9_]{1,40}$'),
  label text not null,
  type text not null check (type in ('text', 'email', 'tel', 'textarea', 'select', 'multiselect', 'country', 'date', 'url', 'number', 'checkbox', 'image', 'file')),
  options jsonb not null default '[]'::jsonb,
  required boolean not null default false,
  placeholder text,
  help text,
  section text not null default 'Details',
  sort int not null default 0,
  active boolean not null default true,
  core boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (form, key)
);
create trigger form_fields_touch before update on public.form_fields for each row execute function public.touch_updated();
create or replace function public.protect_core_fields() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    if old.core then raise exception 'Core fields cannot be removed.'; end if;
    return old;
  end if;
  if old.core then
    new.key := old.key; new.type := old.type; new.core := true; new.active := true; new.form := old.form;
  end if;
  return new;
end $$;
create trigger form_fields_core before update or delete on public.form_fields for each row execute function public.protect_core_fields();
alter table public.form_fields enable row level security;
create policy form_fields_read on public.form_fields for select to anon, authenticated using (active or public.has_role('viewer'));
create policy form_fields_write on public.form_fields for all to authenticated
  using (public.has_role('admin')) with check (public.has_role('admin'));

-- ---------------------------------------------------------------- Visitors
-- One registration per account. Every card waits for approval by an admin.
create table public.visitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  category text not null,
  organisation text,
  designation text,
  country text,
  answers jsonb not null default '{}'::jsonb,
  photo_path text,
  id_doc_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'changes')),
  admin_note text,
  badge_code text unique,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger visitors_touch before update on public.visitors for each row execute function public.touch_updated();

create or replace function public.visitors_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if not public.has_role('admin') then
      new.user_id := auth.uid();
      new.email := public.my_email();
      new.status := 'pending';
      new.admin_note := null; new.badge_code := null; new.reviewed_by := null; new.reviewed_at := null;
    end if;
    return new;
  end if;
  if public.has_role('admin') then
    if new.status is distinct from old.status then
      new.reviewed_by := public.my_email();
      new.reviewed_at := now();
    end if;
    if new.status = 'approved' and new.badge_code is null then
      new.badge_code := 'ISE27-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));
    end if;
    if new.status <> 'approved' then new.badge_code := null; end if;
    return new;
  end if;
  -- The visitor themself: editable while pending or when changes were requested; an edit after
  -- a change request goes back for review. Review fields are never theirs to change.
  if old.status not in ('pending', 'changes') then
    raise exception 'This registration has been reviewed and is locked. Contact the organisers to change it.';
  end if;
  new.user_id := old.user_id; new.email := old.email;
  new.status := 'pending';
  new.admin_note := old.admin_note; new.badge_code := old.badge_code;
  new.reviewed_by := old.reviewed_by; new.reviewed_at := old.reviewed_at;
  return new;
end $$;
create trigger visitors_guard before insert or update on public.visitors for each row execute function public.visitors_guard();

alter table public.visitors enable row level security;
create policy visitors_own_read on public.visitors for select to authenticated
  using (user_id = auth.uid() or public.has_role('viewer'));
create policy visitors_own_add on public.visitors for insert to authenticated
  with check (user_id = auth.uid() or public.has_role('admin'));
create policy visitors_edit on public.visitors for update to authenticated
  using (user_id = auth.uid() or public.has_role('admin'))
  with check (user_id = auth.uid() or public.has_role('admin'));
create policy visitors_remove on public.visitors for delete to authenticated using (public.has_role('admin'));

-- Checking a card at the gate (or a QR scan): returns the holder only for an approved code.
create or replace function public.verify_badge(code text) returns table (full_name text, category text, organisation text, country text, status text)
language sql stable security definer set search_path = '' as $$
  select v.full_name, v.category, v.organisation, v.country, v.status
  from public.visitors v where v.badge_code = upper(code) and v.status = 'approved'
$$;
grant execute on function public.verify_badge(text) to anon, authenticated;

-- ---------------------------------------------------------------- Exhibitors
-- An exhibitor's dashboard opens as soon as they have registered. Admins allocate the stall,
-- decide whether they are listed on the website, and can suspend them.
create table public.exhibitors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique default auth.uid() references auth.users on delete set null,
  company text not null,
  contact_name text not null,
  email text not null,
  phone text,
  website text,
  country text,
  city text,
  sector text,
  type text,
  zone text check (zone in ('A', 'B', 'C', 'D')),
  stall_product text,
  preferred_location text,
  stall_code text,
  looking_for text,
  description text,
  logo_path text,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'suspended')),
  listed boolean not null default false,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger exhibitors_touch before update on public.exhibitors for each row execute function public.touch_updated();

create or replace function public.exhibitors_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if public.has_role('editor') then return new; end if;
  if tg_op = 'INSERT' then
    new.owner_id := auth.uid();
    new.status := 'active'; new.listed := false; new.stall_code := null; new.admin_note := null;
    return new;
  end if;
  if old.status = 'suspended' then
    raise exception 'This exhibitor account is suspended. Contact the organisers.';
  end if;
  new.owner_id := old.owner_id; new.status := old.status; new.listed := old.listed;
  new.stall_code := old.stall_code; new.admin_note := old.admin_note;
  return new;
end $$;
create trigger exhibitors_guard before insert or update on public.exhibitors for each row execute function public.exhibitors_guard();

alter table public.exhibitors enable row level security;
create policy exhibitors_read on public.exhibitors for select to anon, authenticated
  using ((listed and status = 'active') or owner_id = auth.uid() or public.has_role('viewer'));
create policy exhibitors_add on public.exhibitors for insert to authenticated
  with check (owner_id = auth.uid() or public.has_role('editor'));
create policy exhibitors_edit on public.exhibitors for update to authenticated
  using (owner_id = auth.uid() or public.has_role('editor'))
  with check (owner_id = auth.uid() or public.has_role('editor'));
create policy exhibitors_remove on public.exhibitors for delete to authenticated using (public.has_role('admin'));

create or replace function public.owns_exhibitor(ex uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.exhibitors e where e.id = ex and e.owner_id = auth.uid() and e.status = 'active')
$$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  exhibitor_id uuid not null references public.exhibitors on delete cascade,
  name text not null,
  category text,
  type text,
  description text,
  moq text,
  tag text,
  image_path text,
  listed boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_exhibitor on public.products (exhibitor_id);
create trigger products_touch before update on public.products for each row execute function public.touch_updated();
alter table public.products enable row level security;
create policy products_read on public.products for select to anon, authenticated
  using (
    (listed and exists (select 1 from public.exhibitors e where e.id = exhibitor_id and e.listed and e.status = 'active'))
    or public.owns_exhibitor(exhibitor_id) or public.has_role('viewer')
  );
create policy products_write on public.products for all to authenticated
  using (public.owns_exhibitor(exhibitor_id) or public.has_role('editor'))
  with check (public.owns_exhibitor(exhibitor_id) or public.has_role('editor'));

create table public.exhibitor_team (
  id uuid primary key default gen_random_uuid(),
  exhibitor_id uuid not null references public.exhibitors on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  created_at timestamptz not null default now()
);
create index team_exhibitor on public.exhibitor_team (exhibitor_id);
alter table public.exhibitor_team enable row level security;
create policy team_read on public.exhibitor_team for select to authenticated
  using (public.owns_exhibitor(exhibitor_id) or public.has_role('viewer'));
create policy team_write on public.exhibitor_team for all to authenticated
  using (public.owns_exhibitor(exhibitor_id) or public.has_role('editor'))
  with check (public.owns_exhibitor(exhibitor_id) or public.has_role('editor'));

create table public.exhibitor_documents (
  id uuid primary key default gen_random_uuid(),
  exhibitor_id uuid not null references public.exhibitors on delete cascade,
  kind text not null,
  path text not null,
  file_name text,
  status text not null default 'submitted' check (status in ('submitted', 'accepted', 'rejected')),
  note text,
  created_at timestamptz not null default now()
);
create index docs_exhibitor on public.exhibitor_documents (exhibitor_id);
create or replace function public.docs_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if public.has_role('admin') then return new; end if;
  if tg_op = 'INSERT' then new.status := 'submitted'; new.note := null; return new; end if;
  new.status := old.status; new.note := old.note;
  return new;
end $$;
create trigger docs_guard before insert or update on public.exhibitor_documents for each row execute function public.docs_guard();
alter table public.exhibitor_documents enable row level security;
create policy docs_read on public.exhibitor_documents for select to authenticated
  using (public.owns_exhibitor(exhibitor_id) or public.has_role('viewer'));
create policy docs_add on public.exhibitor_documents for insert to authenticated
  with check (public.owns_exhibitor(exhibitor_id) or public.has_role('admin'));
create policy docs_edit on public.exhibitor_documents for update to authenticated
  using (public.has_role('admin')) with check (public.has_role('admin'));
create policy docs_remove on public.exhibitor_documents for delete to authenticated
  using ((public.owns_exhibitor(exhibitor_id) and status = 'submitted') or public.has_role('admin'));

-- ---------------------------------------------------------------- Storage
-- media: public site images and videos (editors). exhibitors: logos and product photos
-- (public; each exhibitor writes only in their own folder). private: visitor photos and ID
-- documents, exhibitor documents (owner and staff only).
insert into storage.buckets (id, name, public, file_size_limit) values
  ('media', 'media', true, 52428800),
  ('exhibitors', 'exhibitors', true, 10485760),
  ('private', 'private', false, 10485760)
on conflict (id) do nothing;

create policy media_read on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy media_write on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role('editor'));
create policy media_change on storage.objects for update to authenticated using (bucket_id = 'media' and public.has_role('editor'));
create policy media_remove on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role('editor'));

-- Folder names are checked as text first, so a name that isn't an id is simply 'not yours'.
create or replace function public.is_uuid(t text) returns boolean
language sql immutable set search_path = '' as $$
  select coalesce(t ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', false)
$$;
create or replace function public.owns_exhibitor_folder(folder text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case when public.is_uuid(folder) then public.owns_exhibitor(folder::uuid) else false end
$$;

create policy exh_read on storage.objects for select to anon, authenticated using (bucket_id = 'exhibitors');
create policy exh_write on storage.objects for insert to authenticated
  with check (bucket_id = 'exhibitors' and (public.owns_exhibitor_folder((storage.foldername(name))[1]) or public.has_role('editor')));
create policy exh_change on storage.objects for update to authenticated
  using (bucket_id = 'exhibitors' and (public.owns_exhibitor_folder((storage.foldername(name))[1]) or public.has_role('editor')));
create policy exh_remove on storage.objects for delete to authenticated
  using (bucket_id = 'exhibitors' and (public.owns_exhibitor_folder((storage.foldername(name))[1]) or public.has_role('editor')));

-- private/v/<user id>/... (visitor photo, ID) and private/x/<exhibitor id>/... (documents)
create or replace function public.private_path_ok(path text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case (storage.foldername(path))[1]
    when 'v' then (storage.foldername(path))[2] = auth.uid()::text
    when 'x' then public.owns_exhibitor_folder((storage.foldername(path))[2])
    else false end
$$;
create policy private_read on storage.objects for select to authenticated
  using (bucket_id = 'private' and (public.private_path_ok(name) or public.has_role('viewer')));
create policy private_write on storage.objects for insert to authenticated
  with check (bucket_id = 'private' and (public.private_path_ok(name) or public.has_role('admin')));
create policy private_change on storage.objects for update to authenticated
  using (bucket_id = 'private' and (public.private_path_ok(name) or public.has_role('admin')));
create policy private_remove on storage.objects for delete to authenticated
  using (bucket_id = 'private' and (public.private_path_ok(name) or public.has_role('admin')));

-- ---------------------------------------------------------------- Realtime
alter publication supabase_realtime add table
  public.catalog, public.content, public.form_fields, public.visitors, public.exhibitors,
  public.products, public.exhibitor_team, public.exhibitor_documents, public.staff;
