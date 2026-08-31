import { useEffect, useState } from 'react'
import { fetchCategorySummary } from '../../services/expenseService.js'

const LIMITS = { Food: 10000, Transport: 7000, Shopping: 6000, Bills: 8000, Entertainment: 4000, Travel: 12000, Other: 3000 }

export default function BudgetsPage() {
  const [cat, setCat] = useState({})
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ category:'Food', limit:'' })
  useEffect(()=>{ fetchCategorySummary().then(setCat).catch(()=>{}) },[])
  const create = (e)=>{ e.preventDefault(); LIMITS[form.category]=Number(form.limit); setShow(false); setCat({...cat}) }

  return (
    <div>
      <div className="budget-header"><h2>Budgets</h2><button className="primary-btn" onClick={()=>setShow(true)}>+ Create Budget</button></div>
      <div className="budget-grid">
        {Object.entries(LIMITS).map(([k,lim])=> {
          const spent = Number(cat[k]||0)
          const pct = Math.min(100, Math.round(spent/lim*100))
          return <div key={k} className="budget-card"><h4>{k}</h4><p>₹{spent.toFixed(0)} / ₹{lim}</p><div className="progress"><div style={{width:pct+'%'}}/></div><span>{pct}%</span></div>
        })}
      </div>
      {show && <div className="modal-backdrop" onClick={()=>setShow(false)}><form className="modal" onClick={e=>e.stopPropagation()} onSubmit={create}><h3>Create Budget</h3><select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>{Object.keys(LIMITS).map(c=><option key={c}>{c}</option>)}</select><input placeholder="Monthly Limit" type="number" value={form.limit} onChange={e=>setForm({...form, limit:e.target.value})} required /><button type="submit" className="primary-btn">Create Budget</button></form></div>}
    </div>
  )
}
