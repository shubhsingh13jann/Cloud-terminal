import { createSlice } from '@reduxjs/toolkit'

const terminalSlice = createSlice({
  name: 'terminal',
  initialState: {
    sessions: [],          // All terminal sessions
    activeSessionId: null, // Currently active tab
    isConnected: false,    // Socket connection status
    isLoading: false,
  },
  reducers: {
    // Add new terminal session
    addSession: (state, action) => {
      state.sessions.push(action.payload)
      state.activeSessionId = action.payload.sessionId
    },

    // Remove terminal session
    removeSession: (state, action) => {
      state.sessions = state.sessions.filter(
        (s) => s.sessionId !== action.payload
      )
      // Set active to last remaining session
      if (state.activeSessionId === action.payload) {
        state.activeSessionId =
          state.sessions[state.sessions.length - 1]?.sessionId || null
      }
    },

    // Set active session (tab change)
    setActiveSession: (state, action) => {
      state.activeSessionId = action.payload
    },

    // Set socket connection status
    setConnected: (state, action) => {
      state.isConnected = action.payload
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  addSession,
  removeSession,
  setActiveSession,
  setConnected,
  setLoading,
} = terminalSlice.actions

// Selectors
export const selectSessions = (state) => state.terminal.sessions
export const selectActiveSessionId = (state) => state.terminal.activeSessionId
export const selectIsConnected = (state) => state.terminal.isConnected

export default terminalSlice.reducer