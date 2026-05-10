import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import terminalReducer from '../features/terminal/terminalSlice.js'
import containersReducer from '../features/containers/containersSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    terminal: terminalReducer,
    containers: containersReducer,
  },
})

export default store