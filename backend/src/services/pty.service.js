import * as pty from 'node-pty'
import os from 'os'
import logger from '../config/logger.js'

// Store active PTY sessions
const ptySessions = new Map()

// ===========================
// Get default shell
// ===========================
const getShell = () => {
  // Windows — use PowerShell or cmd
  if (os.platform() === 'win32') {
    return process.env.COMSPEC || 'cmd.exe'
  }
  // Linux/Mac — use bash
  return process.env.SHELL || '/bin/bash'
}

// ===========================
// Create PTY session
// ===========================
export const createPtySession = (sessionId, options = {}) => {
  try {
    const shell = getShell()

    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: options.cols || 80,
      rows: options.rows || 24,
      cwd: options.cwd || os.homedir(),
      env: {
        ...process.env,
        TERM: 'xterm-color',
        COLORTERM: 'truecolor',
        FORCE_COLOR: '1',
      },
      // Add this for Windows to improve performance and compatibility
      useConpty: false,  
    })

    // Store session
    ptySessions.set(sessionId, ptyProcess)

    logger.info(`PTY session created: ${sessionId} — Shell: ${shell}`)

    return ptyProcess
  } catch (error) {
    logger.error(`Failed to create PTY: ${error.message}`)
    throw error
  }
}

// ===========================
// Get PTY session
// ===========================
export const getPtySession = (sessionId) => {
  return ptySessions.get(sessionId)
}

// ===========================
// Resize PTY
// ===========================
export const resizePty = (sessionId, cols, rows) => {
  const ptyProcess = ptySessions.get(sessionId)
  if (ptyProcess) {
    ptyProcess.resize(cols, rows)
    logger.info(`PTY resized: ${sessionId} — ${cols}x${rows}`)
  }
}

// ===========================
// Kill PTY session
// ===========================
export const killPtySession = (sessionId) => {
  const ptyProcess = ptySessions.get(sessionId)
  if (ptyProcess) {
    try {
      ptyProcess.kill()
      ptySessions.delete(sessionId)
      logger.info(`PTY session killed: ${sessionId}`)
    } catch (error) {
      logger.error(`Failed to kill PTY: ${error.message}`)
    }
  }
}

// ===========================
// Get all active sessions
// ===========================
export const getActiveSessions = () => {
  return Array.from(ptySessions.keys())
}

export default {
  createPtySession,
  getPtySession,
  resizePty,
  killPtySession,
  getActiveSessions,
}