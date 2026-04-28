import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBars, FaChartLine, FaFlask, FaGlobeAfrica, FaTimes } from 'react-icons/fa'
import './Home.css'

const NAV_LINKS = [
  { label: 'Accueil', path: '/' },
  { label: 'Terrains', path: '/terrain' },
  { label: 'Détection', path: '/detection' },
  { label: 'Prédiction', path: '/prediction' },
]

const STATS = [
  { value: '95%', label: 'Précision CNN' },
  { value: '10K+', label: 'Agriculteurs' },
  { value: '50+', label: 'Cultures' },
  { value: '24/7', label: 'Disponible' },
]

const FEATURES = [
  {
    icon: <FaGlobeAfrica aria-hidden="true" />,
    title: 'Gestion des terrains',
    description:
      'Créez et gérez vos parcelles avec localisation, superficie et historique des cultures sur une interface claire.',
    path: '/terrain',
  },
  {
    icon: <FaFlask aria-hidden="true" />,
    title: 'Détection maladies',
    description:
      "Analysez les feuilles en quelques secondes via notre modèle CNN pour identifier rapidement les risques.",
    path: '/detection',
  },
  {
    icon: <FaChartLine aria-hidden="true" />,
    title: 'Prédiction rendement',
    description:
      'Exploitez vos données de sol et météo avec l IA XGBoost pour anticiper rendement et qualité de récolte.',
    path: '/prediction',
  },
]

function Home() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    // Gestion de l ombre de la navbar au scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Apparition progressive de la barre de statistiques
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
          <button type="button" className="home__logo" onClick={() => goTo('/')}>
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
            <span className="home__badge">🤖 Powered by AI</span>
            <h1 className="home__title">
              Cultivez mieux avec l intelligence{' '}
              <span className="home__title-highlight">artificielle</span>
            </h1>
            <p className="home__subtitle">
              AgroVision vous aide a piloter vos terrains, suivre la sante des sols, detecter
              les maladies de vos plantes et predire le rendement avec des modeles IA fiables.
            </p>

            <div className="home__hero-cta">
              <button type="button" className="home__btn home__btn--primary" onClick={() => goTo('/terrain')}>
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
              <h3 className="home__prediction-title">Prédiction IA</h3>
              <div className="home__prediction-row">
                <span>Culture</span>
                <strong>Blé</strong>
              </div>
              <div className="home__prediction-row">
                <span>Rendement</span>
                <strong>4.2 T/ha</strong>
              </div>
              <div className="home__prediction-row">
                <span>Confiance</span>
                <strong>94%</strong>
              </div>
              <div className="home__prediction-status">
                <span className="home__pulse-dot" />
                En cours d analyse...
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Barre de statistiques */}
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

      {/* Section des fonctionnalites */}
      <section className="home__features">
        <div className="home__container">
          <h2 className="home__section-title">Tout ce dont vous avez besoin</h2>
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
                  Accéder →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section du fonctionnement en trois etapes */}
      <section className="home__steps">
        <div className="home__container">
          <h2 className="home__section-title">Comment ça marche ?</h2>
          <div className="home__steps-line" aria-hidden="true" />
          <div className="home__steps-grid">
            <article className="home__step">
              <span className="home__step-number">1</span>
              <h3>Créez votre terrain</h3>
            </article>
            <article className="home__step">
              <span className="home__step-number">2</span>
              <h3>Ajoutez vos données</h3>
            </article>
            <article className="home__step">
              <span className="home__step-number">3</span>
              <h3>Obtenez les prédictions IA</h3>
            </article>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="home__footer">
        <div className="home__container home__footer-inner">
          <div className="home__footer-brand">
            <p className="home__logo home__logo--footer">
              <span className="home__logo-icon" aria-hidden="true">🌱</span>
              <span>AgroVision</span>
            </p>
            <p className="home__footer-tagline">
              L intelligence agricole de nouvelle generation.
            </p>
          </div>

          <div className="home__footer-links">
            <button type="button" onClick={() => goTo('/terrain')}>Terrains</button>
            <button type="button" onClick={() => goTo('/detection')}>Détection</button>
            <button type="button" onClick={() => goTo('/prediction')}>Prédiction</button>
          </div>

          <p className="home__footer-copy">© 2025 AgroVision. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home