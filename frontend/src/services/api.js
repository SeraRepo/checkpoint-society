import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Configure axios to handle API responses
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor to handle standardized API responses
apiClient.interceptors.response.use(
  (response) => {
    // If response has success property, extract data
    if (response.data && response.data.success !== undefined) {
      return response.data.data !== undefined ? response.data.data : response.data
    }
    return response.data
  },
  (error) => {
    // Handle error responses
    if (error.response && error.response.data) {
      const errorData = error.response.data

      // If error follows our API structure
      if (errorData.error) {
        const apiError = new Error(errorData.error.message || 'An error occurred')
        apiError.code = errorData.error.code
        apiError.details = errorData.error.details
        apiError.statusCode = error.response.status
        throw apiError
      }
    }

    // Default error
    throw new Error(error.message || 'Network error occurred')
  }
)

const api = {
  async getSessions() {
    const response = await apiClient.get('/sessions')
    return response
  },

  async createBooking(bookingData) {
    const response = await apiClient.post('/bookings', bookingData)
    return response
  },

  async getAllBookings() {
    const response = await apiClient.get('/bookings')
    return response
  },

  async updateBooking(bookingId, data) {
    const response = await apiClient.put(`/bookings/${bookingId}`, data)
    return response
  },

  async deleteBooking(bookingId) {
    await apiClient.delete(`/bookings/${bookingId}`)
    return { success: true }
  },

  async login(username, password) {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    })
    return { success: true, ...response }
  },

  async createSession(sessionData) {
    const response = await apiClient.post('/sessions', sessionData)
    return response
  },

  async updateSession(sessionId, sessionData) {
    const response = await apiClient.put(`/sessions/${sessionId}`, sessionData)
    return response
  },

  async deleteSession(sessionId) {
    await apiClient.delete(`/sessions/${sessionId}`)
    return { success: true }
  },

  async getSettings() {
    const response = await apiClient.get('/settings')
    return response
  },

  async getSetting(key) {
    const response = await apiClient.get(`/settings/${key}`)
    return response
  },

  async updateSetting(key, value) {
    const response = await apiClient.put(`/settings/${key}`, { value })
    return response
  },

  async getBookingByToken(token) {
    const response = await apiClient.get(`/bookings/token/${token}`)
    return response
  },

  async updateBookingByToken(token, data) {
    const response = await apiClient.put(`/bookings/token/${token}`, data)
    return response
  }
}

export default api
