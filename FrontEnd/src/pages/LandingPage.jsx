import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BrainCircuit, Leaf, ShieldCheck } from 'lucide-react'
import './LandingPage.css'

const features = [
  {
    icon: Leaf,
    title: 'Field Intelligence',
    description: 'Track parcels and agronomic conditions in one clear operational view.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Crop Insights',
    description: 'Detect disease patterns and optimize decisions with production-ready models.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable Planning',
    description: 'Forecast yield and reduce uncertainty with data-backed planning workflows.',
  },
]

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
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
      { threshold: 0.2 }
    )

    cardRefs.current.forEach((card) => card && observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page">
      <header className={`landing-nav ${isScrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav__inner">
          <div className="landing-nav__brand">🌱 AgroVision</div>
          <div className="landing-nav__links">
            <a href="#features">Features</a>
            <a href="#preview">Preview</a>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </header>

      <main className="landing-page__content">
        <section className="landing-page__hero">
          <span className="landing-page__badge">Modern Agriculture Platform</span>
          <h1 className="landing-page__title">
            Grow smarter with
            <span className="landing-page__title-gradient"> AI-powered farming</span>
          </h1>
          <p className="landing-page__subtitle">
            Improve crop outcomes with real-time insights, disease detection, and
            actionable predictions designed for modern operations.
          </p>
          <div className="landing-page__actions">
            <Link className="landing-page__btn landing-page__btn--primary" to="/login">
              Get Started
            </Link>
            <Link className="landing-page__btn landing-page__btn--outline" to="/register">
              Create Account
            </Link>
          </div>
        </section>

        <section id="features" className="landing-features">
          <h2 className="landing-section-title">Everything in one workflow</h2>
          <div className="landing-features__grid">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  ref={(el) => {
                    cardRefs.current[idx] = el
                  }}
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

        <section id="preview" className="landing-preview">
          <h2 className="landing-section-title">Preview the command center</h2>
          <div className="preview-mock">
            <div className="preview-mock__topbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-mock__body">
              <aside className="preview-mock__sidebar">
                <div />
                <div />
                <div />
              </aside>
              <div className="preview-mock__panels">
                <div className="preview-mock__panel preview-mock__panel--large" />
                <div className="preview-mock__panel-row">
                  <div className="preview-mock__panel" />
                  <div className="preview-mock__panel" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
