import mongoose from 'mongoose'
import logger from './logger.js'
import env from './env.js'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      // These options prevent deprecation warnings
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000,         // Close sockets after 45s
    })

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`)

    // Listen for connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected')
    })

  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`)
    // Exit process with failure if DB doesn't connect
    process.exit(1)
  }
}

export default connectDB