import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import fieldService from '../api/fieldService'
import './Terrain.css'

function Terrain() {
  const [fields, setFields]   = useState([])
  const [plantes, setPlantes] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [activeTab, setActiveTab] = useState('list')

  const [fieldForm, setFieldForm] = useState({
    nom: '', superficie: '', pays: '', region: '', latitude: '', longitude: '',
  })
  const [soilForm, setSoilForm] = useState({
    ph: '', azote: '', phosphore: '', potassium: '',
    humidite: '', matiere_organique: '', temperature: '',
  })

  const [selectedFieldId, setSelectedFieldId]   = useState(null)
  const [selectedPlanteId, setSelectedPlanteId] = useState('')
  const [datePlantation, setDatePlantation]     = useState('')

  useEffect(() => { fetchFields(); fetchPlantes() }, [])

  const fetchFields = async () => {
    try { setFields(await fieldService.getAllFields()) }
    catch { setError('Impossible de charger les terrains.') }
  }
  const fetchPlantes = async () => {
    try { setPlantes(await fieldService.getAllPlantes()) }
    catch {}
  }

  const handleFieldAndSoilSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const created = await fieldService.createField({
        nom: fieldForm.nom,
        superficie: parseFloat(fieldForm.superficie),
        pays: fieldForm.pays,
        region: fieldForm.region,
        latitude: parseFloat(fieldForm.latitude),
        longitude: parseFloat(fieldForm.longitude),
      })
      const newId = created.id
      const hasSoil = Object.values(soilForm).some(v => v !== '')
      if (hasSoil) {
        await fieldService.addSoilMetrics(newId, {
          ph: parseFloat(soilForm.ph),
          azote: parseFloat(soilForm.azote),
          phosphore: parseFloat(soilForm.phosphore),
          potassium: parseFloat(soilForm.potassium),
          humidite: parseFloat(soilForm.humidite),
          matiere_organique: parseFloat(soilForm.matiere_organique),
          temperature: parseFloat(soilForm.temperature),
        })
      }
      setSuccess('Terrain créé avec succès !')
      setFieldForm({ nom: '', superficie: '', pays: '', region: '', latitude: '', longitude: '' })
      setSoilForm({ ph: '', azote: '', phosphore: '', potassium: '', humidite: '', matiere_organique: '', temperature: '' })
      fetchFields()
      setActiveTab('list')
    } catch (err) {
      console.error('Field creation error', err)
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Erreur lors de la création.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePlanteSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFieldId) return setError('Sélectionnez un terrain d\'abord.')
    setLoading(true); setError(''); setSuccess('')
    try {
      await fieldService.associatePlante(selectedFieldId, selectedPlanteId, datePlantation)
      setSuccess('Culture associée avec succès !')
      setSelectedPlanteId(''); setDatePlantation('')
    } catch {
      setError('Erreur lors de l\'association.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fieldId) => {
    if (!window.confirm('Supprimer ce terrain ?')) return
    try {
      await fieldService.deleteField(fieldId)
      setSelectedFieldId(prev => prev === fieldId ? null : prev)
      setSuccess('Terrain supprimé.')
      fetchFields()
    } catch {
      setError('Erreur lors de la suppression.')
    }
  }

  const tabs = [
    { key: 'list',   label: 'Mes Terrains',    icon: '▤' },
    { key: 'create', label: 'Nouveau Terrain',  icon: '+' },
    { key: 'plante', label: 'Associer Culture', icon: '❧' },
  ]

  return (
    <div className="t-page">
      <div className="t-hero">
        <div className="t-hero__accent" />
        <h1 className="t-hero__title">Gestion des Terrains</h1>
        <p className="t-hero__sub">Parcelles · Sols · Cultures</p>
      </div>

      <div className="t-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`t-tab ${activeTab === tab.key ? 't-tab--active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setError(''); setSuccess('') }}
          >
            <span className="t-tab__icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {success && <div className="t-alert t-alert--ok">{success}</div>}
      {error   && <div className="t-alert t-alert--err">{error}</div>}

      {/* LIST TAB */}
      {activeTab === 'list' && (
        <div className="t-section">
          {fields.length === 0 ? (
            <div className="t-empty">
              <span className="t-empty__icon">🌾</span>
              <p>Aucun terrain enregistré.</p>
              <button className="t-btn t-btn--primary" onClick={() => setActiveTab('create')}>
                Créer mon premier terrain
              </button>
            </div>
          ) : (
            <div className="t-grid">
              {fields.map(field => (
                <div
                  key={field.id}
                  className={`t-card ${selectedFieldId === field.id ? 't-card--active' : ''}`}
                  onClick={() => setSelectedFieldId(field.id)}
                >
                  <div className="t-card__top">
                    <span className="t-card__name">{field.nom}</span>
                    <button
                      className="t-card__del"
                      onClick={e => { e.stopPropagation(); handleDelete(field.id) }}
                    >✕</button>
                  </div>
                  <div className="t-card__meta">
                    <span>📍 {field.region}, {field.pays}</span>
                    <span>📐 {field.superficie} ha</span>
                    <span>🌐 {field.latitude}, {field.longitude}</span>
                  </div>
                  {selectedFieldId === field.id && (
                    <div className="t-card__badge">Sélectionné</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE + SOIL TAB */}
      {activeTab === 'create' && (
        <form className="t-section" onSubmit={handleFieldAndSoilSubmit}>
          <div className="t-block">
            <div className="t-block__header">
              <span className="t-block__num">01</span>
              <div>
                <h2 className="t-block__title">Informations du terrain</h2>
                <p className="t-block__desc">Localisation et superficie de la parcelle</p>
              </div>
            </div>
            <div className="t-form-grid">
              {[
                { key: 'nom',        label: 'Nom du terrain',       type: 'text',   placeholder: 'Ex: Parcelle Nord' },
                { key: 'superficie', label: 'Superficie (ha)',       type: 'number', placeholder: 'Ex: 5.5' },
                { key: 'pays',       label: 'Pays',                  type: 'text',   placeholder: 'Ex: Tunisie' },
                { key: 'region',     label: 'Région',                type: 'text',   placeholder: 'Ex: Sfax' },
                { key: 'latitude',   label: 'Latitude',              type: 'number', placeholder: 'Ex: 34.7406' },
                { key: 'longitude',  label: 'Longitude',             type: 'number', placeholder: 'Ex: 10.7603' },
              ].map(f => (
                <div className="t-field" key={f.key}>
                  <label className="t-label">{f.label}</label>
                  <input
                    className="t-input"
                    type={f.type}
                    step={f.type === 'number' ? '0.000001' : undefined}
                    placeholder={f.placeholder}
                    value={fieldForm[f.key]}
                    onChange={e => setFieldForm({ ...fieldForm, [f.key]: e.target.value })}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="t-divider"><span>Métriques Sol</span></div>

          <div className="t-block">
            <div className="t-block__header">
              <span className="t-block__num">02</span>
              <div>
                <h2 className="t-block__title">Composition du sol</h2>
                <p className="t-block__desc">Laissez vide pour renseigner plus tard</p>
              </div>
            </div>
            <div className="t-form-grid">
              {[
                { key: 'ph',                label: 'pH du sol',            placeholder: '0 – 14' },
                { key: 'azote',             label: 'Azote N (mg/kg)',      placeholder: 'Ex: 120' },
                { key: 'phosphore',         label: 'Phosphore P (mg/kg)',  placeholder: 'Ex: 45' },
                { key: 'potassium',         label: 'Potassium K (mg/kg)',  placeholder: 'Ex: 200' },
                { key: 'humidite',          label: 'Humidité (%)',         placeholder: 'Ex: 35' },
                { key: 'matiere_organique', label: 'Matière organique (%)',placeholder: 'Ex: 2.5' },
                { key: 'temperature',       label: 'Température (°C)',     placeholder: 'Ex: 22' },
              ].map(f => (
                <div className="t-field" key={f.key}>
                  <label className="t-label">{f.label}</label>
                  <input
                    className="t-input"
                    type="number"
                    step="0.01"
                    placeholder={f.placeholder}
                    value={soilForm[f.key]}
                    onChange={e => setSoilForm({ ...soilForm, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="t-actions">
            <button type="submit" className="t-btn t-btn--primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Créer le terrain'}
            </button>
            <button type="button" className="t-btn t-btn--ghost" onClick={() => setActiveTab('list')}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* PLANTE TAB */}
      {activeTab === 'plante' && (
        <div className="t-section">
          <div className="t-select-info">
            Terrain actif :&nbsp;
            {selectedFieldId
              ? <strong>{fields.find(f => f.id === selectedFieldId)?.nom}</strong>
              : <span className="t-muted">Aucun — sélectionnez un terrain dans "Mes Terrains"</span>
            }
          </div>
          <form onSubmit={handlePlanteSubmit}>
            <div className="t-block">
              <div className="t-form-grid t-form-grid--2">
                <div className="t-field">
                  <label className="t-label">Culture</label>
                  <select
                    className="t-input"
                    value={selectedPlanteId}
                    onChange={e => setSelectedPlanteId(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner une culture...</option>
                    {plantes.map(p => (
                      <option key={p.id} value={p.id}>{p.nomPlante}</option>
                    ))}
                  </select>
                </div>
                <div className="t-field">
                  <label className="t-label">Date de plantation</label>
                  <input
                    className="t-input"
                    type="date"
                    value={datePlantation}
                    onChange={e => setDatePlantation(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="t-actions">
              <button type="submit" className="t-btn t-btn--primary" disabled={loading || !selectedFieldId}>
                {loading ? 'Association...' : 'Associer la culture'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Terrain