// ===========================
// API & Socket URLs
// ===========================
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

// ===========================
// Socket Events
// ===========================
export const SOCKET_EVENTS = {
  // Terminal events
  TERMINAL_CREATE: 'terminal:create',
  TERMINAL_INPUT: 'terminal:input',
  TERMINAL_OUTPUT: 'terminal:output',
  TERMINAL_RESIZE: 'terminal:resize',
  TERMINAL_KILL: 'terminal:kill',
  TERMINAL_EXIT: 'terminal:exit',

  // Container events
  CONTAINER_STATUS: 'container:status',

  // AI events
  AI_ASSIST: 'ai:assist',
  AI_RESPONSE: 'ai:response',
}

// ===========================
// Local Storage Keys
// ===========================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
}

// ===========================
// Route Paths
// ===========================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TERMINAL: '/terminal',
}