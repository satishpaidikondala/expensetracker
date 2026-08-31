const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function SummaryCards({
  totalSpent,
  expenseCount,
  mostExpensiveCategory,
  categorySummary,
  maxExpense,
  mostExpensiveArea,
  filterMonth,
  onFilterMonth,
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
        <span className="card-label">Max Expense</span>
        <span className="card-value">${Number(maxExpense).toFixed(2)}</span>
      </div>
      <div className="card">
        <span className="card-label">Most Expensive Area</span>
        <span className="card-value">{mostExpensiveArea}</span>
      </div>
      <div className="card card-filter">
        <span className="card-label">Filter Month</span>
        <select value={filterMonth} onChange={(e) => onFilterMonth(Number(e.target.value))}>
          <option value={-1}>All Months</option>
          {MONTHS.map((name, i) => (
            <option key={i} value={i}>{name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
