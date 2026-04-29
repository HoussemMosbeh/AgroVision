import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Terrain from './pages/Terrain'
import YieldPrediction from './pages/YieldPrediction'
import DiseaseDetection from './pages/DiseaseDetection'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'
import LogoutPage from './pages/LogoutPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="terrain" element={<Terrain />} />
          <Route path="yield" element={<YieldPrediction />} />
          <Route path="disease" element={<DiseaseDetection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App