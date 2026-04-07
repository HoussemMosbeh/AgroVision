import { NavLink } from 'react-router-dom'
import { MdDashboard, MdGrass, MdBiotech } from 'react-icons/md'
import './Sidebar.css'

const navItems = [
  { to: '/',        icon: <MdDashboard />, label: 'Dashboard'      },
  { to: '/yield',   icon: <MdGrass />,     label: 'Yield Predict'  },
  { to: '/disease', icon: <MdBiotech />,   label: 'Disease Detect' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">🌱 AgroVision</div>
      <nav className="sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar