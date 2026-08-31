import { useAuth } from '../../context/AuthContext.jsx'

export default function Header({ title, subtitle }) {
  const { user } = useAuth()
  return (
    <header className="app-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="header-sub">{subtitle}</p>}
      </div>
      <div className="header-right">
        <div className="header-user-badge">
          <div className="header-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="header-user-meta">
            <span className="header-greeting">Hello, <strong>{user?.name || 'User'}</strong> 👋</span>
            <span className="header-date">{new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
