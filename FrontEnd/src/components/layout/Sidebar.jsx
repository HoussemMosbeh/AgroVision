import { NavLink } from 'react-router-dom'
import { MdHome, MdTerrain, MdGrass, MdBiotech } from 'react-icons/md'
import './Sidebar.css'

const navItems = [
  { to: '/app',         icon: <MdHome />,    label: 'Accueil'      },
  { to: '/app/terrain', icon: <MdTerrain />, label: 'Mes Terrains' },
  { to: '/app/yield',   icon: <MdGrass />,   label: 'Prédiction'   },
  { to: '/app/disease', icon: <MdBiotech />, label: 'Détection'    },
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
            end={item.to === '/app'}
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