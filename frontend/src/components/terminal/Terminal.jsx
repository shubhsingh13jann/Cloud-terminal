import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useTerminal from '../../hooks/useTerminal.js'
import useSocket from '../../hooks/useSocket.js'
import { addSession } from '../../features/terminal/terminalSlice.js'
import { SOCKET_EVENTS } from '../../utils/constants.js'

const Terminal = ({ containerId = null, sessionId: propSessionId = null }) => {
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const sessionIdRef = useRef(propSessionId)
  const { connect, getSocket } = useSocket()

  // Send input to server
  const handleInput = useCallback((data) => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit(SOCKET_EVENTS.TERMINAL_INPUT, data)
    }
  }, [getSocket])

  // Send resize to server
  const handleResize = useCallback(({ cols, rows }) => {
    const socket = getSocket()
    if (socket?.connected && sessionIdRef.current) {
      socket.emit(SOCKET_EVENTS.TERMINAL_RESIZE, { cols, rows })
    }
  }, [getSocket])

  const {
    writeToTerminal,
    getDimensions,
    focusTerminal,
    fitTerminal,
    clearTerminal,
    changeFontSize,
  } = useTerminal(containerRef, handleInput, handleResize)

  // Change font size when prop changes
  useEffect(() => {
    changeFontSize(fontSize)
  }, [fontSize])

  // Clear terminal when signal changes
  useEffect(() => {
    if (clearSignal > 0) {
      clearTerminal() 
    }
  }, [clearSignal])

  useEffect(() => {
    const socket = connect()
    const { cols, rows } = getDimensions()

    // Request new terminal
    socket.emit(
      SOCKET_EVENTS.TERMINAL_CREATE,
      { cols, rows, containerId },
      (response) => {
        if (response?.success) {
          sessionIdRef.current = response.sessionId
          if (!propSessionId) {
            dispatch(addSession({
              sessionId: response.sessionId,
              containerId,
              createdAt: new Date().toISOString(),
            }))
          }
          focusTerminal()
        }
      }
    )

    // Receive output
    socket.on(SOCKET_EVENTS.TERMINAL_OUTPUT, (data) => {
      writeToTerminal(data)
    })

    // Terminal process exited
    socket.on(SOCKET_EVENTS.TERMINAL_EXIT, ({ exitCode }) => {
      writeToTerminal(
        `\r\n\x1b[33m[Process exited with code ${exitCode}]\x1b[0m\r\n`
      )
    })

    return () => {
      socket.off(SOCKET_EVENTS.TERMINAL_OUTPUT)
      socket.off(SOCKET_EVENTS.TERMINAL_EXIT)
      if (sessionIdRef.current) {
        socket.emit(SOCKET_EVENTS.TERMINAL_KILL)
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
