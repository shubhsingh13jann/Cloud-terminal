import { useDispatch, useSelector } from 'react-redux'
import {
  selectSessions,
  selectActiveSessionId,
  setActiveSession,
  removeSession,
} from '../../features/terminal/terminalSlice.js'
import useSocket from '../../hooks/useSocket.js'
import { SOCKET_EVENTS } from '../../utils/constants.js'

const TerminalTabs = ({ onNewTab }) => {
  const dispatch = useDispatch()
  const sessions = useSelector(selectSessions)
  const activeSessionId = useSelector(selectActiveSessionId)
  const { getSocket } = useSocket()

  const handleCloseTab = (e, sessionId) => {
    e.stopPropagation()

    // Kill terminal on server
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit(SOCKET_EVENTS.TERMINAL_KILL)
    }

    dispatch(removeSession(sessionId))
  }

  return (
    <div className="flex items-center bg-gray-900 border-b border-gray-700 overflow-x-auto min-h-[40px]">
      {sessions.map((session, index) => (
        <div
          key={session.sessionId}
          onClick={() => dispatch(setActiveSession(session.sessionId))}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-mono
            cursor-pointer border-r border-gray-700 min-w-max
            transition-colors duration-150 select-none
            ${activeSessionId === session.sessionId
              ? 'bg-gray-800 text-white border-t-2 border-t-green-400'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }
          `}
        >
          <span className="text-green-400 text-xs">$</span>
          <span>Terminal {index + 1}</span>
          <button
            onClick={(e) => handleCloseTab(e, session.sessionId)}
            className="ml-1 text-gray-500 hover:text-red-400 transition-colors text-xs leading-none"
          >
            ✕
          </button>
        </div>
      ))}

      {/* New Tab */}
      <button
        onClick={onNewTab}
        className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-xl leading-none select-none"
        title="New Terminal"
      >
        +
      </button>
    </div>
  )
}

export default TerminalTabs