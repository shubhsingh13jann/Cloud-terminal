import { createSlice } from '@reduxjs/toolkit'

const containersSlice = createSlice({
  name: 'containers',
  initialState: {
    containers: [],
    loading: false,
    error: null,
  },
  reducers: {
    setContainers: (state, action) => {
      state.containers = action.payload
    },

    addContainer: (state, action) => {
      state.containers.unshift(action.payload)
    },

    updateContainer: (state, action) => {
      const index = state.containers.findIndex(
        (c) => c._id === action.payload._id
      )
      if (index !== -1) {
        state.containers[index] = action.payload
      }
    },

    removeContainer: (state, action) => {
      state.containers = state.containers.filter(
        (c) => c._id !== action.payload
      )
    },

    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setContainers,
  addContainer,
  updateContainer,
  removeContainer,
  setLoading,
  setError,
} = containersSlice.actions

// Selectors
export const selectContainers = (state) => state.containers.containers
export const selectContainersLoading = (state) => state.containers.loading
export const selectContainersError = (state) => state.containers.error

export default containersSlice.reducer