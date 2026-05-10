import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
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

  // Independent tab instances
  const [tabInstances, setTabInstances] = useState([])
  const [fontSize, setFontSize] = useState(14)

  const handleNewTab = useCallback(() => {
    const newTab = { id: `tab-${Date.now()}` }
    setTabInstances(prev => [...prev, newTab])
  }, [])

  const handleAiAssist = useCallback(() => {
    alert('AI Assist coming Day 22! 🤖')
  }, [])

  return (
    <div className="h-full flex flex-col bg-gray-900"
      style={{ height: 'calc(100vh - 57px)' }}
    >
      {/* Toolbar */}
      <TerminalToolbar
        onClear={() => {}}
        onFontSizeChange={setFontSize}
        onAiAssist={handleAiAssist}
      />

      {/* Tabs */}
      <TerminalTabs onNewTab={handleNewTab} />

      {/* Terminal Area */}
      <div className="flex-1 overflow-hidden p-2">
        {tabInstances.length === 0 ? (
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
          <div
            className="w-full h-full"
            style={{ height: 'calc(100vh - 180px)' }}
          >
            {tabInstances.map((tab, index) => (
              <div
                key={tab.id}
                className={`w-full h-full ${
                  // Show tab that matches active session
                  // or show last tab if no active session
                  index === tabInstances.length - 1 &&
                  !activeSessionId
                    ? 'block'
                    : sessions[index]?.sessionId === activeSessionId
                    ? 'block'
                    : 'hidden'
                }`}
              >
                <Terminal containerId={null} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TerminalPage