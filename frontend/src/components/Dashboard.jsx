import { useState, useEffect, useCallback } from 'react'
import SummaryCards from './SummaryCards.jsx'
import ExpenseForm from './ExpenseForm.jsx'
import ExpenseTable from './ExpenseTable.jsx'

const API = 'http://localhost:8080/expenses'

export default function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [categorySummary, setCategorySummary] = useState({})
  const [error, setError] = useState(null)

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error(`Failed to fetch expenses`)
      const data = await res.json()
      setExpenses(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchCategorySummary = useCallback(async () => {
    try {
      const res = await fetch(`${API}/summary/by-category`)
      if (!res.ok) throw new Error(`Failed to fetch summary`)
      const data = await res.json()
      setCategorySummary(data)
    } catch {
      // non-critical
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
    fetchCategorySummary()
  }, [fetchExpenses, fetchCategorySummary])

  const handleAdd = async (expense) => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      })
      if (!res.ok) throw new Error('Failed to add expense')
      const created = await res.json()
      setExpenses((prev) => [...prev, created])
      fetchCategorySummary()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete expense')
      setExpenses((prev) => prev.filter((e) => e.id !== id))
      fetchCategorySummary()
    } catch (err) {
      setError(err.message)
    }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const mostExpensiveCategory = Object.entries(categorySummary).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  )[0]?.[0] || 'N/A'

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Expense Tracker</h1>
      </header>
      {error && <div className="error-banner">Error: {error}</div>}
      <SummaryCards
        totalSpent={totalSpent}
        expenseCount={expenses.length}
        mostExpensiveCategory={mostExpensiveCategory}
        categorySummary={categorySummary}
      />
      <ExpenseForm onAdd={handleAdd} />
      <ExpenseTable expenses={expenses} onDelete={handleDelete} />
    </div>
  )
}
