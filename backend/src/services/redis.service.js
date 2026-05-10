import Redis from 'ioredis'
import env from '../config/env.js'
import logger from '../config/logger.js'

// Create Redis client
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  commandTimeout: 3000,
  retryStrategy: (times) => {
    // Retry connection every 2 seconds max 10 times
    if (times > 10) {
      logger.error('Redis max retries reached')
      return null
    }
    return Math.min(times * 200, 2000)
  },
})

// Connection events
redis.on('connect', () => {
  logger.info('✅ Redis connected')
})

redis.on('error', (err) => {
  logger.error(`❌ Redis error: ${err.message}`)
})

redis.on('reconnecting', () => {
  logger.warn('⚠️  Redis reconnecting...')
})

// ===========================
// Redis Helper Functions
// ===========================

// Set a key with expiry (in seconds)
export const setCache = async (key, value, expireSeconds = 3600) => {
  try {
    await redis.setex(key, expireSeconds, JSON.stringify(value))
  } catch (error) {
    logger.error(`Redis setCache error: ${error.message}`)
  }
}

// Get a key
export const getCache = async (key) => {
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    logger.error(`Redis getCache error: ${error.message}`)
    return null
  }
}

// Delete a key
export const deleteCache = async (key) => {
  try {
    await redis.del(key)
  } catch (error) {
    logger.error(`Redis deleteCache error: ${error.message}`)
  }
}

// Blacklist a token (for logout)
export const blacklistToken = async (token, expireSeconds) => {
  try {
    await redis.setex(`blacklist:${token}`, expireSeconds, '1')
  } catch (error) {
    logger.error(`Redis blacklistToken error: ${error.message}`)
  }
}

// Check if token is blacklisted
export const isTokenBlacklisted = async (token) => {
  try {
    const result = await redis.get(`blacklist:${token}`)
    return result === '1'
  } catch (error) {
    logger.error(`Redis isTokenBlacklisted error: ${error.message}`)
    return false
  }
}

export default redis
