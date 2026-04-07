import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  // matches your RegisterRequest exactly: nom, prenom, email, password
  const [nom, setNom]           = useState('')
  const [prenom, setPrenom]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(nom, prenom, email, password)
      navigate('/')          // redirect to dashboard after register
    } catch (err) {
      setError('Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">🌱 AgroVision</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join AgroVision as a farmer</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <div className="auth-field">
              <label>Last name (Nom)</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Dupont"
                required
              />
            </div>
            <div className="auth-field">
              <label>First name (Prénom)</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Jean"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register