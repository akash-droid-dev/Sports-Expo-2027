-- Site settings, and the test sign-in code. While `sign_in.test_code` is on, every email can sign
-- in with the same code (row `test_code`, default 123456) through the `test-sign-in` edge
-- function, without an email being sent. Anyone who knows an address can then sign in as that
-- person, so switch it off (Admin → Team & roles) once real email codes are set up.
create table public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);
create trigger app_settings_touch before update on public.app_settings for each row execute function public.touch_updated();
alter table public.app_settings enable row level security;
-- Everyone may read the settings (the sign-in screen needs to know the mode), except the code.
create policy app_settings_read on public.app_settings for select to anon, authenticated
  using (key <> 'test_code' or (select private.has_role('owner')));
create policy app_settings_change on public.app_settings for update to authenticated
  using ((select private.has_role('owner'))) with check ((select private.has_role('owner')));

insert into public.app_settings (key, value) values
  ('sign_in', '{"test_code": true}'),
  ('test_code', '{"code": "123456"}');
alter publication supabase_realtime add table public.app_settings;
