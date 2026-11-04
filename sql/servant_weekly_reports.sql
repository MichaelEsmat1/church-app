-- Weekly servants report (أمين الخدمة records attendance/activity per servant per week)
-- NOT executed automatically. Review, then run in the Supabase SQL editor.
-- ASSUMPTION: servants.id and stages.id are of type text (the client generates text ids).

create table if not exists public.servant_weekly_reports (
  id                    text primary key,
  servant_id            text not null references public.servants(id) on delete cascade,
  stage_id              text not null,
  week_start            date not null,
  attended_church       boolean not null default false,
  attended_lesson       boolean not null default false,
  did_visit             boolean not null default false,
  confession_father     text,
  confessed             boolean not null default false,
  attended_monthly_mass boolean not null default false,
  saved_at              timestamptz not null default now(),
  unique (servant_id, week_start)
);

create index if not exists servant_weekly_reports_stage_week_idx
  on public.servant_weekly_reports (stage_id, week_start);

alter table public.servant_weekly_reports enable row level security;

-- أمين الخدمة (admin): only rows of the stage whose auth_user_id = auth.uid()
create policy "swr admin select" on public.servant_weekly_reports
  for select to authenticated
  using (stage_id in (select s.id from public.stages s where s.auth_user_id = auth.uid()));

create policy "swr admin insert" on public.servant_weekly_reports
  for insert to authenticated
  with check (
    stage_id in (select s.id from public.stages s where s.auth_user_id = auth.uid())
    and servant_id in (select sv.id from public.servants sv where sv.stage_id = servant_weekly_reports.stage_id)
  );

create policy "swr admin update" on public.servant_weekly_reports
  for update to authenticated
  using (stage_id in (select s.id from public.stages s where s.auth_user_id = auth.uid()))
  with check (
    stage_id in (select s.id from public.stages s where s.auth_user_id = auth.uid())
    and servant_id in (select sv.id from public.servants sv where sv.stage_id = servant_weekly_reports.stage_id)
  );

-- TODO (super admin select-all): intentionally NOT written. The repo has no policy files and
-- the client only detects super by a login name containing '@' — how super is identified
-- server-side (email list, app_metadata claim, a table, ...) must be confirmed first.
-- Example shape once known:
--   create policy "swr super select" on public.servant_weekly_reports
--     for select to authenticated using ( <is_super_expression> );
