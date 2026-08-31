export default function RecentTransactions({ items }) {
  if (!items?.length) return <p className="empty-state">No transactions</p>
  return <div>{items.map(e=> <div key={e.id} className="recent-row"><span>{e.description||e.category}</span><span>₹{Number(e.amount).toFixed(2)}</span></div>)}</div>
}
