import api from './api.js'

// Register new user
export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  })
  return response.data
}

// Login user
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  })
  return response.data
}

// Logout user
export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

// Get current user profile
export const getProfile = async () => {
  const response = await api.get('/users/me')
  return response.data
}