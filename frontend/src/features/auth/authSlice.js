import { createSlice } from '@reduxjs/toolkit'
import { getAccessToken, getUser, setAccessToken, setUser, clearAuth } from '../../utils/tokenStorage.js'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUser(),
    accessToken: getAccessToken(),
    isAuthenticated: !!getAccessToken(),
    loading: false,
    error: null,
  },
  reducers: {
    // Set credentials after login/register
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.isAuthenticated = true
      state.error = null
      // Persist to localStorage
      setAccessToken(accessToken)
      setUser(user)
    },

    // Clear credentials on logout
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      clearAuth()
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions

// Selectors
export const selectUser = (state) => state.auth.user
export const selectAccessToken = (state) => state.auth.accessToken
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer