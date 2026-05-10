import api from './api.js'

// Get all containers for current user
export const getContainers = async () => {
  const response = await api.get('/containers')
  return response.data
}

// Create new container
export const createContainer = async (name, image = 'alpine') => {
  const response = await api.post('/containers', { name, image })
  return response.data
}

// Start container
export const startContainer = async (containerId) => {
  const response = await api.post(`/containers/${containerId}/start`)
  return response.data
}

// Stop container
export const stopContainer = async (containerId) => {
  const response = await api.post(`/containers/${containerId}/stop`)
  return response.data
}

// Delete container
export const deleteContainer = async (containerId) => {
  const response = await api.delete(`/containers/${containerId}`)
  return response.data
}