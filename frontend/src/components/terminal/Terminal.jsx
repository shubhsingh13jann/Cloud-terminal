import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useTerminal from '../../hooks/useTerminal.js'
import useSocket from '../../hooks/useSocket.js'
import { addSession } from '../../features/terminal/terminalSlice.js'
import { SOCKET_EVENTS } from '../../utils/constants.js'

const Terminal = ({ containerId = null }) => {
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const sessionIdRef = useRef(null)
  const { connect, getSocket } = useSocket()

  // Send input to correct PTY session
  const handleInput = useCallback((data) => {
    const socket = getSocket()
    if (socket?.connected && sessionIdRef.current) {
      // Send sessionId with input so server knows which PTY
      socket.emit(SOCKET_EVENTS.TERMINAL_INPUT, {
        sessionId: sessionIdRef.current,
        data,
      })
    }
  }, [getSocket])

  // Send resize to correct PTY session
  const handleResize = useCallback(({ cols, rows }) => {
    const socket = getSocket()
    if (socket?.connected && sessionIdRef.current) {
      socket.emit(SOCKET_EVENTS.TERMINAL_RESIZE, {
        sessionId: sessionIdRef.current,
        cols,
        rows,
      })
    }
  }, [getSocket])

  const {
    writeToTerminal,
    getDimensions,
    focusTerminal,
  } = useTerminal(containerRef, handleInput, handleResize)

  useEffect(() => {
    const timer = setTimeout(() => {
      const socket = connect()

      if (!socket) {
        console.error('❌ Could not connect — no token')
        return
      }

      const { cols, rows } = getDimensions()

      // Create terminal session
      socket.emit(
        SOCKET_EVENTS.TERMINAL_CREATE,
        { cols, rows, containerId },
        (response) => {
          if (response?.success) {
            const { sessionId } = response
            sessionIdRef.current = sessionId

            dispatch(addSession({
              sessionId,
              containerId,
              createdAt: new Date().toISOString(),
            }))

            // ✅ Listen to UNIQUE event for THIS session only
            socket.on(`terminal:output:${sessionId}`, (data) => {
              writeToTerminal(data)
            })

            socket.on(`terminal:exit:${sessionId}`, ({ exitCode }) => {
              writeToTerminal(
                `\r\n\x1b[33m[Process exited with code ${exitCode}]\x1b[0m\r\n`
              )
            })

            focusTerminal()
          } else {
            console.error('❌ Terminal create failed:', response?.error)
          }
        }
      )
    }, 500)

    return () => {
      clearTimeout(timer)
      const socket = getSocket()
      const sessionId = sessionIdRef.current

      if (socket && sessionId) {
        // Remove ONLY this session's listeners
        socket.off(`terminal:output:${sessionId}`)
        socket.off(`terminal:exit:${sessionId}`)

        // Kill this specific session
        socket.emit(SOCKET_EVENTS.TERMINAL_KILL, { sessionId })
      }
    }
  }, [])

  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-b-lg overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full p-1"
        style={{ minHeight: '400px' }}
        onClick={focusTerminal}
      />
    </div>
  )
}

export default Terminal