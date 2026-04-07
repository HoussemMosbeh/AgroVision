import { createContext, useContext, useState } from 'react'
import authService from '../api/authService'

// WHY context: Any component in the app can check if the user
// is logged in without passing props down through every level.
// Navbar can show username, ProtectedRoute can redirect, etc.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()  // check localStorage on load
  )
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setIsAuthenticated(true)
    return data
  }

  const register = async (nom, prenom, email, password) => {
    const data = await authService.register(nom, prenom, email, password)
    setIsAuthenticated(true)
    return data
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — components call useAuth() instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext)
}