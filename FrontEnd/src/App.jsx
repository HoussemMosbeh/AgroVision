import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Terrain from './pages/Terrain'
import YieldPrediction from './pages/YieldPrediction'
import DiseaseDetection from './pages/DiseaseDetection'
import Login from './pages/Login'
import Register from './pages/Register'

// ProtectedRoute must be defined BEFORE it is used below
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="terrain" element={<Terrain />} />
          <Route path="yield" element={<YieldPrediction />} />
          <Route path="disease" element={<DiseaseDetection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App