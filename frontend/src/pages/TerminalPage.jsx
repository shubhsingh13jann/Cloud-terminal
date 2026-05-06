import Terminal from '../components/terminal/Terminal.jsx'

const TerminalPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
        {/* Traffic light buttons */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-sm font-mono">
          Cloud Terminal — bash
        </span>
      </div>

      {/* Terminal area */}
      <div className="flex-1 p-4">
        <Terminal />
      </div>
    </div>
  )
}

export default TerminalPage