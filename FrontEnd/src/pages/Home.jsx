import { useNavigate } from 'react-router-dom'
import './Home.css'

const features = [
  {
    icon: '🌾',
    title: 'Gestion des terrains',
    description: 'Ajoutez vos parcelles, suivez leur superficie, localisation et cultures associées.',
    path: '/app/terrain',
    color: 'green',
  },
  {
    icon: '🔬',
    title: 'Détection des maladies',
    description: 'Uploadez une photo de votre plante — notre IA CNN identifie la maladie en secondes.',
    path: '/app/disease',
    color: 'purple',
  },
  {
    icon: '📈',
    title: 'Prédiction de rendement',
    description: 'Notre modèle XGBoost prédit votre rendement selon les données sol et climat.',
    path: '/app/yield',
    color: 'amber',
  },
]

const stats = [
  { value: '95%', label: 'Précision CNN' },
  { value: '10K+', label: 'Agriculteurs' },
  { value: '50+', label: 'Cultures suivies' },
  { value: '24/7', label: 'Disponibilité' },
]

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">🌱 Plateforme agricole intelligente</span>
          <h1 className="hero__title">
            Cultivez mieux avec<br />
            <span className="hero__title--accent">l'intelligence artificielle</span>
          </h1>
          <p className="hero__subtitle">
            AgroVision combine la puissance de l'IA et des données terrain pour
            aider les agriculteurs à maximiser leurs rendements et protéger leurs cultures.
          </p>
          <div className="hero__actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate('/app/terrain')}
            >
              Gérer mes terrains
            </button>
            <button
              className="btn btn--outline"
              onClick={() => navigate('/app/disease')}
            >
              Détecter une maladie
            </button>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__circle">🌍</div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2 className="features__title">Tout ce dont vous avez besoin</h2>
        <p className="features__subtitle">
          Une plateforme complète pensée pour l'agriculteur moderne
        </p>
        <div className="features__grid">
          {features.map((feature, i) => (
            <div
              className={`feature-card feature-card--${feature.color}`}
              key={i}
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.description}</p>
              <span className="feature-card__link">
                Accéder →
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home