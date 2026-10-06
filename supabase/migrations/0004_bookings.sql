-- Meetings portal: one-to-one business meetings, conference seats, open-discussion places and
-- room bookings. Anyone signed in may request; a meeting with a registered exhibitor is first
-- accepted (or declined) by that exhibitor, and every booking is finally approved by the
-- organisers, who assign the day, time, venue and table. A person's first approved booking issues
-- their business pass (one QR for all their confirmed bookings).
--
--   booking_sessions   conferences and open discussions, with a seat limit
--   bookings           one row per request (sample = demo data, removable from Admin → Meetings)
--   business_passes    one per person, created on their first approval
--   booking_board      approved bookings at company level only, readable by everyone
--                      (Connect → "Who meets whom"); kept in step by a trigger

-- ---------------------------------------------------------------- Sessions
create table public.booking_sessions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('conference', 'discussion')),
  title text not null,
  topic text,
  host text,
  day smallint not null check (day between 1 and 3),
  starts time not null,
  ends time not null,
  venue text not null,
  capacity int not null check (capacity > 0),
  taken int not null default 0,
  description text,
  active boolean not null default true,
  sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger booking_sessions_touch before update on public.booking_sessions for each row execute function public.touch_updated();
alter table public.booking_sessions enable row level security;
create policy booking_sessions_read on public.booking_sessions for select to anon, authenticated
  using (active or (select private.has_role('viewer')));
create policy booking_sessions_write on public.booking_sessions for all to authenticated
  using ((select private.has_role('admin'))) with check ((select private.has_role('admin')));

-- ---------------------------------------------------------------- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('meeting', 'conference', 'discussion', 'room')),
  type text check (type in ('B2B', 'B2G', 'G2G', 'Buyer–Seller', 'Investor', 'Federation', 'CEO / Strategic')),
  title text,
  purpose text,
  -- Who asked. Sample rows have no account behind them.
  requester_id uuid default auth.uid() references auth.users on delete cascade,
  requester_name text not null,
  requester_org text,
  requester_country text,
  requester_role text,
  requester_email text,
  -- Who they want to meet: a registered exhibitor (who answers the request), or a company or
  -- delegation from the website catalogue (the organisers answer for them).
  counterpart_exhibitor_id uuid references public.exhibitors on delete set null,
  counterpart_name text,
  counterpart_org text,
  counterpart_country text,
  session_id uuid references public.booking_sessions on delete cascade,
  room text,
  -- What they asked for (free choice; the organisers resolve clashes).
  pref_day smallint check (pref_day between 1 and 3),
  pref_time time,
  duration_min int not null default 30 check (duration_min between 10 and 480),
  party_size int not null default 1 check (party_size between 1 and 50),
  status text not null default 'requested'
    check (status in ('requested', 'accepted', 'declined', 'approved', 'rejected', 'cancelled')),
  counterpart_note text,
  admin_note text,
  -- What the organisers confirmed.
  assigned_day smallint check (assigned_day between 1 and 3),
  assigned_time time,
  assigned_venue text,
  assigned_table text,
  answered_by text,
  answered_at timestamptz,
  approved_by text,
  approved_at timestamptz,
  sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_shape check (
    (kind = 'meeting' and type is not null and (counterpart_exhibitor_id is not null or counterpart_org is not null))
    or (kind in ('conference', 'discussion') and session_id is not null)
    or (kind = 'room' and room is not null)
  )
);
create index bookings_requester on public.bookings (requester_id);
create index bookings_counterpart on public.bookings (counterpart_exhibitor_id);
create index bookings_session on public.bookings (session_id);
create index bookings_status on public.bookings (status);
-- One live place per person per session.
create unique index bookings_one_seat on public.bookings (session_id, requester_id)
  where session_id is not null and requester_id is not null and status in ('requested', 'accepted', 'approved');
create trigger bookings_touch before update on public.bookings for each row execute function public.touch_updated();

create table public.business_passes (
  user_id uuid primary key references auth.users on delete cascade,
  code text not null unique,
  holder_name text,
  holder_org text,
  issued_at timestamptz not null default now()
);
alter table public.business_passes enable row level security;
create policy business_passes_read on public.business_passes for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_role('viewer')));

create table public.booking_board (
  id uuid primary key references public.bookings on delete cascade,
  kind text not null,
  type text,
  requester_org text,
  requester_country text,
  counterpart_org text,
  counterpart_country text,
  session_title text,
  day smallint,
  starts time,
  venue text,
  sample boolean not null default false,
  updated_at timestamptz not null default now()
);
create index booking_board_day on public.booking_board (day);
alter table public.booking_board enable row level security;
create policy booking_board_read on public.booking_board for select to anon, authenticated using (true);

-- ---------------------------------------------------------------- Rules
create or replace function private.bookings_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  s public.booking_sessions;
  -- Organisers, or the database itself (migrations and the sample seed run without a signed-in user).
  admin boolean := private.has_role('admin') or coalesce(current_setting('request.jwt.claims', true), '') = '';
  full_now int;
  answer text;
  note text;
begin
  if new.session_id is not null then
    select * into s from public.booking_sessions where id = new.session_id;
    if not found then raise exception 'That session no longer exists.'; end if;
    new.kind := s.kind; new.title := coalesce(new.title, s.title);
  end if;

  if tg_op = 'INSERT' then
    if not admin then
      new.requester_id := auth.uid();
      new.requester_email := public.my_email();
      new.status := 'requested'; new.sample := false;
      new.admin_note := null; new.counterpart_note := null;
      new.assigned_day := null; new.assigned_time := null; new.assigned_venue := null; new.assigned_table := null;
      new.answered_by := null; new.answered_at := null; new.approved_by := null; new.approved_at := null;
      if new.counterpart_exhibitor_id is not null and private.owns_exhibitor(new.counterpart_exhibitor_id) then
        raise exception 'You cannot book a meeting with your own company.';
      end if;
    end if;
    if new.kind <> 'meeting' then new.type := null; end if;
    if new.counterpart_exhibitor_id is not null then
      select coalesce(new.counterpart_org, e.company), coalesce(new.counterpart_country, e.country),
             coalesce(new.counterpart_name, e.contact_name)
        into new.counterpart_org, new.counterpart_country, new.counterpart_name
        from public.exhibitors e where e.id = new.counterpart_exhibitor_id;
    end if;
    if s.id is not null then
      if not s.active then raise exception 'This session is closed for booking.'; end if;
      new.pref_day := s.day; new.pref_time := s.starts;
      if s.taken >= s.capacity and new.status <> 'cancelled' then
        raise exception 'This session is full.';
      end if;
    end if;
    return new;
  end if;

  -- UPDATE
  if admin then
    if new.status is distinct from old.status and new.status = 'approved' then
      new.approved_by := public.my_email(); new.approved_at := now();
      if s.id is not null then
        select coalesce(sum(b.party_size), 0) into full_now from public.bookings b
          where b.session_id = s.id and b.status = 'approved' and b.id <> new.id;
        if full_now + new.party_size > s.capacity then
          raise exception 'This session is full (% of % places approved).', full_now, s.capacity;
        end if;
        new.assigned_day := coalesce(new.assigned_day, s.day);
        new.assigned_time := coalesce(new.assigned_time, s.starts);
        new.assigned_venue := coalesce(new.assigned_venue, s.venue);
      end if;
    end if;
    if new.status is distinct from old.status and new.status in ('accepted', 'declined') then
      new.answered_by := public.my_email(); new.answered_at := now();
    end if;
    return new;
  end if;

  -- The exhibitor being asked: accept or decline, with a note. Nothing else.
  if old.counterpart_exhibitor_id is not null and private.owns_exhibitor(old.counterpart_exhibitor_id)
     and old.requester_id is distinct from auth.uid() then
    if old.status not in ('requested', 'accepted', 'declined') or new.status not in ('accepted', 'declined') then
      raise exception 'This request can no longer be answered.';
    end if;
    answer := new.status; note := new.counterpart_note;
    new := old;
    new.status := answer; new.counterpart_note := note;
    new.answered_by := public.my_email(); new.answered_at := now(); new.updated_at := now();
    return new;
  end if;

  -- The requester: change the details while still waiting, or cancel before approval.
  if old.requester_id = auth.uid() then
    if old.status in ('approved', 'rejected', 'declined', 'cancelled') then
      raise exception 'This booking is closed. Contact the organisers to change it.';
    end if;
    if new.status not in (old.status, 'cancelled') then
      raise exception 'Only the organisers can confirm a booking.';
    end if;
    new.requester_id := old.requester_id; new.requester_email := old.requester_email;
    new.kind := old.kind; new.session_id := old.session_id; new.sample := old.sample;
    new.counterpart_exhibitor_id := old.counterpart_exhibitor_id;
    new.counterpart_note := old.counterpart_note; new.admin_note := old.admin_note;
    new.assigned_day := old.assigned_day; new.assigned_time := old.assigned_time;
    new.assigned_venue := old.assigned_venue; new.assigned_table := old.assigned_table;
    new.answered_by := old.answered_by; new.answered_at := old.answered_at;
    new.approved_by := old.approved_by; new.approved_at := old.approved_at;
    -- A changed meeting request goes back to the other side.
    if new.status <> 'cancelled' and old.status = 'accepted'
       and (new.pref_day, new.pref_time, new.duration_min) is distinct from (old.pref_day, old.pref_time, old.duration_min) then
      new.status := 'requested';
    end if;
    return new;
  end if;

  raise exception 'You cannot change this booking.';
end $$;
create trigger bookings_guard before insert or update on public.bookings for each row execute function private.bookings_guard();

-- After a change: seat counts, the public board and the business pass.
create or replace function private.bookings_after() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  r public.bookings;
begin
  if tg_op = 'DELETE' then r := old; else r := new; end if;
  if r.session_id is not null then
    update public.booking_sessions s set taken = (
      select coalesce(sum(b.party_size), 0) from public.bookings b where b.session_id = s.id and b.status = 'approved')
    where s.id = r.session_id;
  end if;
  if tg_op = 'UPDATE' and old.session_id is distinct from new.session_id and old.session_id is not null then
    update public.booking_sessions s set taken = (
      select coalesce(sum(b.party_size), 0) from public.bookings b where b.session_id = s.id and b.status = 'approved')
    where s.id = old.session_id;
  end if;
  if tg_op = 'DELETE' then return old; end if;

  if new.status = 'approved' then
    insert into public.booking_board as bb (id, kind, type, requester_org, requester_country, counterpart_org, counterpart_country, session_title, day, starts, venue, sample, updated_at)
    select new.id, new.kind, new.type, coalesce(new.requester_org, 'Individual delegate'), new.requester_country,
           case when new.kind = 'meeting' then new.counterpart_org end,
           case when new.kind = 'meeting' then new.counterpart_country end,
           case when new.kind in ('conference', 'discussion') then s.title end,
           coalesce(new.assigned_day, new.pref_day), coalesce(new.assigned_time, new.pref_time),
           coalesce(new.assigned_venue, s.venue, new.room), new.sample, now()
    from (select 1) one left join public.booking_sessions s on s.id = new.session_id
    on conflict (id) do update set
      kind = excluded.kind, type = excluded.type, requester_org = excluded.requester_org,
      requester_country = excluded.requester_country, counterpart_org = excluded.counterpart_org,
      counterpart_country = excluded.counterpart_country, session_title = excluded.session_title,
      day = excluded.day, starts = excluded.starts, venue = excluded.venue, sample = excluded.sample,
      updated_at = now();
    if new.requester_id is not null then
      insert into public.business_passes (user_id, code, holder_name, holder_org)
      values (new.requester_id, 'ISE27-BIZ-' || upper(substr(md5(gen_random_uuid()::text), 1, 8)), new.requester_name, new.requester_org)
      on conflict (user_id) do nothing;
    end if;
  else
    delete from public.booking_board where id = new.id;
  end if;
  return new;
end $$;
create trigger bookings_after after insert or update or delete on public.bookings for each row execute function private.bookings_after();

revoke execute on function private.bookings_guard(), private.bookings_after() from public, anon, authenticated;

alter table public.bookings enable row level security;
create policy bookings_read on public.bookings for select to authenticated
  using (requester_id = (select auth.uid()) or private.owns_exhibitor(counterpart_exhibitor_id) or (select private.has_role('viewer')));
create policy bookings_add on public.bookings for insert to authenticated
  with check (requester_id = (select auth.uid()) or (select private.has_role('admin')));
create policy bookings_edit on public.bookings for update to authenticated
  using (requester_id = (select auth.uid()) or private.owns_exhibitor(counterpart_exhibitor_id) or (select private.has_role('admin')))
  with check (requester_id = (select auth.uid()) or private.owns_exhibitor(counterpart_exhibitor_id) or (select private.has_role('admin')));
create policy bookings_remove on public.bookings for delete to authenticated
  using ((select private.has_role('admin')));

-- ---------------------------------------------------------------- Pass check
-- The QR on a business pass opens /verify; this returns the holder and their confirmed bookings.
create or replace function public.verify_business(code text) returns table (holder_name text, holder_org text, bookings jsonb)
language sql stable security definer set search_path = '' as $$
  select p.holder_name, p.holder_org, coalesce((
    select jsonb_agg(jsonb_build_object(
      'kind', b.kind, 'type', b.type, 'title', b.title, 'with', b.counterpart_org,
      'day', coalesce(b.assigned_day, b.pref_day), 'time', to_char(coalesce(b.assigned_time, b.pref_time), 'HH24:MI'),
      'venue', coalesce(b.assigned_venue, s.venue, b.room), 'table', b.assigned_table)
      order by coalesce(b.assigned_day, b.pref_day), coalesce(b.assigned_time, b.pref_time))
    from public.bookings b left join public.booking_sessions s on s.id = b.session_id
    where b.requester_id = p.user_id and b.status = 'approved'), '[]'::jsonb)
  from public.business_passes p where p.code = upper($1)
$$;
grant execute on function public.verify_business(text) to anon, authenticated;

alter publication supabase_realtime add table public.bookings, public.booking_sessions, public.booking_board, public.business_passes;
