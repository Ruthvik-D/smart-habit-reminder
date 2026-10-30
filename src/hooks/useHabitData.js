import { useContext } from 'react'
import { HabitDataContext } from '../context/habitDataContext'

export function useHabitData() {
  const context = useContext(HabitDataContext)
  if (!context) throw new Error('useHabitData must be used inside HabitDataProvider')
  return context
}
