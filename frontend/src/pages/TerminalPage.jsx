import { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Terminal from '../components/terminal/Terminal.jsx'
import TerminalTabs from '../components/terminal/TerminalTabs.jsx'
import TerminalToolbar from '../components/terminal/TerminalToolbar.jsx'
import {
  selectSessions,
  selectActiveSessionId,
  addSession,
} from '../features/terminal/terminalSlice.js'

// Unique ID generator
const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`

const TerminalPage = () => {
  const dispatch = useDispatch()
  const sessions = useSelector(selectSessions)
  const activeSessionId = useSelector(selectActiveSessionId)
  const [fontSize, setFontSize] = useState(14)

  // Open first terminal automatically on page load
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewTab()
    }
  }, [])

  // Open new terminal tab
  const handleNewTab = useCallback(() => {
    const tempId = generateTempId()
    dispatch(addSession({
      sessionId: tempId,
      containerId: null,
      createdAt: new Date().toISOString(),
    }))
  }, [dispatch])

  // AI Assist placeholder
  const handleAiAssist = useCallback(() => {
    alert('AI Assist coming Day 22! 🤖')
  }, [])

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">

      {/* Toolbar */}
      <TerminalToolbar
        onFontSizeChange={setFontSize}
        onAiAssist={handleAiAssist}
      />

      {/* Tabs */}
      <TerminalTabs onNewTab={handleNewTab} />

      {/* Terminal Area — takes remaining height */}
      <div className="flex-1 overflow-hidden min-h-0">
        {sessions.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-4">☁️</p>
              <p className="text-gray-400 text-sm">Opening terminal...</p>
            </div>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.sessionId}
              style={{ height: '100%' }}
              className={
                activeSessionId === session.sessionId ? 'block' : 'hidden'
              }
            >
              <Terminal
                key={session.sessionId}
                sessionId={session.sessionId}
                containerId={session.containerId}
                fontSize={fontSize}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TerminalPage