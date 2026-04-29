import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './DashboardLayout.css'

function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__main">
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout