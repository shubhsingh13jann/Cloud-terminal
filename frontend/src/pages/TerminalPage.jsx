import { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Terminal from '../components/terminal/Terminal.jsx'
import TerminalTabs from '../components/terminal/TerminalTabs.jsx'
import TerminalToolbar from '../components/terminal/TerminalToolbar.jsx'
import {
  selectSessions,
  selectActiveSessionId,
} from '../features/terminal/terminalSlice.js'

const TerminalPage = () => {
  const sessions = useSelector(selectSessions)
  const activeSessionId = useSelector(selectActiveSessionId)
  const [terminalKey, setTerminalKey] = useState(0)
  const [fontSize, setFontSize] = useState(14)
  const [clearSignal, setClearSignal] = useState(0)

  // Open new terminal tab
  const handleNewTab = useCallback(() => {
    setTerminalKey(prev => prev + 1)
  }, [])

  // Clear active terminal
  const handleClear = useCallback(() => {
    setClearSignal(prev => prev + 1)
  }, [])

  // AI Assist placeholder
  const handleAiAssist = useCallback(() => {
    alert('AI Assist coming Day 22! 🤖')
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">

      {/* Toolbar */}
      <TerminalToolbar
        onClear={handleClear}
        onFontSizeChange={setFontSize}
        onAiAssist={handleAiAssist}
      />

      {/* Tabs */}
      <TerminalTabs onNewTab={handleNewTab} />

      {/* Terminal Area */}
      <div className="flex-1 p-2 overflow-hidden">
        {sessions.length === 0 ? (
          // No sessions — show welcome screen
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-4">☁️</p>
              <h2 className="text-white text-xl font-bold mb-2">
                Cloud Terminal
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Click + to open a new terminal
              </p>
              <button
                onClick={handleNewTab}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg font-mono transition-colors"
              >
                + New Terminal
              </button>
            </div>
          </div>
        ) : (
          // Show active terminal
          <div className="w-full h-full">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className={`w-full h-full ${
                  activeSessionId === session.sessionId ? 'block' : 'hidden'
                }`}
                style={{ height: 'calc(100vh - 120px)' }}
              >
                <Terminal
                  key={session.sessionId}
                  containerId={session.containerId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TerminalPage