import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  setCredentials,
  setLoading,
  setError,
  clearError,
  selectAuthLoading,
  selectAuthError,
} from '../../features/auth/authSlice.js'
import { loginUser } from '../../services/auth.service.js'
import { ROUTES } from '../../utils/constants.js'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true))

    try {
      const data = await loginUser(formData.email, formData.password)
      dispatch(setCredentials({
        user: data.data.user,
        accessToken: data.data.accessToken,
      }))
      navigate(ROUTES.TERMINAL)
    } catch (err) {
      dispatch(setError(
        err.response?.data?.message || 'Login failed. Try again.'
      ))
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2">☁️</h1>
        <h2 className="text-white text-2xl font-bold">Cloud Terminal</h2>
        <p className="text-gray-400 text-sm mt-1">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">

        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors placeholder-gray-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors placeholder-gray-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-green-400 hover:text-green-300 font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm