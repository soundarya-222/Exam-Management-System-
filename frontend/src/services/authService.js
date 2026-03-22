import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const loginUser = async (data) => {
  const response = await api.post('/api/auth/login', data)
  return response.data
}

export const registerUser = async (data) => {
  const response = await api.post('/api/auth/register', data)
  return response.data
}

export default api
