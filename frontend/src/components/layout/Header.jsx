import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser, logout } from '../../features/auth/authSlice.js'
import { selectIsConnected } from '../../features/terminal/terminalSlice.js'
import { logoutUser } from '../../services/auth.service.js'
import { ROUTES } from '../../utils/constants.js'

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const isConnected = useSelector(selectIsConnected)

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch {
      // Continue logout even if API fails
    } finally {
      dispatch(logout())
      navigate(ROUTES.LOGIN)
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">

      {/* Left — Logo + Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-white transition-colors p-1"
          title="Toggle sidebar"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">☁️</span>
          <span className="text-white font-bold text-sm hidden sm:block">
            Cloud Terminal
          </span>
        </div>
      </div>

      {/* Center — Connection status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
        }`} />
        <span className="text-xs text-gray-400 hidden sm:block">
          {isConnected ? 'Connected' : 'Offline'}
        </span>
      </div>

      {/* Right — User info + Logout */}
      <div className="flex items-center gap-3">
        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-gray-300 text-sm hidden sm:block">
            {user?.name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-400 text-sm transition-colors px-2 py-1 rounded hover:bg-gray-700"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header