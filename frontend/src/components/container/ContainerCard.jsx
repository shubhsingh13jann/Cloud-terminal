const ContainerCard = ({ container, onStart, onStop, onDelete }) => {
  const isRunning = container.status === 'running'

  const statusColors = {
    running: 'bg-green-500',
    stopped: 'bg-gray-500',
    created: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">

      {/* Top — Name + Status */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-medium text-sm">{container.name}</h3>
          <p className="text-gray-400 text-xs mt-1 font-mono">
            {container.containerId?.slice(0, 12) || 'Not created'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            statusColors[container.status] || 'bg-gray-500'
          } ${isRunning ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-medium capitalize ${
            isRunning ? 'text-green-400' : 'text-gray-400'
          }`}>
            {container.status}
          </span>
        </div>
      </div>

      {/* Middle — Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Image</span>
          <span className="text-gray-300 font-mono">{container.image}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Created</span>
          <span className="text-gray-300">
            {new Date(container.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isRunning ? (
          <button
            onClick={() => onStop(container._id)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs py-2 rounded-lg transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={() => onStart(container._id)}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg transition-colors"
          >
            Start
          </button>
        )}
        <button
          onClick={() => onDelete(container._id)}
          className="bg-red-900 hover:bg-red-700 text-red-300 text-xs py-2 px-3 rounded-lg transition-colors"
          title="Delete container"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default ContainerCard