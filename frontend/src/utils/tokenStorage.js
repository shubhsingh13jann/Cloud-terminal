import { STORAGE_KEYS } from './constants.js'

// ===========================
// Token Storage Helpers
// ===========================

export const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export const setAccessToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

export const removeAccessToken = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export const clearAuth = () => {
  removeAccessToken()
  removeUser()
}