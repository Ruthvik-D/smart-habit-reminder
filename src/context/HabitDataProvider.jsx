import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import * as habitService from '../services/habitService'
import { buildCompletionIndex } from '../utils/habitStats'
import { toISODate } from '../utils/dates'
import { HabitDataContext } from './habitDataContext'

const EMPTY_DATA = { habits: [], completions: [], reminders: [], history: [] }

export function HabitDataProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [data, setData] = useState(EMPTY_DATA)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    if (!userId) return
    try {
      const [habits, completions, reminders, history] = await Promise.all([
        habitService.fetchHabits(),
        habitService.fetchCompletions(),
        habitService.fetchReminders(),
        habitService.fetchReminderHistory(),
      ])
      setData({ habits, completions, reminders, history })
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoaded(true)
    }
  }, [userId])

  useEffect(() => {
    reload()
  }, [reload])

  const mutate = useCallback(
    async (action) => {
      await action()
      await reload()
    },
    [reload],
  )

  const toggleCompletion = useCallback(
    (habitId, isoDate, isDone) =>
      mutate(() =>
        isDone
          ? habitService.removeCompletion(habitId, isoDate)
          : habitService.addCompletion(habitId, isoDate),
      ),
    [mutate],
  )

  const saveHabit = useCallback(
    ({ habitId, values, reminderTime }) =>
      mutate(async () => {
        let savedId = habitId
        if (habitId) {
          await habitService.updateHabit(habitId, values)
        } else {
          savedId = await habitService.createHabit(values)
        }
        if (reminderTime) {
          const existing = data.reminders.find((reminder) => reminder.habit_id === savedId)
          await habitService.savePreferredReminder(savedId, reminderTime, existing?.id)
        }
      }),
    [mutate, data.reminders],
  )

  const removeHabit = useCallback(
    (habitId) => mutate(() => habitService.deleteHabit(habitId)),
    [mutate],
  )

  const saveReminder = useCallback(
    ({ reminderId, habitId, remindAt }) =>
      mutate(() =>
        reminderId
          ? habitService.updateReminder(reminderId, { remind_at: remindAt })
          : habitService.createReminder(habitId, remindAt),
      ),
    [mutate],
  )

  const toggleReminder = useCallback(
    (reminder) =>
      mutate(() => habitService.updateReminder(reminder.id, { is_enabled: !reminder.is_enabled })),
    [mutate],
  )

  const removeReminder = useCallback(
    (reminderId) => mutate(() => habitService.deleteReminder(reminderId)),
    [mutate],
  )

  const recordReminderShown = useCallback(
    (reminder) =>
      mutate(() =>
        habitService.recordReminderShown({
          reminderId: reminder.id,
          habitId: reminder.habit_id,
          shownOn: toISODate(new Date()),
        }),
      ),
    [mutate],
  )

  const value = useMemo(() => {
    const completionIndex = buildCompletionIndex(data.completions)
    const todayIso = toISODate(new Date())
    const shownTodayIds = new Set(
      data.history.filter((entry) => entry.shown_on === todayIso).map((entry) => entry.reminder_id),
    )
    return {
      habits: data.habits,
      completions: data.completions,
      reminders: data.reminders,
      history: data.history,
      completionIndex,
      shownTodayIds,
      loaded,
      error,
      reload,
      toggleCompletion,
      saveHabit,
      removeHabit,
      saveReminder,
      toggleReminder,
      removeReminder,
      recordReminderShown,
    }
  }, [
    data,
    loaded,
    error,
    reload,
    toggleCompletion,
    saveHabit,
    removeHabit,
    saveReminder,
    toggleReminder,
    removeReminder,
    recordReminderShown,
  ])

  return <HabitDataContext.Provider value={value}>{children}</HabitDataContext.Provider>
}
