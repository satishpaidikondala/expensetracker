import { useState, useMemo } from 'react'

const PAGE_SIZE = 10

export default function ExpenseTable({ expenses, onDelete }) {
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortArrow = (field) => {
    if (sortBy !== field) return ''
    return sortOrder === 'asc' ? ' ▲' : ' ▼'
  }

  const filtered = useMemo(() => {
    let result = expenses

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          (e.description && e.description.toLowerCase().includes(q)) ||
          e.category.toLowerCase().includes(q)
      )
    }

    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortBy === 'amount') {
        cmp = Number(a.amount) - Number(b.amount)
      } else if (sortBy === 'date') {
        cmp = a.date.localeCompare(b.date)
      } else if (sortBy === 'category') {
        cmp = a.category.localeCompare(b.category)
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [expenses, search, sortBy, sortOrder])

  const exportCsv = () => {
    const header = 'Date,Category,Description,Amount\n'
    const rows = filtered.map(
      (e) => `${e.date},${e.category},"${e.description || ''}",${e.amount}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

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
      <div className="table-toolbar">
        <h2>Expenses</h2>
        <div className="toolbar-actions">
          <input
            className="search-input"
            type="text"
            placeholder="Search by description or category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
          <button className="csv-btn" onClick={exportCsv} title="Export CSV">CSV</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('date')}>Date{sortArrow('date')}</th>
            <th className="sortable" onClick={() => handleSort('category')}>Category{sortArrow('category')}</th>
            <th>Description</th>
            <th className="sortable" onClick={() => handleSort('amount')}>Amount{sortArrow('amount')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-state">No expenses match your search.</td>
            </tr>
          ) : (
            paginated.map((expense) => (
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
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
        <span>Page {safePage} of {totalPages}</span>
        <button disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  )
}
