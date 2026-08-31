export default function BudgetCard({ category, spent, limit }) {
  const pct = Math.min(100, Math.round((spent/limit)*100)||0)
  return <div className="budget-card"><h4>{category}</h4><p>₹{spent.toFixed(0)} / ₹{limit}</p><div className="progress"><div style={{width:pct+'%'}}/></div><span>{pct}%</span></div>
}
