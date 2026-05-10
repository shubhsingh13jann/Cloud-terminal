import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from './features/auth/authSlice.js'
import AppShell from './components/layout/AppShell.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TerminalPage from './pages/TerminalPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { ROUTES } from './utils/constants.js'

// Protected Route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated
    ? <AppShell>{children}</AppShell>
    : <Navigate to={ROUTES.LOGIN} replace />
}

// Public Route
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return !isAuthenticated
    ? children
    : <Navigate to={ROUTES.DASHBOARD} replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path={ROUTES.LOGIN} element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path={ROUTES.REGISTER} element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

        {/* Protected */}
        <Route path={ROUTES.DASHBOARD} element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path={ROUTES.TERMINAL} element={
          <ProtectedRoute><TerminalPage /></ProtectedRoute>
        } />

        {/* Redirects */}
        <Route path={ROUTES.HOME} element={
          <Navigate to={ROUTES.DASHBOARD} replace />
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App