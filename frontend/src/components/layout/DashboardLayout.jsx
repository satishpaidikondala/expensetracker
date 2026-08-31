import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

export default function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header title="Expenses Tracker" subtitle="Track expenses. Save more." />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
