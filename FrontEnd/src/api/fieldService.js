import axiosInstance from './axiosInstance'

const normalizeField = (field) => ({
  ...field,
  superficie: field.superficie ?? field.surface,
})

const fieldService = {

  // GET /api/fields — tous les terrains de l'utilisateur connecté
  getAllFields: async () => {
    const response = await axiosInstance.get('/fields')
    return response.data.map(normalizeField)
  },

  // GET /api/fields/:id
  getFieldById: async (fieldId) => {
    const response = await axiosInstance.get(`/fields/${fieldId}`)
    return normalizeField(response.data)
  },

  // POST /api/fields — fieldRequestDTO: { nom, superficie, pays, region, latitude, longitude }
  createField: async (fieldData) => {
    const response = await axiosInstance.post('/fields', fieldData)
    return normalizeField(response.data)
  },

  // PUT /api/fields/:id
  updateField: async (fieldId, fieldData) => {
    const response = await axiosInstance.put(`/fields/${fieldId}`, fieldData)
    return normalizeField(response.data)
  },

  // DELETE /api/fields/:id
  deleteField: async (fieldId) => {
    await axiosInstance.delete(`/fields/${fieldId}`)
  },

  // GET /api/plantes — liste de toutes les plantes disponibles
  getAllPlantes: async () => {
    const response = await axiosInstance.get('/plantes')
    return response.data
  },

  // POST /api/fields/:id/soils — soilRequestDTO.Request
  addSoilMetrics: async (fieldId, soilData) => {
    const response = await axiosInstance.post(`/fields/${fieldId}/soils`, soilData)
    return response.data
  },

  // GET /api/fields/:id/soils
  getSoilMetrics: async (fieldId) => {
    const response = await axiosInstance.get(`/fields/${fieldId}/soils`)
    return response.data
  },

  // POST /api/fields/:id/plantes?planteId=X&datePlantation=YYYY-MM-DD
  associatePlante: async (fieldId, planteId, datePlantation) => {
    const response = await axiosInstance.post(
      `/fields/${fieldId}/plantes?planteId=${planteId}&datePlantation=${datePlantation}`
    )
    return response.data
  },

  // GET /api/fields/:id/plantes
  getCulturesForField: async (fieldId) => {
    const response = await axiosInstance.get(`/fields/${fieldId}/plantes`)
    return response.data
  },
}

export default fieldService