export default function TopCategories({ totals, totalSpent }) {
  const sorted = Object.entries(totals||{}).sort((a,b)=>b[1]-a[1]).slice(0,5)
  return <div>{sorted.map(([k,v])=> <div key={k} className="topcat-row"><span>{k}</span><div className="bar"><div style={{width:`${(v/totalSpent*100)||0}%`}}/></div><span>₹{Number(v).toFixed(0)}</span></div>)}</div>
}
