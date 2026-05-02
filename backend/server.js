import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import env from './src/config/env.js'
import logger from './src/config/logger.js'
import errorMiddleware from './src/middleware/error.middleware.js'
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'

// Initialize Express app
const app = express()

// Create HTTP server
const server = http.createServer(app)

// ===========================
// Global Middleware
// ===========================

// Security headers
app.use(helmet())

// CORS — allow frontend to talk to backend
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
)

// Parse JSON request bodies
app.use(express.json())

// Parse URL encoded bodies
app.use(express.urlencoded({ extended: true }))

// Parse cookies
app.use(cookieParser())

// ===========================
// Routes
// ===========================

// Health check route — to verify server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cloud Terminal API is running ✅',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// Auth routes
app.use('/api/auth', authRoutes)

// User routes
app.use('/api/users', userRoutes)

// 404 handler — route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global error handler — must be last
app.use(errorMiddleware)

// ===========================
// Start Server
// ===========================
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB()

    // Then start the server
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`)
      logger.info(`📡 Environment: ${env.NODE_ENV}`)
      logger.info(`🌐 Health check: http://localhost:${env.PORT}/api/health`)
    })
  } catch (error) {
    logger.error(`❌ Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

startServer()

export default server