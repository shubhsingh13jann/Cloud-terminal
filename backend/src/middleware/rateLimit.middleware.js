import redis from '../services/redis.service.js'
import logger from '../config/logger.js'

// ===========================
// Rate Limiter Factory
// ===========================
const createRateLimiter = ({ windowSeconds, maxRequests, message }) => {
  return async (req, res, next) => {
    try {
      // Use IP address as key
      const ip = req.ip || req.connection.remoteAddress
      const key = `ratelimit:${req.path}:${ip}`

      // Get current request count
      const current = await redis.get(key)

      if (current && parseInt(current) >= maxRequests) {
        logger.warn(`Rate limit exceeded for IP: ${ip} on ${req.path}`)
        return res.status(429).json({
          success: false,
          message,
          retryAfter: windowSeconds,
        })
      }

      // Increment counter
      if (current) {
        await redis.incr(key)
      } else {
        // First request — set counter with expiry
        await redis.setex(key, windowSeconds, 1)
      }

      // Add headers to response
      const remaining = maxRequests - (parseInt(current) || 0) - 1
      res.setHeader('X-RateLimit-Limit', maxRequests)
      res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining))

      next()
    } catch (error) {
      // If Redis fails — allow request (fail open)
      logger.error(`Rate limiter error: ${error.message}`)
      next()
    }
  }
}

// ===========================
// Specific Rate Limiters
// ===========================

// Auth routes — strict limit
export const authRateLimiter = createRateLimiter({
  windowSeconds: 15 * 60,  // 15 minutes
  maxRequests: 10,          // 10 attempts per 15 min
  message: 'Too many login attempts. Please try again after 15 minutes.',
})

// General API — relaxed limit
export const apiRateLimiter = createRateLimiter({
  windowSeconds: 60,        // 1 minute
  maxRequests: 100,         // 100 requests per minute
  message: 'Too many requests. Please slow down.',
})

// Terminal creation — medium limit
export const terminalRateLimiter = createRateLimiter({
  windowSeconds: 60,        // 1 minute
  maxRequests: 5,           // 5 terminal creations per minute
  message: 'Too many terminal requests. Please wait a moment.',
})