import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_COLORS } from '../../lib/constants'
import ChartTooltip from './ChartTooltip'

const AXIS_TICK = { fontSize: 12, fill: '#64748b' }

function RateBarChart({ data, height }) {
  const chartData = data.map((entry) => ({ ...entry, rate: entry.rate ?? 0 }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
          width={48}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="rate" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function WeeklyCompletionChart({ data, height = 240 }) {
  return <RateBarChart data={data} height={height} />
}

export function MonthlyPerformanceChart({ data, height = 260 }) {
  return <RateBarChart data={data} height={height} />
}
