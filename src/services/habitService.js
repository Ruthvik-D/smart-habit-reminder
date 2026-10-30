import { supabase } from '../lib/supabase'

const HABIT_COLUMNS = 'id, title, description, category, frequency, weekdays, start_date, created_at'

function toHabitPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    frequency: values.frequency,
    weekdays: values.frequency === 'weekdays' ? [...values.weekdays].sort((a, b) => a - b) : [],
    start_date: values.startDate,
  }
}

export async function fetchHabits() {
  const { data, error } = await supabase
    .from('habits')
    .select(HABIT_COLUMNS)
    .order('created_at', { ascending: true })
  if (error) throw new Error("Couldn't load your habits. Please try again.")
  return data
}

export async function fetchCompletions() {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('habit_id, completed_on, created_at')
  if (error) throw new Error("Couldn't load your habit progress. Please try again.")
  return data
}

export async function fetchReminders() {
  const { data, error } = await supabase
    .from('reminders')
    .select('id, habit_id, remind_at, is_enabled')
    .order('remind_at', { ascending: true })
  if (error) throw new Error("Couldn't load your reminders. Please try again.")
  return data
}

export async function fetchReminderHistory(limit = 100) {
  const { data, error } = await supabase
    .from('reminder_history')
    .select('id, reminder_id, habit_id, shown_on, shown_at, habits(title)')
    .order('shown_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error("Couldn't load your reminder history. Please try again.")
  return data
}

export async function createHabit(values) {
  const { data, error } = await supabase
    .from('habits')
    .insert(toHabitPayload(values))
    .select('id')
    .single()
  if (error) throw new Error('Could not create the habit. Please try again.')
  return data.id
}

export async function updateHabit(habitId, values) {
  const { data, error } = await supabase
    .from('habits')
    .update(toHabitPayload(values))
    .eq('id', habitId)
    .select('id')
    .maybeSingle()
  if (error) throw new Error('Could not save the habit. Please try again.')
  if (!data) throw new Error('This habit could not be found.')
}

export async function deleteHabit(habitId) {
  const { data, error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .select('id')
    .maybeSingle()
  if (error) throw new Error('Could not delete the habit. Please try again.')
  if (!data) throw new Error('This habit could not be found.')
}

export async function addCompletion(habitId, isoDate) {
  const { error } = await supabase
    .from('habit_completions')
    .insert({ habit_id: habitId, completed_on: isoDate })
  // 23505 = unique violation: the habit is already completed for that day
  if (error && error.code !== '23505') throw new Error('Could not save your progress. Please try again.')
}

export async function removeCompletion(habitId, isoDate) {
  const { error } = await supabase
    .from('habit_completions')
    .delete()
    .eq('habit_id', habitId)
    .eq('completed_on', isoDate)
  if (error) throw new Error('Could not undo this completion. Please try again.')
}

export async function createReminder(habitId, remindAt) {
  const { error } = await supabase
    .from('reminders')
    .insert({ habit_id: habitId, remind_at: remindAt })
  if (error) throw new Error('Could not create the reminder. Please try again.')
}

export async function updateReminder(reminderId, patch) {
  const { data, error } = await supabase
    .from('reminders')
    .update(patch)
    .eq('id', reminderId)
    .select('id')
    .maybeSingle()
  if (error) throw new Error('Could not update the reminder. Please try again.')
  if (!data) throw new Error('This reminder could not be found.')
}

export async function deleteReminder(reminderId) {
  const { error } = await supabase.from('reminders').delete().eq('id', reminderId)
  if (error) throw new Error('Could not delete the reminder. Please try again.')
}

export async function savePreferredReminder(habitId, remindAt, existingReminderId) {
  if (existingReminderId) {
    await updateReminder(existingReminderId, { remind_at: remindAt })
  } else {
    await createReminder(habitId, remindAt)
  }
}

export async function recordReminderShown({ reminderId, habitId, shownOn }) {
  const { error } = await supabase
    .from('reminder_history')
    .insert({ reminder_id: reminderId, habit_id: habitId, shown_on: shownOn })
  if (error) throw new Error('Could not record the reminder.')
}
