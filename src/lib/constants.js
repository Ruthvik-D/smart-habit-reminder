export const CATEGORIES = [
  'Health',
  'Fitness',
  'Study',
  'Productivity',
  'Personal Development',
  'Lifestyle',
]

export const CATEGORY_COLORS = {
  Health: '#10b981',
  Fitness: '#f97316',
  Study: '#3b82f6',
  Productivity: '#6366f1',
  'Personal Development': '#8b5cf6',
  Lifestyle: '#f59e0b',
}

export const FREQUENCIES = [
  { value: 'daily', label: 'Every day', hint: 'Due on every day from the start date' },
  { value: 'weekdays', label: 'Selected weekdays', hint: 'Due only on the days you pick' },
  { value: 'weekly', label: 'Once a week', hint: 'Done once per week, any day' },
]

// Values follow JavaScript's Date.getDay(): 0 = Sunday.
export const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
]

export const CHART_COLORS = {
  primary: '#4f46e5',
  primaryLight: '#a5b4fc',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#f43f5e',
  muted: '#94a3b8',
  grid: '#e2e8f0',
}
