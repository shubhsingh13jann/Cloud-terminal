import logger from '../../config/logger.js'

// ===========================
// Container Event Handler
// (Full implementation on Day 17)
// ===========================
export const registerContainerHandlers = (io, socket) => {

  // container:status — get container status
  socket.on('container:status', (containerId, callback) => {
    logger.info(`Container status requested: ${containerId}`)
    if (callback) {
      callback({
        success: true,
        status: 'running',
        message: 'Container handler — full implementation Day 17',
      })
    }
  })
}