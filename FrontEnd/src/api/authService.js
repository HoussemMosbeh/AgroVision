import axiosInstance from './axiosInstance'

const authService = {

  // matches your RegisterRequest: { nom, prenom, email, password }
  register: async (nom, prenom, email, password) => {
    const response = await axiosInstance.post('/auth/register', {
      nom,
      prenom,
      email,
      password,
    })
    // your AuthResponse returns { token }
    localStorage.setItem('token', response.data.token)
    return response.data
  },

  // matches your LoginRequest: { email, password }
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    })
    // your AuthResponse returns { token }
    localStorage.setItem('token', response.data.token)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}

export default authService