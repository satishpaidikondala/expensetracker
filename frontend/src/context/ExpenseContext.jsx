import { createContext, useContext, useState, useCallback } from 'react'
import * as expenseService from '../services/expenseService.js'

const ExpenseContext = createContext(null)
export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([])
  const refresh = useCallback(async ()=> setExpenses(await expenseService.fetchExpenses().catch(()=>[])), [])
  return <ExpenseContext.Provider value={{ expenses, setExpenses, refresh }}>{children}</ExpenseContext.Provider>
}
export const useExpenses = () => useContext(ExpenseContext)
