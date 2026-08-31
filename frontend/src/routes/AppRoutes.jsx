import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import LoginPage from '../pages/Login/LoginPage.jsx'
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx'
import AddExpensePage from '../pages/AddExpense/AddExpensePage.jsx'
import TransactionsPage from '../pages/Transactions/TransactionsPage.jsx'
import AnalysisPage from '../pages/Analysis/AnalysisPage.jsx'
import BudgetsPage from '../pages/Budgets/BudgetsPage.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Protected({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      <Route element={<Protected><DashboardLayout /></Protected>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/add-expense" element={<AddExpensePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
