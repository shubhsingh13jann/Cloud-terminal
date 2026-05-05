import { Server } from 'socket.io'
import { verifyAccessToken } from '../services/token.service.js'
import { registerTerminalHandlers } from './handlers/terminal.handler.js'
import { registerContainerHandlers } from './handlers/container.handler.js'
import logger from '../config/logger.js'
import User from '../models/User.model.js'

let io

// ===========================
// Initialize Socket.io Server
// ===========================
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Ping timeout settings
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  // ===========================
  // Socket Authentication Middleware
  // ===========================
  io.use(async (socket, next) => {
    try {
      // Get token from handshake
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1]

      if (!token) {
        return next(new Error('Authentication required'))
      }

      // Verify JWT token
      const decoded = verifyAccessToken(token)

      // Find user
      const user = await User.findById(decoded.id)
      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'))
      }

      // Attach user to socket
      socket.user = user
      socket.userId = user._id.toString()

      logger.info(`Socket authenticated: ${user.email}`)
      next()
    } catch (error) {
      logger.error(`Socket auth failed: ${error.message}`)
      next(new Error('Invalid token'))
    }
  })

  // ===========================
  // Connection Handler
  // ===========================
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id} — User: ${socket.user.email}`)

    // Register all event handlers
    registerTerminalHandlers(io, socket)
    registerContainerHandlers(io, socket)

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`Client disconnected: ${socket.id} — Reason: ${reason}`)
    })

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error: ${error.message}`)
    })
  })

  logger.info('✅ Socket.io server initialized')
  return io
}

// Export io instance
export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}

export default initSocket