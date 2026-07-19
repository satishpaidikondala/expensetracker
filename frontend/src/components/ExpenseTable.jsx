export default function ExpenseTable({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="expense-table">
        <h2>Expenses</h2>
        <p className="empty-state">No expenses yet. Add one above.</p>
      </div>
    )
  }

  return (
    <div className="expense-table">
      <h2>Expenses</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td><span className="category-badge">{expense.category}</span></td>
              <td>{expense.description || '—'}</td>
              <td className="amount-cell">${Number(expense.amount).toFixed(2)}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(expense.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
