import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from './features/auth/authSlice.js'
import TerminalPage from './pages/TerminalPage.jsx'
import { ROUTES } from './utils/constants.js'

// ===========================
// Protected Route Wrapper
// ===========================
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />
}

// ===========================
// Temporary Login Page
// (Real login UI comes Day 15)
// ===========================
const TempLogin = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <h1 className="text-white text-2xl font-bold mb-4">
          ☁️ Cloud Terminal
        </h1>
        <p className="text-gray-400 mb-6">
          Login page coming Day 15
        </p>
        <a
          href="/terminal"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Go to Terminal (Dev Mode)
        </a>
      </div>
    </div>
  )
}

// ===========================
// App Routes
// ===========================
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<TempLogin />} />
        <Route path={ROUTES.TERMINAL} element={<TerminalPage />} />
        <Route path="/" element={<Navigate to={ROUTES.TERMINAL} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App