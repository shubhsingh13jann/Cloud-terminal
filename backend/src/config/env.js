import dotenv from 'dotenv'

dotenv.config()

const env = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/cloud-terminal',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Claude AI
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',

  // Frontend URL
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
}

// Validate critical env variables
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET']

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Warning: ${key} is not set in .env file`)
  }
})

export default env