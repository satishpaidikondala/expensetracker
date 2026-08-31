export default function TransactionRow({ expense, onDelete }) {
  return (
    <tr>
      <td>{expense.date}</td>
      <td><span className="category-badge">{expense.category}</span></td>
      <td>{expense.description||'—'}</td>
      <td className="amount-cell">₹{Number(expense.amount).toFixed(2)}</td>
      <td><button className="delete-btn" onClick={()=>onDelete(expense.id)}>✕</button></td>
    </tr>
  )
}
