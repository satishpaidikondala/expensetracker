import { useEffect, useState } from 'react'
import { MonthlyBarChart, CategoryPieChart } from '../../components/ChartsPanel.jsx'
import { fetchCategorySummary, fetchMonthlySummary, fetchExpenses } from '../../services/expenseService.js'

export default function AnalysisPage() {
  const [tab, setTab] = useState('overview')
  const [cat, setCat] = useState({})
  const [monthly, setMonthly] = useState({})
  const [year, setYear] = useState(new Date().getFullYear())
  const [expenses, setExpenses] = useState([])

  useEffect(()=>{ fetchCategorySummary().then(setCat).catch(()=>{}); fetchExpenses().then(setExpenses).catch(()=>{}) },[])
  useEffect(()=>{ fetchMonthlySummary(year).then(setMonthly).catch(()=>{}) },[year])

  const total = expenses.reduce((s,e)=>s+Number(e.amount),0)
  const avg = expenses.length? (total/expenses.length).toFixed(2):0
  const topCat = Object.entries(cat).sort((a,b)=>Number(b[1])-Number(a[1]))[0]?.[0]||'N/A'

  return (
    <div>
      <div className="tabs">
        {['overview','categories','trends','compare'].map(t=> <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>)}
      </div>
      {tab==='overview' && <>
        <div className="summary-cards">
          <div className="card"><span className="card-label">Total</span><span className="card-value">₹{total.toFixed(2)}</span></div>
          <div className="card"><span className="card-label">Avg / txn</span><span className="card-value">₹{avg}</span></div>
          <div className="card"><span className="card-label">Top Category</span><span className="card-value">{topCat}</span></div>
          <div className="card"><span className="card-label">Count</span><span className="card-value">{expenses.length}</span></div>
        </div>
        <div className="charts-row"><MonthlyBarChart data={monthly} year={year} onYearChange={setYear} /><CategoryPieChart data={cat} /></div>
      </>}
      {tab==='categories' && <div className="chart-card"><h3>Spending by Category</h3><CategoryPieChart data={cat} /></div>}
      {tab==='trends' && <div className="chart-card"><h3>Monthly Trend</h3><MonthlyBarChart data={monthly} year={year} onYearChange={setYear} /></div>}
      {tab==='compare' && <div className="chart-card"><p className="empty-state">Compare May vs April / 2026 vs 2025 — coming soon</p></div>}
    </div>
  )
}
