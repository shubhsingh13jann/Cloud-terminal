import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useTerminal from '../../hooks/useTerminal.js'
import useSocket from '../../hooks/useSocket.js'
import { removeSession } from '../../features/terminal/terminalSlice.js'
import { SOCKET_EVENTS } from '../../utils/constants.js'

const Terminal = ({ sessionId: propSessionId, containerId = null, fontSize = 14 }) => {
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const sessionIdRef = useRef(null)
  const isInitialized = useRef(false)
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
    changeFontSize,
  } = useTerminal(containerRef, handleInput, handleResize)

  // Update font size when prop changes
  useEffect(() => {
    changeFontSize(fontSize)
  }, [fontSize, changeFontSize])

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (isInitialized.current) return
    isInitialized.current = true

    const socket = connect()

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const { cols, rows } = getDimensions()

      // Request terminal from server
      socket.emit(
        SOCKET_EVENTS.TERMINAL_CREATE,
        { cols, rows, containerId },
        (response) => {
          if (response?.success) {
            sessionIdRef.current = response.sessionId
            focusTerminal()
          } else {
            writeToTerminal('\r\n\x1b[31mFailed to create terminal\x1b[0m\r\n')
          }
        }
      )
    }, 150)

    // Receive output from server
    const handleOutput = (data) => {
      writeToTerminal(data)
    }

    // Handle terminal exit
    const handleExit = ({ exitCode }) => {
      writeToTerminal(
        `\r\n\x1b[33m[Process exited with code ${exitCode}]\x1b[0m\r\n`
      )
    }

    socket.on(SOCKET_EVENTS.TERMINAL_OUTPUT, handleOutput)
    socket.on(SOCKET_EVENTS.TERMINAL_EXIT, handleExit)

    return () => {
      clearTimeout(timer)
      socket.off(SOCKET_EVENTS.TERMINAL_OUTPUT, handleOutput)
      socket.off(SOCKET_EVENTS.TERMINAL_EXIT, handleExit)
      if (sessionIdRef.current) {
        socket.emit(SOCKET_EVENTS.TERMINAL_KILL)
      }
    }
  }, [])

  return (
    <div
      className="w-full bg-[#1e1e1e]"
      style={{ height: '100%' }}
    >
      <div
        ref={containerRef}
        style={{ height: '100%', width: '100%', padding: '4px' }}
        onClick={focusTerminal}
      />
    </div>
  )
}

export default Terminal