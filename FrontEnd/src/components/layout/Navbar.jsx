import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/logout')
  }

  return (
    <header className="navbar">
      <div className="navbar__title">Welcome, Farmer 👋</div>
      <div className="navbar__actions">
        <span className="navbar__badge">Live</span>
        <button type="button" className="navbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar