import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useTerminal from '../../hooks/useTerminal.js'
import useSocket from '../../hooks/useSocket.js'
import { addSession } from '../../features/terminal/terminalSlice.js'
import { SOCKET_EVENTS } from '../../utils/constants.js'

const Terminal = ({ containerId = null }) => {
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const { connect, getSocket } = useSocket()

  // Handle user input — send to server
  const handleInput = useCallback((data) => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit(SOCKET_EVENTS.TERMINAL_INPUT, data)
    }
  }, [getSocket])

  // Initialize terminal
  const { writeToTerminal, getDimensions, focusTerminal } = useTerminal(
    containerRef,
    handleInput
  )

  useEffect(() => {
    // Connect socket
    const socket = connect()

    // Request new terminal from server
    const { cols, rows } = getDimensions()
    socket.emit(
      SOCKET_EVENTS.TERMINAL_CREATE,
      { cols, rows, containerId },
      (response) => {
        if (response.success) {
          dispatch(addSession({
            sessionId: response.sessionId,
            containerId,
            createdAt: new Date().toISOString(),
          }))
          focusTerminal()
        }
      }
    )

    // Receive output from server → write to terminal
    socket.on(SOCKET_EVENTS.TERMINAL_OUTPUT, (data) => {
      writeToTerminal(data)
    })

    // Handle terminal exit
    socket.on(SOCKET_EVENTS.TERMINAL_EXIT, ({ exitCode }) => {
      writeToTerminal(`\r\n\x1b[31mTerminal exited with code ${exitCode}\x1b[0m\r\n`)
    })

    // Cleanup
    return () => {
      socket.off(SOCKET_EVENTS.TERMINAL_OUTPUT)
      socket.off(SOCKET_EVENTS.TERMINAL_EXIT)
      socket.emit(SOCKET_EVENTS.TERMINAL_KILL)
    }
  }, [])

  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* Terminal container */}
      <div
        ref={containerRef}
        className="w-full h-full p-2"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}

export default Terminal