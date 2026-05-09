import {
  createPtySession,
  getPtySession,
  resizePty,
  killPtySession,
} from '../../services/pty.service.js'
import Session from '../../models/Session.model.js'
import logger from '../../config/logger.js'

// ===========================
// Terminal Event Handler
// ===========================
export const registerTerminalHandlers = (io, socket) => {

  // ===========================
  // terminal:create
  // Client requests a new terminal
  // ===========================
  socket.on('terminal:create', async (options, callback) => {
    try {
      const sessionId = `${socket.userId}-${Date.now()}`

      const ptyProcess = createPtySession(sessionId, {
        cols: options?.cols || 80,
        rows: options?.rows || 24,
      })

      await Session.create({
        sessionId,
        userId: socket.userId,
        containerId: options?.containerId || null,
        status: 'active',
      })

      socket.join(sessionId)
      socket.currentSessionId = sessionId

      // PTY output → send to browser
      ptyProcess.onData((data) => {
        socket.emit('terminal:output', data)
      })

      ptyProcess.onExit(({ exitCode }) => {
        logger.info(`PTY exited: ${sessionId} — Code: ${exitCode}`)
        socket.emit('terminal:exit', { exitCode })
        killPtySession(sessionId)
      })

      logger.info(`Terminal created: ${sessionId}`)

      // Send success callback FIRST
      if (callback) callback({ success: true, sessionId })

      // Then write welcome message to trigger prompt
      setTimeout(() => {
        ptyProcess.write('')  // Empty write triggers shell prompt
      }, 100)

    } catch (error) {
      logger.error(`terminal:create error: ${error.message}`)
      if (callback) callback({ success: false, error: error.message })
    }
  })

  // ===========================
  // terminal:input
  // Client types something → send to shell
  // ===========================
  socket.on('terminal:input', (data) => {
    const ptyProcess = getPtySession(socket.currentSessionId)
    if (ptyProcess) {
      ptyProcess.write(data)
    }
  })

  // ===========================
  // terminal:resize
  // Browser terminal resized → resize PTY
  // ===========================
  socket.on('terminal:resize', ({ cols, rows }) => {
    if (socket.currentSessionId) {
      resizePty(socket.currentSessionId, cols, rows)
    }
  })

  // ===========================
  // terminal:kill
  // Client closes terminal
  // ===========================
  socket.on('terminal:kill', async () => {
    if (socket.currentSessionId) {
      killPtySession(socket.currentSessionId)

      // Update session status in DB
      await Session.findOneAndUpdate(
        { sessionId: socket.currentSessionId },
        { status: 'closed', endedAt: new Date() }
      )

      socket.currentSessionId = null
    }
  })

  // ===========================
  // Cleanup on disconnect
  // ===========================
  socket.on('disconnect', async () => {
    if (socket.currentSessionId) {
      killPtySession(socket.currentSessionId)

      await Session.findOneAndUpdate(
        { sessionId: socket.currentSessionId },
        { status: 'disconnected', endedAt: new Date() }
      )
    }
  })
}