import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from './features/auth/authSlice.js'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import TerminalPage from './pages/TerminalPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { ROUTES } from './utils/constants.js'

// ===========================
// Protected Route
// ===========================
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated
    ? children
    : <Navigate to={ROUTES.LOGIN} replace />
}

// ===========================
// Public Route
// Redirect to terminal if already logged in
// ===========================
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return !isAuthenticated
    ? children
    : <Navigate to={ROUTES.TERMINAL} replace />
}

// ===========================
// App Routes
// ===========================
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path={ROUTES.TERMINAL}
          element={
            <ProtectedRoute>
              <TerminalPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.TERMINAL} replace />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App