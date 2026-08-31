import { useEffect, useState } from 'react'
import ExpenseTable from '../../components/ExpenseTable.jsx'
import { fetchExpenses, deleteExpense } from '../../services/expenseService.js'

export default function TransactionsPage() {
  const [expenses, setExpenses] = useState([])
  useEffect(()=>{ fetchExpenses().then(setExpenses).catch(()=>{}) },[])
  const onDelete = async (id) => { await deleteExpense(id); setExpenses(p=>p.filter(e=>e.id!==id)) }
  return <ExpenseTable expenses={expenses} onDelete={onDelete} />
}
