import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBars, FaChartLine, FaFlask, FaGlobeAfrica, FaTimes } from 'react-icons/fa'
import './Home.css'

const NAV_LINKS = [
  { label: 'Accueil', path: '/app' },
  { label: 'Terrains', path: '/app/terrain' },
  { label: 'Détection', path: '/app/disease' },
  { label: 'Prédiction', path: '/app/yield' },
]

const STATS = [
  { value: '95%', label: 'CNN Accuracy' },
  { value: '10K+', label: 'Farmers' },
  { value: '50+', label: 'Crops tracked' },
  { value: '24/7', label: 'Available' },
]

const FEATURES = [
  {
    icon: <FaGlobeAfrica aria-hidden="true" />,
    title: 'Field management',
    description:
      'Créez et gérez vos parcelles avec localisation, superficie et historique des cultures sur une interface claire.',
    path: '/app/terrain',
  },
  {
    icon: <FaFlask aria-hidden="true" />,
    title: 'Disease detection',
    description:
      "Analysez les feuilles en quelques secondes via notre modèle CNN pour identifier rapidement les risques.",
    path: '/app/disease',
  },
  {
    icon: <FaChartLine aria-hidden="true" />,
    title: 'Yield prediction',
    description:
      'Exploitez vos données de sol et météo avec l IA XGBoost pour anticiper rendement et qualité de récolte.',
    path: '/app/yield',
  },
]

function Home() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    // Handle navbar shadow on scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Progressive stats bar reveal on page load
    const timer = window.setTimeout(() => setStatsVisible(true), 180)
    return () => window.clearTimeout(timer)
  }, [])

  const goTo = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  return (
    <div className="home">
      {/* Barre de navigation principale */}
      <header className={`home__navbar ${isScrolled ? 'home__navbar--scrolled' : ''}`}>
        <div className="home__container home__navbar-inner">
          <button type="button" className="home__logo" onClick={() => goTo('/app')}>
            <span className="home__logo-icon" aria-hidden="true">🌱</span>
            <span>AgroVision</span>
          </button>

          <nav className={`home__nav ${isMenuOpen ? 'home__nav--open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                className="home__nav-link"
                onClick={() => goTo(link.path)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="home__nav-actions">
            <button type="button" className="home__btn home__btn--primary" onClick={() => goTo('/register')}>
              Commencer
            </button>
            <button
              type="button"
              className="home__menu-toggle"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Ouvrir le menu"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* Section hero avec proposition de valeur */}
      <section className="home__hero">
        <div className="home__container home__hero-grid">
          <div className="home__hero-content">
            <span className="home__badge"> Powered by AI</span>
            <h1 className="home__title">
              Cultivate better with AI{' '}
              <span className="home__title-highlight">intelligence</span>
            </h1>
            <p className="home__subtitle">
              AgroVision helps you manage your fields, track soil health, detect plant diseases,
              and predict yield with reliable AI models.
            </p>

            <div className="home__hero-cta">
              <button
                type="button"
                className="home__btn home__btn--primary"
                onClick={() => goTo('/app/terrain')}
              >
                Gérer mes terrains
              </button>
              <button type="button" className="home__btn home__btn--outline">
                Voir une démo
              </button>
            </div>

            <div className="home__trust">
              <span>✓ Gratuit</span>
              <span>✓ Sans installation</span>
              <span>✓ Résultats immédiats</span>
            </div>
          </div>

          <div className="home__hero-visual">
            <div className="home__hero-circle" aria-hidden="true" />
            <article className="home__prediction-card">
              <h3 className="home__prediction-title">AI Prediction</h3>
              <div className="home__prediction-row">
                <span>Crop</span>
                <strong>Wheat</strong>
              </div>
              <div className="home__prediction-row">
                <span>Yield</span>
                <strong>4.2 T/ha</strong>
              </div>
              <div className="home__prediction-row">
                <span>Confidence</span>
                <strong>94%</strong>
              </div>
              <div className="home__prediction-status">
                <span className="home__pulse-dot" />
                Analyzing...
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className={`home__stats ${statsVisible ? 'home__stats--visible' : ''}`}>
        <div className="home__container home__stats-grid">
          {STATS.map((stat) => (
            <article className="home__stat" key={stat.label}>
              <p className="home__stat-value">{stat.value}</p>
              <p className="home__stat-label">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home__features">
        <div className="home__container">
          <h2 className="home__section-title">Everything you need</h2>
          <div className="home__features-grid">
            {FEATURES.map((feature) => (
              <article className="home__feature-card" key={feature.title}>
                <div className="home__feature-icon">{feature.icon}</div>
                <h3 className="home__feature-title">{feature.title}</h3>
                <p className="home__feature-description">{feature.description}</p>
                <button
                  type="button"
                  className="home__feature-link"
                  onClick={() => goTo(feature.path)}
                >
                  Access →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="home__steps">
        <div className="home__container">
          <h2 className="home__section-title">How it works</h2>
          <div className="home__steps-line" aria-hidden="true" />
          <div className="home__steps-grid">
            <article className="home__step">
              <span className="home__step-number">1</span>
              <h3>Create your field</h3>
            </article>
            <article className="home__step">
              <span className="home__step-number">2</span>
              <h3>Add your data</h3>
            </article>
            <article className="home__step">
              <span className="home__step-number">3</span>
              <h3>Get AI predictions</h3>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home__footer">
        <div className="home__container home__footer-inner">
          <div className="home__footer-brand">
            <p className="home__logo home__logo--footer">
              <span className="home__logo-icon" aria-hidden="true">🌱</span>
              <span>AgroVision</span>
            </p>
            <p className="home__footer-tagline">
              Next-generation agricultural intelligence.
            </p>
          </div>

          <div className="home__footer-links">
            <button type="button" onClick={() => goTo('/app/terrain')}>Terrains</button>
            <button type="button" onClick={() => goTo('/app/disease')}>Détection</button>
            <button type="button" onClick={() => goTo('/app/yield')}>Prédiction</button>
          </div>

          <p className="home__footer-copy">© 2025 AgroVision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home