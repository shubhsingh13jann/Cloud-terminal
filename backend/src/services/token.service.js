import jwt from 'jsonwebtoken'
import env from '../config/env.js'

// Generate Access Token — short lived (7 days)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )
}

// Generate Refresh Token — long lived (30 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  )
}

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET)
}

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET)
}

// Generate both tokens together
export const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId)
  const refreshToken = generateRefreshToken(userId)
  return { accessToken, refreshToken }
}