import winston from 'winston'
import env from './env.js'

const { combine, timestamp, colorize, printf, json } = winston.format

// Custom log format for development
const devFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

// Custom log format for production
const prodFormat = combine(timestamp(), json())

// Development format
const devFormatCombined = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  devFormat
)

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: env.NODE_ENV === 'production' ? prodFormat : devFormatCombined,
  transports: [
    // Always log to console
    new winston.transports.Console(),

    // Log errors to a file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    // Log everything to a file
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
})

export default logger