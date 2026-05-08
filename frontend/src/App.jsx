import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsAuthenticated, setCredentials } from './features/auth/authSlice.js'
import TerminalPage from './pages/TerminalPage.jsx'
import { useState } from 'react'
import axios from 'axios'
import { API_URL, ROUTES } from './utils/constants.js'

// ===========================
// Protected Route Wrapper
// ===========================
const ProtectedRoute = ({ children, allowAccess }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated && allowAccess ? children : <Navigate to={ROUTES.LOGIN} replace />
}

// ===========================
// Temporary Login Page
// (Real login UI comes Day 15)
// ===========================
const TempLogin = ({ onLoginSuccess }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleQuickLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: 'shubhsingh.13jann@gmail.com',
        password: '7668746665',
      })

      const { user, accessToken } = response.data.data

      dispatch(setCredentials({ user, accessToken }))
      onLoginSuccess()
      navigate(ROUTES.TERMINAL)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg text-center w-80">
        <p className="text-4xl mb-4">☁️</p>
        <h1 className="text-white text-2xl font-bold mb-2">
          Cloud Terminal
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Development Quick Login
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-900/20 p-2 rounded">
            {error}
          </p>
        )}

        <button
          onClick={handleQuickLogin}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-600 text-white py-3 rounded-lg font-mono transition-colors"
        >
          {loading ? 'Logging in...' : '⚡ Quick Login (Dev)'}
        </button>

        <p className="text-gray-600 text-xs mt-4">
          Full login UI coming Day 15
        </p>
      </div>
    </div>
  )
}

// ===========================
// App Routes
// ===========================
const App = () => {
  const [hasLoggedInThisRun, setHasLoggedInThisRun] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={<TempLogin onLoginSuccess={() => setHasLoggedInThisRun(true)} />}
        />
        <Route
          path={ROUTES.TERMINAL}
          element={
            <ProtectedRoute allowAccess={hasLoggedInThisRun}>
              <TerminalPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
