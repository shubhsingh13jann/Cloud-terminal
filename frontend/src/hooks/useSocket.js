import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setConnected } from '../features/terminal/terminalSlice.js'
import { selectAccessToken } from '../features/auth/authSlice.js'
import { SOCKET_URL } from '../utils/constants.js'

// Singleton socket instance
let socketInstance = null

const useSocket = () => {
  const dispatch = useDispatch()
  const accessToken = useSelector(selectAccessToken)
  const socketRef = useRef(null)

  // Connect to socket
  const connect = useCallback(() => {
    if (socketInstance?.connected) return socketInstance

    socketInstance = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id)
      dispatch(setConnected(true))
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      dispatch(setConnected(false))
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
      dispatch(setConnected(false))
    })

    socketRef.current = socketInstance
    return socketInstance
  }, [accessToken, dispatch])

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socketInstance) {
      socketInstance.disconnect()
      socketInstance = null
      dispatch(setConnected(false))
    }
  }, [dispatch])

  // Get socket instance
  const getSocket = useCallback(() => socketInstance, [])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
    }
  }, [])

  return { connect, disconnect, getSocket }
}

export default useSocket