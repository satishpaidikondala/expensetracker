import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

export function MonthlyBarChart({ data, year, onYearChange }) {
  if (!data || Object.keys(data).length === 0) return null

  const chartData = Object.entries(data).map(([month, total]) => ({
    month: month.charAt(0) + month.slice(1).toLowerCase(),
    total,
  }))

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Monthly Spending</h3>
        <select className="chart-filter" value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
          <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryPieChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: Number(value),
  }))

  const total = chartData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>By Category</h3>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) =>
              `${name} (${((value / total) * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
