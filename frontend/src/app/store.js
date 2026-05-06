import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import terminalReducer from '../features/terminal/terminalSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    terminal: terminalReducer,
  },
})

export default store