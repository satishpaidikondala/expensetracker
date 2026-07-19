export default function SummaryCards({
  totalSpent,
  expenseCount,
  mostExpensiveCategory,
  categorySummary,
}) {
  const categoryEntries = Object.entries(categorySummary)

  return (
    <div className="summary-cards">
      <div className="card">
        <span className="card-label">Total Spent</span>
        <span className="card-value">${totalSpent.toFixed(2)}</span>
      </div>
      <div className="card">
        <span className="card-label">Expenses</span>
        <span className="card-value">{expenseCount}</span>
      </div>
      <div className="card">
        <span className="card-label">Top Category</span>
        <span className="card-value">{mostExpensiveCategory}</span>
      </div>
      <div className="card">
        <span className="card-label">Categories</span>
        <span className="card-value">{categoryEntries.length}</span>
      </div>
    </div>
  )
}
