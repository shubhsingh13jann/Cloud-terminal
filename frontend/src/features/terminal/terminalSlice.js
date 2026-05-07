import { createSlice } from '@reduxjs/toolkit'

const terminalSlice = createSlice({
  name: 'terminal',
  initialState: {
    sessions: [],
    activeSessionId: null,
    isConnected: false,
    isLoading: false,
    fontSize: 14,
  },
  reducers: {
    addSession: (state, action) => {
      state.sessions.push(action.payload)
      state.activeSessionId = action.payload.sessionId
    },

    removeSession: (state, action) => {
      state.sessions = state.sessions.filter(
        (s) => s.sessionId !== action.payload
      )
      if (state.activeSessionId === action.payload) {
        state.activeSessionId =
          state.sessions[state.sessions.length - 1]?.sessionId || null
      }
    },

    setActiveSession: (state, action) => {
      state.activeSessionId = action.payload
    },

    setConnected: (state, action) => {
      state.isConnected = action.payload
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setFontSize: (state, action) => {
      state.fontSize = action.payload
    },
  },
})

export const {
  addSession,
  removeSession,
  setActiveSession,
  setConnected,
  setLoading,
  setFontSize,
} = terminalSlice.actions

export const selectSessions = (state) => state.terminal.sessions
export const selectActiveSessionId = (state) => state.terminal.activeSessionId
export const selectIsConnected = (state) => state.terminal.isConnected
export const selectFontSize = (state) => state.terminal.fontSize

export default terminalSlice.reducer