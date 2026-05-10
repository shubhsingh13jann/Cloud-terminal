import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { selectUser } from '../../features/auth/authSlice.js'
import { selectContainers } from '../../features/containers/containersSlice.js'
import { ROUTES } from '../../utils/constants.js'

const Sidebar = ({ isOpen }) => {
  const user = useSelector(selectUser)
  const containers = useSelector(selectContainers)
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`

  return (
    <aside className={`
      bg-gray-800 border-r border-gray-700
      flex flex-col
      transition-all duration-300
      ${isOpen ? 'w-60' : 'w-0 overflow-hidden'}
    `}>

      {/* User info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-white text-sm font-medium truncate">
              {user?.name}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider px-3 py-2">
          Navigation
        </p>

        <NavLink to={ROUTES.DASHBOARD} className={navLinkClass}>
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to={ROUTES.TERMINAL} className={navLinkClass}>
          <span>💻</span>
          <span>Terminal</span>
        </NavLink>

        {/* Containers quick list */}
        {containers.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider px-3 py-2">
              Containers
            </p>
            {containers.slice(0, 5).map((container) => (
              <button
                key={container._id}
                onClick={() => navigate(ROUTES.TERMINAL)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  container.status === 'running'
                    ? 'bg-green-400'
                    : 'bg-gray-500'
                }`} />
                <span className="truncate">{container.name}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs text-center">
          Cloud Terminal v1.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar