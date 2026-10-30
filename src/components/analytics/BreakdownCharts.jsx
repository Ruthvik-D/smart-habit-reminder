import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CATEGORY_COLORS, CHART_COLORS } from '../../lib/constants'
import ChartTooltip from './ChartTooltip'

const AXIS_TICK = { fontSize: 12, fill: '#64748b' }

export function CategoryPerformanceChart({ data }) {
  const chartData = data.map((entry) => ({ ...entry, rate: entry.rate ?? 0 }))
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 52)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="rate" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {chartData.map((entry) => (
            <Cell key={entry.label} fill={CATEGORY_COLORS[entry.label] ?? CHART_COLORS.primary} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function HabitConsistencyChart({ data }) {
  const chartData = data.map((entry) => ({ ...entry, rate: entry.rate ?? 0 }))
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="rate" fill={CHART_COLORS.success} radius={[0, 6, 6, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CompletionTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} interval="preserveStartEnd" />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={AXIS_TICK} width={40} />
        <Tooltip
          formatter={(value) => [`${value} completions`, 'Completed']}
          labelFormatter={(label) => `Week of ${label}`}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="completions"
          stroke={CHART_COLORS.primary}
          strokeWidth={2.5}
          dot={{ r: 3, fill: CHART_COLORS.primary }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
