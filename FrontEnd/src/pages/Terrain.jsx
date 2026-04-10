import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import './Terrain.css'

function Terrain() {
  const [fields, setFields]     = useState([])
  const [plantes, setPlantes]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')
  const [activeTab, setActiveTab] = useState('list')

  // Form states — mapped exactly to fieldRequestDTO
  const [fieldForm, setFieldForm] = useState({
    nom: '', superficie: '', pays: '', region: '', latitude: '', longitude: '',
  })

  // Soil form — mapped exactly to soilRequestDTO.Request
  const [soilForm, setSoilForm] = useState({
    ph: '', azote: '', phosphore: '', potassium: '',
    humidite: '', matiere_organique: '', temperature: '',
  })

  const [selectedFieldId, setSelectedFieldId] = useState(null)
  const [selectedPlanteId, setSelectedPlanteId] = useState('')
  const [datePlantation, setDatePlantation] = useState('')

  // Load fields and plantes on mount
  useEffect(() => {
    fetchFields()
    fetchPlantes()
  }, [])

  const fetchFields = async () => {
    try {
      const res = await axiosInstance.get('/fields')
      setFields(res.data)
    } catch (err) {
      console.error('Erreur chargement terrains', err)
    }
  }

  const fetchPlantes = async () => {
    try {
      const res = await axiosInstance.get('/plantes')
      setPlantes(res.data)
    } catch (err) {
      console.error('Erreur chargement plantes', err)
    }
  }

  const handleFieldSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await axiosInstance.post('/fields', {
        nom: fieldForm.nom,
        superficie: parseFloat(fieldForm.superficie),
        pays: fieldForm.pays,
        region: fieldForm.region,
        latitude: parseFloat(fieldForm.latitude),
        longitude: parseFloat(fieldForm.longitude),
      })
      setSuccess('Terrain créé avec succès !')
      setFieldForm({ nom: '', superficie: '', pays: '', region: '', latitude: '', longitude: '' })
      fetchFields()
      setActiveTab('list')
    } catch (err) {
      setError('Erreur lors de la création du terrain.')
    } finally {
      setLoading(false)
    }
  }

  const handleSoilSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFieldId) return setError('Sélectionnez un terrain d\'abord.')
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await axiosInstance.post(`/fields/${selectedFieldId}/soils`, {
        ph: parseFloat(soilForm.ph),
        azote: parseFloat(soilForm.azote),
        phosphore: parseFloat(soilForm.phosphore),
        potassium: parseFloat(soilForm.potassium),
        humidite: parseFloat(soilForm.humidite),
        matiere_organique: parseFloat(soilForm.matiere_organique),
        temperature: parseFloat(soilForm.temperature),
      })
      setSuccess('Métriques sol ajoutées avec succès !')
      setSoilForm({ ph: '', azote: '', phosphore: '', potassium: '', humidite: '', matiere_organique: '', temperature: '' })
    } catch (err) {
      setError('Erreur lors de l\'ajout des métriques sol.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlanteSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFieldId) return setError('Sélectionnez un terrain d\'abord.')
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await axiosInstance.post(
        `/fields/${selectedFieldId}/plantes?planteId=${selectedPlanteId}&datePlantation=${datePlantation}`
      )
      setSuccess('Culture associée avec succès !')
      setSelectedPlanteId('')
      setDatePlantation('')
    } catch (err) {
      setError('Erreur lors de l\'association de la culture.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fieldId) => {
    if (!window.confirm('Supprimer ce terrain ?')) return
    try {
      await axiosInstance.delete(`/fields/${fieldId}`)
      setSuccess('Terrain supprimé.')
      fetchFields()
    } catch (err) {
      setError('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="terrain">
      <div className="terrain__header">
        <h1 className="terrain__title">🌍 Mes Terrains</h1>
        <p className="terrain__subtitle">Gérez vos parcelles agricoles, sols et cultures</p>
      </div>

      {/* TABS */}
      <div className="terrain__tabs">
        {['list', 'create', 'soil', 'plante'].map(tab => (
          <button
            key={tab}
            className={`terrain__tab ${activeTab === tab ? 'terrain__tab--active' : ''}`}
            onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}
          >
            {tab === 'list'   && '📋 Mes terrains'}
            {tab === 'create' && '➕ Nouveau terrain'}
            {tab === 'soil'   && '🧪 Métriques sol'}
            {tab === 'plante' && '🌱 Associer culture'}
          </button>
        ))}
      </div>

      {/* ALERTS */}
      {success && <div className="alert alert--success">{success}</div>}
      {error   && <div className="alert alert--error">{error}</div>}

      {/* TAB: LIST */}
      {activeTab === 'list' && (
        <div className="terrain__list">
          {fields.length === 0 ? (
            <div className="terrain__empty">
              <p>Aucun terrain enregistré.</p>
              <button className="btn btn--primary" onClick={() => setActiveTab('create')}>
                Créer mon premier terrain
              </button>
            </div>
          ) : (
            <div className="field-grid">
              {fields.map(field => (
                <div
                  key={field.id}
                  className={`field-card ${selectedFieldId === field.id ? 'field-card--selected' : ''}`}
                  onClick={() => setSelectedFieldId(field.id)}
                >
                  <div className="field-card__header">
                    <span className="field-card__name">{field.nom}</span>
                    <button
                      className="field-card__delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(field.id) }}
                    >✕</button>
                  </div>
                  <div className="field-card__info">
                    <span>📍 {field.region}, {field.pays}</span>
                    <span>📐 {field.superficie} ha</span>
                    <span>🌐 {field.latitude}, {field.longitude}</span>
                  </div>
                  {selectedFieldId === field.id && (
                    <div className="field-card__selected-badge">✓ Sélectionné</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: CREATE FIELD */}
      {activeTab === 'create' && (
        <form className="terrain__form" onSubmit={handleFieldSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Nom du terrain</label>
              <input type="text" placeholder="Ex: Parcelle Nord"
                value={fieldForm.nom}
                onChange={e => setFieldForm({...fieldForm, nom: e.target.value})}
                required />
            </div>
            <div className="form-field">
              <label>Superficie (hectares)</label>
              <input type="number" step="0.01" placeholder="Ex: 5.5"
                value={fieldForm.superficie}
                onChange={e => setFieldForm({...fieldForm, superficie: e.target.value})}
                required />
            </div>
            <div className="form-field">
              <label>Pays</label>
              <input type="text" placeholder="Ex: Tunisie"
                value={fieldForm.pays}
                onChange={e => setFieldForm({...fieldForm, pays: e.target.value})}
                required />
            </div>
            <div className="form-field">
              <label>Région</label>
              <input type="text" placeholder="Ex: Sfax"
                value={fieldForm.region}
                onChange={e => setFieldForm({...fieldForm, region: e.target.value})}
                required />
            </div>
            <div className="form-field">
              <label>Latitude</label>
              <input type="number" step="0.000001" placeholder="Ex: 34.7406"
                value={fieldForm.latitude}
                onChange={e => setFieldForm({...fieldForm, latitude: e.target.value})}
                required />
            </div>
            <div className="form-field">
              <label>Longitude</label>
              <input type="number" step="0.000001" placeholder="Ex: 10.7603"
                value={fieldForm.longitude}
                onChange={e => setFieldForm({...fieldForm, longitude: e.target.value})}
                required />
            </div>
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Création...' : 'Créer le terrain'}
          </button>
        </form>
      )}

      {/* TAB: SOIL */}
      {activeTab === 'soil' && (
        <div>
          <div className="terrain__select-info">
            Terrain sélectionné : {selectedFieldId
              ? <strong>{fields.find(f => f.id === selectedFieldId)?.nom}</strong>
              : <span className="text-muted">Aucun — cliquez sur un terrain dans "Mes terrains"</span>
            }
          </div>
          <form className="terrain__form" onSubmit={handleSoilSubmit}>
            <div className="form-grid">
              {[
                { key: 'ph',               label: 'pH du sol',           placeholder: '0 - 14' },
                { key: 'azote',            label: 'Azote (N) mg/kg',     placeholder: 'Ex: 120' },
                { key: 'phosphore',        label: 'Phosphore (P) mg/kg', placeholder: 'Ex: 45' },
                { key: 'potassium',        label: 'Potassium (K) mg/kg', placeholder: 'Ex: 200' },
                { key: 'humidite',         label: 'Humidité (%)',        placeholder: 'Ex: 35' },
                { key: 'matiere_organique',label: 'Matière organique (%)',placeholder: 'Ex: 2.5' },
                { key: 'temperature',      label: 'Température (°C)',    placeholder: 'Ex: 22' },
              ].map(field => (
                <div className="form-field" key={field.key}>
                  <label>{field.label}</label>
                  <input
                    type="number" step="0.01"
                    placeholder={field.placeholder}
                    value={soilForm[field.key]}
                    onChange={e => setSoilForm({...soilForm, [field.key]: e.target.value})}
                    required
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer les métriques'}
            </button>
          </form>
        </div>
      )}

      {/* TAB: PLANTE */}
      {activeTab === 'plante' && (
        <div>
          <div className="terrain__select-info">
            Terrain sélectionné : {selectedFieldId
              ? <strong>{fields.find(f => f.id === selectedFieldId)?.nom}</strong>
              : <span className="text-muted">Aucun — cliquez sur un terrain dans "Mes terrains"</span>
            }
          </div>
          <form className="terrain__form" onSubmit={handlePlanteSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>Culture</label>
                <select
                  value={selectedPlanteId}
                  onChange={e => setSelectedPlanteId(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une culture...</option>
                  {plantes.map(p => (
                    <option key={p.id} value={p.id}>{p.nom}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Date de plantation</label>
                <input
                  type="date"
                  value={datePlantation}
                  onChange={e => setDatePlantation(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Association...' : 'Associer la culture'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Terrain