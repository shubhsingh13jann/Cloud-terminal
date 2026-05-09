import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RegisterForm from '../components/auth/RegisterForm.jsx'
import { selectIsAuthenticated } from '../features/auth/authSlice.js'
import { ROUTES } from '../utils/constants.js'

const RegisterPage = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.TERMINAL)
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#00ff00 1px, transparent 1px),
            linear-gradient(90deg, #00ff00 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage