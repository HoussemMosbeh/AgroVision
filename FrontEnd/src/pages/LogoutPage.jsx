import { Link } from 'react-router-dom'
import './LogoutPage.css'

function LogoutPage() {
  return (
    <div className="logout-page">
      <div className="logout-page__card">
        <div className="logout-page__icon">✅</div>
        <h1 className="logout-page__title">Successfully logged out</h1>
        <p className="logout-page__subtitle">
          Your session has ended safely. Thanks for using AgroVision.
        </p>
        <div className="logout-page__actions">
          <Link className="logout-page__btn logout-page__btn--primary" to="/">
            Return to Home
          </Link>
          <Link className="logout-page__btn logout-page__btn--outline" to="/login">
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LogoutPage
