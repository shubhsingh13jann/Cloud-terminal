import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectIsConnected } from '../../features/terminal/terminalSlice.js'

const TerminalToolbar = ({ onClear, onFontSizeChange, onAiAssist }) => {
  const isConnected = useSelector(selectIsConnected)
  const [fontSize, setFontSize] = useState(14)

  const handleFontIncrease = () => {
    const newSize = Math.min(fontSize + 2, 24)
    setFontSize(newSize)
    onFontSizeChange?.(newSize)
  }

  const handleFontDecrease = () => {
    const newSize = Math.max(fontSize - 2, 10)
    setFontSize(newSize)
    onFontSizeChange?.(newSize)
  }

  return (
    <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">

      {/* Left — Title + Status */}
      <div className="flex items-center gap-3">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        <span className="text-gray-300 text-sm font-mono">
          ☁️ Cloud Terminal
        </span>

        {/* Connection status */}
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}></div>
          <span className={`text-xs ${
            isConnected ? 'text-green-400' : 'text-red-400'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-2">

        {/* Font size controls */}
        <div className="flex items-center gap-1 bg-gray-700 rounded px-2 py-1">
          <button
            onClick={handleFontDecrease}
            className="text-gray-300 hover:text-white text-sm w-5 text-center"
            title="Decrease font size"
          >
            A-
          </button>
          <span className="text-gray-400 text-xs px-1">{fontSize}</span>
          <button
            onClick={handleFontIncrease}
            className="text-gray-300 hover:text-white text-sm w-5 text-center"
            title="Increase font size"
          >
            A+
          </button>
        </div>

        {/* Clear button */}
        <button
          onClick={onClear}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs px-3 py-1 rounded transition-colors"
          title="Clear terminal"
        >
          Clear
        </button>

        {/* AI Assist button */}
        <button
          onClick={onAiAssist}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1 rounded transition-colors flex items-center gap-1"
          title="AI Assistant"
        >
          🤖 AI Assist
        </button>
      </div>
    </div>
  )
}

export default TerminalToolbar