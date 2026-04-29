import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BrainCircuit, Leaf, ShieldCheck, BarChart3, Cloud, Sprout } from 'lucide-react'
import './LandingPage.css'

const features = [
  {
    icon: Leaf,
    title: 'Field Intelligence',
    description: 'Track parcels, soil metrics, and agronomic conditions in one clear operational view.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Disease Detection',
    description: 'Upload a leaf photo and get an instant CNN diagnosis across 38 disease classes.',
  },
  {
    icon: BarChart3,
    title: 'Yield Prediction',
    description: 'Forecast harvest yield in t/ha and quality grade using XGBoost and live climate data.',
  },
  {
    icon: Cloud,
    title: 'Live Climate Data',
    description: 'Predictions are enriched with real historical climate data from Open-Meteo by GPS coordinates.',
  },
  {
    icon: Sprout,
    title: 'Crop Association',
    description: 'Link crops to your fields with planting dates and track them through the season.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your farm data is protected with JWT authentication. Each farmer only sees their own fields.',
  },
]

const stats = [
  { value: '38',    label: 'Disease Classes' },
  { value: '0.991', label: 'Yield R² Score'  },
  { value: '71%',   label: 'Quality Accuracy' },
  { value: '24/7',  label: 'Available'        },
]

function LandingPage() {
  const [isScrolled, setIsScrolled]     = useState(false)
  const [visibleCards, setVisibleCards] = useState([])
  const cardRefs = useRef([])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = Number(entry.target.getAttribute('data-index'))
          setVisibleCards((prev) => (prev.includes(idx) ? prev : [...prev, idx]))
        })
      },
      { threshold: 0.15 }
    )
    cardRefs.current.forEach((card) => card && observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page">

      {/* ── Navbar ── */}
      <header className={`landing-nav ${isScrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav__inner">
          <div className="landing-nav__brand">🌱 AgroVision</div>
          <div className="landing-nav__links">
            <a href="#features">Features</a>
            <a href="#stats">Results</a>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </header>

      <main className="landing-page__content">

        {/* ── Hero ── */}
        <section className="landing-page__hero">
          <span className="landing-page__badge">🤖 Powered by EfficientNet-B0 & XGBoost</span>
          <h1 className="landing-page__title">
            Grow smarter with
            <span className="landing-page__title-gradient"> AI-powered farming</span>
          </h1>
          <p className="landing-page__subtitle">
            Detect plant diseases from a photo, predict your harvest yield, and manage
            all your fields and soil data — in one platform built for modern farmers.
          </p>
          <div className="landing-page__actions">
            <Link className="landing-page__btn landing-page__btn--primary" to="/register">
              Get Started Free
            </Link>
            <Link className="landing-page__btn landing-page__btn--outline" to="/login">
              Login
            </Link>
          </div>
          <div className="landing-page__trust">
            <span>✓ No installation</span>
            <span>✓ Instant results</span>
            <span>✓ Free to use</span>
          </div>
        </section>

        {/* ── Stats ── */}
        <section id="stats" className="landing-stats">
          {stats.map((s) => (
            <div className="landing-stat" key={s.label}>
              <p className="landing-stat__value">{s.value}</p>
              <p className="landing-stat__label">{s.label}</p>
            </div>
          ))}
        </section>

        {/* ── Features ── */}
        <section id="features" className="landing-features">
          <h2 className="landing-section-title">Everything in one workflow</h2>
          <div className="landing-features__grid">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  ref={(el) => { cardRefs.current[idx] = el }}
                  data-index={idx}
                  className={`feature-card ${visibleCards.includes(idx) ? 'feature-card--visible' : ''}`}
                >
                  <div className="feature-card__icon-wrap">
                    <Icon size={26} strokeWidth={2.2} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        

        {/* ── CTA ── */}
        <section className="landing-cta">
          <h2>Ready to start farming smarter?</h2>
          <p>Create your account in seconds. No credit card required.</p>
          <Link className="landing-page__btn landing-page__btn--primary" to="/register">
            Create Free Account
          </Link>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <span>🌱 AgroVision</span>
          <span>© 2025 AgroVision. All rights reserved.</span>
          <div>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage