import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../features/auth/authSlice.js'
import {
  selectContainers,
  selectContainersLoading,
  setContainers,
  setLoading,
} from '../features/containers/containersSlice.js'
import { selectSessions } from '../features/terminal/terminalSlice.js'
import ContainerCard from '../components/container/ContainerCard.jsx'
import { ROUTES } from '../utils/constants.js'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const containers = useSelector(selectContainers)
  const loading = useSelector(selectContainersLoading)
  const sessions = useSelector(selectSessions)

  // Stats
  const stats = [
    {
      label: 'Total Containers',
      value: containers.length,
      icon: '📦',
      color: 'text-blue-400',
      bg: 'bg-blue-900/30',
    },
    {
      label: 'Running',
      value: containers.filter(c => c.status === 'running').length,
      icon: '🟢',
      color: 'text-green-400',
      bg: 'bg-green-900/30',
    },
    {
      label: 'Active Sessions',
      value: sessions.length,
      icon: '💻',
      color: 'text-purple-400',
      bg: 'bg-purple-900/30',
    },
    {
      label: 'Stopped',
      value: containers.filter(c => c.status === 'stopped').length,
      icon: '⏹️',
      color: 'text-gray-400',
      bg: 'bg-gray-700/30',
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your cloud terminals and containers
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-gray-700 rounded-xl p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-gray-400 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate(ROUTES.TERMINAL)}
          className="bg-green-600 hover:bg-green-500 text-white rounded-xl p-5 text-left transition-colors group"
        >
          <div className="text-2xl mb-2">💻</div>
          <h3 className="font-bold mb-1">Open Terminal</h3>
          <p className="text-green-200 text-sm">
            Start a new terminal session
          </p>
        </button>

        <button
          onClick={() => navigate(ROUTES.TERMINAL)}
          className="bg-purple-700 hover:bg-purple-600 text-white rounded-xl p-5 text-left transition-colors"
        >
          <div className="text-2xl mb-2">🤖</div>
          <h3 className="font-bold mb-1">AI Assistant</h3>
          <p className="text-purple-200 text-sm">
            Get help from Claude AI — Day 22
          </p>
        </button>
      </div>

      {/* Containers section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Your Containers</h2>
          <span className="text-gray-400 text-sm">
            Full container management coming Day 17
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">Loading containers...</div>
          </div>
        ) : containers.length === 0 ? (
          // Empty state
          <div className="bg-gray-800 border border-gray-700 border-dashed rounded-xl p-12 text-center">
            <p className="text-4xl mb-4">📦</p>
            <h3 className="text-white font-medium mb-2">No containers yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              Container creation coming Day 17
            </p>
            <button
              onClick={() => navigate(ROUTES.TERMINAL)}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg text-sm transition-colors"
            >
              Open Terminal Instead
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {containers.map((container) => (
              <ContainerCard
                key={container._id}
                container={container}
                onStart={() => {}}
                onStop={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage