import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { logout } = useAuth()

  const username = useMemo(() => {
    const token = localStorage.getItem('token')
    if (!token) return 'Farmer'

    try {
      const payloadPart = token.split('.')[1]
      if (!payloadPart) return 'Farmer'

      const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(normalized))
      const fullName = [payload?.prenom, payload?.nom].filter(Boolean).join(' ').trim()

      if (fullName) return fullName
      if (payload?.username) return payload.username
      if (payload?.name) return payload.name
      if (payload?.email) return payload.email.split('@')[0]
      if (payload?.sub) return String(payload.sub).split('@')[0]
    } catch (error) {
      return 'Farmer'
    }

    return 'Farmer'
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="navbar">
      <div className="navbar__title">Welcome, {username} 👋</div>
      <div className="navbar__actions">
        <button type="button" className="navbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar