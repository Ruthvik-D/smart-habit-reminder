/*
# Create Smart Habit Reminder schema

## Plain-English summary
Creates the tables that store each user's profile, habits, daily habit completions,
reminders, and a log of reminders that were shown. Every table is private to the user
who owns it. Users can only read and change their own rows.

## 1. New tables
- `profiles`: one row per user (display name, reminder master switch). Created automatically at sign-up.
- `habits`: habit title, description, category, frequency (daily, weekdays, weekly), selected weekdays, start date.
- `habit_completions`: one row per habit per calendar day that it was completed. A habit can only be completed once per day.
- `reminders`: a reminder time of day attached to a habit, with an enabled flag.
- `reminder_history`: a log of reminders that were shown to the user.

## 2. Security
- Row Level Security is enabled on every table.
- Each table has separate SELECT, INSERT, UPDATE and DELETE policies that check `auth.uid()`.
- Child rows (completions, reminders) also verify that the habit they point to belongs to the user.
- Access is granted only to the `authenticated` role. Anonymous visitors can read nothing.
- The sign-up trigger function is not callable by any app role.

## 3. Important notes
1. Deleting a habit also deletes its completions, reminders and reminder history (cascade).
2. Unique constraint on (habit_id, completed_on) prevents duplicate completion records.
3. Indexes support lookups by user, habit and date.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  reminders_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 500),
  category text NOT NULL DEFAULT 'Personal Development' CHECK (category IN (
    'Health', 'Fitness', 'Study', 'Productivity', 'Personal Development', 'Lifestyle'
  )),
  frequency text NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekdays', 'weekly')),
  weekdays smallint[] NOT NULL DEFAULT '{}' CHECK (
    cardinality(weekdays) <= 7 AND weekdays <@ ARRAY[0,1,2,3,4,5,6]::smallint[]
  ),
  start_date date NOT NULL DEFAULT current_date,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT habit_completions_habit_day_key UNIQUE (habit_id, completed_on)
);

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  remind_at time NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reminder_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id uuid NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  shown_on date NOT NULL,
  shown_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits (user_id);
CREATE INDEX IF NOT EXISTS habit_completions_user_day_idx ON habit_completions (user_id, completed_on);
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON habit_completions (habit_id);
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders (user_id);
CREATE INDEX IF NOT EXISTS reminders_habit_id_idx ON reminders (habit_id);
CREATE INDEX IF NOT EXISTS reminder_history_user_day_idx ON reminder_history (user_id, shown_on);
CREATE INDEX IF NOT EXISTS reminder_history_reminder_day_idx ON reminder_history (reminder_id, shown_on);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_history ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE (display_name, reminders_enabled) ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON habits TO authenticated;
GRANT SELECT, INSERT, DELETE ON habit_completions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reminders TO authenticated;
GRANT SELECT, INSERT ON reminder_history TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "select_own_habits" ON habits;
CREATE POLICY "select_own_habits" ON habits FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_habits" ON habits;
CREATE POLICY "insert_own_habits" ON habits FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_habits" ON habits;
CREATE POLICY "update_own_habits" ON habits FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_habits" ON habits;
CREATE POLICY "delete_own_habits" ON habits FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_completions" ON habit_completions;
CREATE POLICY "select_own_completions" ON habit_completions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_completions" ON habit_completions;
CREATE POLICY "insert_own_completions" ON habit_completions FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM habits WHERE habits.id = habit_completions.habit_id AND habits.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_completions" ON habit_completions;
CREATE POLICY "delete_own_completions" ON habit_completions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_reminders" ON reminders;
CREATE POLICY "select_own_reminders" ON reminders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reminders" ON reminders;
CREATE POLICY "insert_own_reminders" ON reminders FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM habits WHERE habits.id = reminders.habit_id AND habits.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_own_reminders" ON reminders;
CREATE POLICY "update_own_reminders" ON reminders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM habits WHERE habits.id = reminders.habit_id AND habits.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_reminders" ON reminders;
CREATE POLICY "delete_own_reminders" ON reminders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_reminder_history" ON reminder_history;
CREATE POLICY "select_own_reminder_history" ON reminder_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reminder_history" ON reminder_history;
CREATE POLICY "insert_own_reminder_history" ON reminder_history FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM reminders WHERE reminders.id = reminder_history.reminder_id AND reminders.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
