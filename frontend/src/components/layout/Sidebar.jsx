import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: '◧' },
  { to: '/transactions', label: 'Transactions', icon: '⇄' },
  { to: '/add-expense', label: 'Add Expense', icon: '＋' },
  { to: '/budgets', label: 'Budgets', icon: '◫' },
  { to: '/analysis', label: 'Analysis', icon: '📊' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">🟪 Expenses Tracker</div>
      <nav className="sidebar-nav">
        {items.map(i => (
          <NavLink key={i.to} to={i.to} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">{i.icon}</span> {i.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-email">{user?.email || 'user@example.com'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
