import { useState, useEffect, useCallback } from 'react'
import SummaryCards from '../../components/SummaryCards.jsx'
import { MonthlyBarChart, CategoryPieChart } from '../../components/ChartsPanel.jsx'
import { fetchExpenses, fetchCategorySummary, fetchMonthlySummary } from '../../services/expenseService.js'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([])
  const [catSum, setCatSum] = useState({})
  const [monthly, setMonthly] = useState({})
  const [year, setYear] = useState(new Date().getFullYear())
  const [filterMonth, setFilterMonth] = useState(-1)

  const load = useCallback(async () => {
    try { setExpenses(await fetchExpenses()); setCatSum(await fetchCategorySummary()); } catch {}
  }, [])
  const loadMonthly = useCallback(async (y) => { try { setMonthly(await fetchMonthlySummary(y)) } catch {} }, [])
  useEffect(()=>{ load() },[load])
  useEffect(()=>{ loadMonthly(year) },[year, loadMonthly])

  const filtered = filterMonth===-1 ? expenses : expenses.filter(e=> new Date(e.date).getMonth()===filterMonth)
  const totalSpent = filtered.reduce((s,e)=>s+Number(e.amount),0)
  const maxExpense = filtered.reduce((m,e)=>Math.max(m,Number(e.amount)),0)
  const catTotals={}; filtered.forEach(e=>catTotals[e.category]=(catTotals[e.category]||0)+Number(e.amount))
  const mostExpensiveArea = Object.entries(catTotals).sort((a,b)=>b[1]-a[1])[0]?.[0]||'N/A'
  const catEntries = Object.entries(catSum)
  const mostExpensiveCategory = catEntries.sort((a,b)=>Number(b[1])-Number(a[1]))[0]?.[0]||'N/A'
  const recent = [...expenses].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5)

  return (
    <div>
      <SummaryCards totalSpent={totalSpent} expenseCount={filtered.length} mostExpensiveCategory={mostExpensiveCategory} categorySummary={catSum} maxExpense={maxExpense} mostExpensiveArea={mostExpensiveArea} filterMonth={filterMonth} onFilterMonth={setFilterMonth} />
      <div className="charts-row">
        <MonthlyBarChart data={monthly} year={year} onYearChange={setYear} />
        <CategoryPieChart data={catSum} />
      </div>
      <div className="dash-grid">
        <div className="chart-card">
          <h3>Recent Transactions</h3>
          {recent.length===0? <p className="empty-state">No transactions</p> : recent.map(e=> <div key={e.id} className="recent-row"><span>{e.description||e.category}</span><span>₹{Number(e.amount).toFixed(2)}</span></div>)}
          <Link to="/transactions" className="view-all">View All →</Link>
        </div>
        <div className="chart-card">
          <h3>Top Categories</h3>
          {Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=> (
            <div key={k} className="topcat-row"><span>{k}</span><div className="bar"><div style={{width:`${(v/totalSpent*100)||0}%`}} /></div><span>₹{Number(v).toFixed(0)}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}
