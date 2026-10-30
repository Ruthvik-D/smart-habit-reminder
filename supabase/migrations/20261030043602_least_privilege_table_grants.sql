/*
# Least-privilege table grants for Smart Habit Reminder

## Plain-English summary
The first migration created the tables and row-level security rules correctly, but the
database also gave the anonymous (signed-out) role and the signed-in role more table
access than the app needs, because the public schema's default privileges grant every
verb on every new table. This migration removes that excess access. It does not change
any row-level security policy, does not change any data, and does not drop anything.

## 1. Modified privileges on existing tables
- `anon`: all table privileges revoked on all five tables. Signed-out visitors cannot read,
  insert, update or delete any application data.
- `authenticated`:
  - `profiles`: SELECT; UPDATE restricted to `display_name` and `reminders_enabled`. No INSERT or DELETE
    (the profile row is created by the sign-up trigger).
  - `habits`: SELECT, INSERT, UPDATE, DELETE.
  - `habit_completions`: SELECT, INSERT, DELETE. UPDATE removed because the app never edits a completion.
  - `reminders`: SELECT, INSERT, DELETE; UPDATE restricted to `remind_at` and `is_enabled`
    so the owner cannot reassign a reminder to another habit or user.
  - `reminder_history`: SELECT, INSERT. No UPDATE or DELETE.
- TRUNCATE, REFERENCES and TRIGGER privileges removed from `anon` and `authenticated` on all five tables.
- `service_role` is not changed.

## 2. Default privileges for future tables
- New tables created in the `public` schema no longer grant anything to `anon` or `authenticated`
  automatically. Every future table must add its own GRANT statements in the migration that creates it.
- Existing tables and objects in other schemas (auth, storage, extensions, graphql, and so on) are not changed.

## 3. Security
- Row-level security remains enabled and unchanged on all five tables.
- Column-level restrictions on `profiles` and `reminders` are enforced by the grants above.

## 4. Important notes
1. This migration is additive to the earlier schema migration and does not edit it.
2. No table, column, row, index or constraint is created, altered or dropped.
3. Platform privileges that must remain: `service_role`, `postgres`, and the Supabase
   internal roles. These are not touched.
*/

REVOKE ALL ON TABLE
  public.profiles,
  public.habits,
  public.habit_completions,
  public.reminders,
  public.reminder_history
FROM anon, authenticated;

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name, reminders_enabled) ON public.profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;

GRANT SELECT, INSERT, DELETE ON public.habit_completions TO authenticated;

GRANT SELECT, INSERT, DELETE ON public.reminders TO authenticated;
GRANT UPDATE (remind_at, is_enabled) ON public.reminders TO authenticated;

GRANT SELECT, INSERT ON public.reminder_history TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
