import ExpenseForm from '../../components/ExpenseForm.jsx'
import { createExpense } from '../../services/expenseService.js'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function AddExpensePage() {
  const nav = useNavigate()
  const [msg, setMsg] = useState('')
  const handleAdd = async (exp) => {
    await createExpense(exp)
    setMsg('Expense added!')
    setTimeout(()=> nav('/transactions'), 600)
  }
  return (
    <div>
      <h2>Add Expense</h2>
      <div className="toggle-row"><span className="toggle active">Expense</span><span className="toggle">Income</span></div>
      {msg && <div className="success-banner">{msg}</div>}
      <ExpenseForm onAdd={handleAdd} />
    </div>
  )
}
