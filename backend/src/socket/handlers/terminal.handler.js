import {
  createPtySession,
  getPtySession,
  resizePty,
  killPtySession,
} from '../../services/pty.service.js'
import Session from '../../models/Session.model.js'
import logger from '../../config/logger.js'

export const registerTerminalHandlers = (io, socket) => {

  // terminal:create
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

      // Join a UNIQUE room for this session
      socket.join(sessionId)
      socket.currentSessionId = sessionId

      // PTY output → emit ONLY to this session's room
      ptyProcess.onData((data) => {
        // Use sessionId as event name — unique per terminal
        socket.emit(`terminal:output:${sessionId}`, data)
      })

      ptyProcess.onExit(({ exitCode }) => {
        logger.info(`PTY exited: ${sessionId} — Code: ${exitCode}`)
        socket.emit(`terminal:exit:${sessionId}`, { exitCode })
        killPtySession(sessionId)
      })

      logger.info(`Terminal created: ${sessionId}`)
      if (callback) callback({ success: true, sessionId })

    } catch (error) {
      logger.error(`terminal:create error: ${error.message}`)
      if (callback) callback({ success: false, error: error.message })
    }
  })

  // terminal:input — use sessionId to find correct PTY
  socket.on('terminal:input', ({ sessionId, data }) => {
    const ptyProcess = getPtySession(sessionId)
    if (ptyProcess) {
      ptyProcess.write(data)
    }
  })

  // terminal:resize
  socket.on('terminal:resize', ({ sessionId, cols, rows }) => {
    if (sessionId) {
      resizePty(sessionId, cols, rows)
    }
  })

  // terminal:kill
  socket.on('terminal:kill', async ({ sessionId }) => {
    if (sessionId) {
      killPtySession(sessionId)
      await Session.findOneAndUpdate(
        { sessionId },
        { status: 'closed', endedAt: new Date() }
      )
    }
  })

  // Cleanup on disconnect — kill ALL sessions for this socket
  socket.on('disconnect', async () => {
    const sessions = await Session.find({
      userId: socket.userId,
      status: 'active',
    })

    for (const session of sessions) {
      killPtySession(session.sessionId)
      await Session.findOneAndUpdate(
        { sessionId: session.sessionId },
        { status: 'disconnected', endedAt: new Date() }
      )
    }
  })
}