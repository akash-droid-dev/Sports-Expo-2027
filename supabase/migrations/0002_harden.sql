-- Hardening after the database advisors:
-- 1. The role helpers and trigger functions run with elevated rights, so they move out of the
--    public API schema into `private` (callable from policies, not over /rest/v1/rpc). The one
--    public RPC left on purpose is verify_badge (gate checks); a signed-in person reads their
--    own role from the staff table.
-- 2. Policies call auth.uid() and the helpers once per query, not once per row.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

alter function public.my_role() set schema private;
alter function public.has_role(text) set schema private;
alter function public.owns_exhibitor(uuid) set schema private;
alter function public.owns_exhibitor_folder(text) set schema private;
alter function public.private_path_ok(text) set schema private;
alter function public.visitors_guard() set schema private;
alter function public.exhibitors_guard() set schema private;
alter function public.docs_guard() set schema private;

-- Bodies refer to each other by name, so point them at their new schema.
create or replace function private.has_role(min_role text) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.role_rank(private.my_role()) >= public.role_rank(min_role), false)
$$;
create or replace function private.owns_exhibitor_folder(folder text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case when public.is_uuid(folder) then private.owns_exhibitor(folder::uuid) else false end
$$;
create or replace function private.private_path_ok(path text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case (storage.foldername(path))[1]
    when 'v' then (storage.foldername(path))[2] = (select auth.uid())::text
    when 'x' then private.owns_exhibitor_folder((storage.foldername(path))[2])
    else false end
$$;

create or replace function private.visitors_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if not private.has_role('admin') then
      new.user_id := auth.uid();
      new.email := public.my_email();
      new.status := 'pending';
      new.admin_note := null; new.badge_code := null; new.reviewed_by := null; new.reviewed_at := null;
    end if;
    return new;
  end if;
  if private.has_role('admin') then
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

create or replace function private.exhibitors_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if private.has_role('editor') then return new; end if;
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

create or replace function private.docs_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if private.has_role('admin') then return new; end if;
  if tg_op = 'INSERT' then new.status := 'submitted'; new.note := null; return new; end if;
  new.status := old.status; new.note := old.note;
  return new;
end $$;

-- Triggers fire without EXECUTE rights; nobody needs to call these directly.
revoke execute on function private.visitors_guard(), private.exhibitors_guard(), private.docs_guard()
  from public, anon, authenticated;

-- ---------------------------------------------------------------- Policies
alter policy staff_read on public.staff
  using ((select private.has_role('viewer')) or email = (select public.my_email()));
alter policy staff_add on public.staff
  with check ((select private.has_role('admin')) and role <> 'owner');
alter policy staff_change on public.staff
  using ((select private.has_role('admin')) and role <> 'owner')
  with check ((select private.has_role('admin')) and role <> 'owner');
alter policy staff_remove on public.staff
  using ((select private.has_role('admin')) and role <> 'owner');

alter policy catalog_read on public.catalog using (active or (select private.has_role('viewer')));
alter policy catalog_write on public.catalog
  using ((select private.has_role('editor'))) with check ((select private.has_role('editor')));

alter policy content_write on public.content
  using ((select private.has_role('editor'))) with check ((select private.has_role('editor')));

alter policy form_fields_read on public.form_fields using (active or (select private.has_role('viewer')));
alter policy form_fields_write on public.form_fields
  using ((select private.has_role('admin'))) with check ((select private.has_role('admin')));

alter policy visitors_own_read on public.visitors
  using (user_id = (select auth.uid()) or (select private.has_role('viewer')));
alter policy visitors_own_add on public.visitors
  with check (user_id = (select auth.uid()) or (select private.has_role('admin')));
alter policy visitors_edit on public.visitors
  using (user_id = (select auth.uid()) or (select private.has_role('admin')))
  with check (user_id = (select auth.uid()) or (select private.has_role('admin')));
alter policy visitors_remove on public.visitors using ((select private.has_role('admin')));

alter policy exhibitors_read on public.exhibitors
  using ((listed and status = 'active') or owner_id = (select auth.uid()) or (select private.has_role('viewer')));
alter policy exhibitors_add on public.exhibitors
  with check (owner_id = (select auth.uid()) or (select private.has_role('editor')));
alter policy exhibitors_edit on public.exhibitors
  using (owner_id = (select auth.uid()) or (select private.has_role('editor')))
  with check (owner_id = (select auth.uid()) or (select private.has_role('editor')));
alter policy exhibitors_remove on public.exhibitors using ((select private.has_role('admin')));

alter policy products_read on public.products
  using (
    (listed and exists (select 1 from public.exhibitors e where e.id = exhibitor_id and e.listed and e.status = 'active'))
    or private.owns_exhibitor(exhibitor_id) or (select private.has_role('viewer'))
  );
alter policy products_write on public.products
  using (private.owns_exhibitor(exhibitor_id) or (select private.has_role('editor')))
  with check (private.owns_exhibitor(exhibitor_id) or (select private.has_role('editor')));

alter policy team_read on public.exhibitor_team
  using (private.owns_exhibitor(exhibitor_id) or (select private.has_role('viewer')));
alter policy team_write on public.exhibitor_team
  using (private.owns_exhibitor(exhibitor_id) or (select private.has_role('editor')))
  with check (private.owns_exhibitor(exhibitor_id) or (select private.has_role('editor')));

alter policy docs_read on public.exhibitor_documents
  using (private.owns_exhibitor(exhibitor_id) or (select private.has_role('viewer')));
alter policy docs_add on public.exhibitor_documents
  with check (private.owns_exhibitor(exhibitor_id) or (select private.has_role('admin')));
alter policy docs_edit on public.exhibitor_documents
  using ((select private.has_role('admin'))) with check ((select private.has_role('admin')));
alter policy docs_remove on public.exhibitor_documents
  using ((private.owns_exhibitor(exhibitor_id) and status = 'submitted') or (select private.has_role('admin')));

alter policy media_write on storage.objects
  with check (bucket_id = 'media' and (select private.has_role('editor')));
alter policy media_change on storage.objects
  using (bucket_id = 'media' and (select private.has_role('editor')));
alter policy media_remove on storage.objects
  using (bucket_id = 'media' and (select private.has_role('editor')));
alter policy exh_write on storage.objects
  with check (bucket_id = 'exhibitors' and (private.owns_exhibitor_folder((storage.foldername(name))[1]) or (select private.has_role('editor'))));
alter policy exh_change on storage.objects
  using (bucket_id = 'exhibitors' and (private.owns_exhibitor_folder((storage.foldername(name))[1]) or (select private.has_role('editor'))));
alter policy exh_remove on storage.objects
  using (bucket_id = 'exhibitors' and (private.owns_exhibitor_folder((storage.foldername(name))[1]) or (select private.has_role('editor'))));
alter policy private_read on storage.objects
  using (bucket_id = 'private' and (private.private_path_ok(name) or (select private.has_role('viewer'))));
alter policy private_write on storage.objects
  with check (bucket_id = 'private' and (private.private_path_ok(name) or (select private.has_role('admin'))));
alter policy private_change on storage.objects
  using (bucket_id = 'private' and (private.private_path_ok(name) or (select private.has_role('admin'))));
alter policy private_remove on storage.objects
  using (bucket_id = 'private' and (private.private_path_ok(name) or (select private.has_role('admin'))));
