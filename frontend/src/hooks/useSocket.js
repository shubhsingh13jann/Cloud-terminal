import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { setConnected } from '../features/terminal/terminalSlice.js'
import { SOCKET_URL } from '../utils/constants.js'

// Singleton socket instance
let socketInstance = null

const useSocket = () => {
  const dispatch = useDispatch()
  const socketRef = useRef(null)

  const connect = useCallback(() => {
    // If already connected — return existing instance
    if (socketInstance?.connected) return socketInstance

    // Get token directly from localStorage
    // More reliable than Redux on first render
    const token = localStorage.getItem('accessToken')

    if (!token) {
      console.error('❌ No access token — cannot connect socket')
      return null
    }

    console.log('🔌 Connecting to socket...')

    socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'], // fallback to polling if websocket fails
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
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
      console.error('❌ Socket error:', error.message)
      dispatch(setConnected(false))
    })

    socketRef.current = socketInstance
    return socketInstance
  }, [dispatch])

  const disconnect = useCallback(() => {
    if (socketInstance) {
      socketInstance.disconnect()
      socketInstance = null
      dispatch(setConnected(false))
    }
  }, [dispatch])

  const getSocket = useCallback(() => socketInstance, [])

  return { connect, disconnect, getSocket }
}

export default useSocket