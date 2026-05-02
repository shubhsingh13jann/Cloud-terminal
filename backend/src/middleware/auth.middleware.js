import { verifyAccessToken } from '../services/token.service.js'
import User from '../models/User.model.js'
import asyncHandler from '../utils/asyncHandler.js'

// ===========================
// Protect Route Middleware
// ===========================
export const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from "Bearer <token>"
    token = req.headers.authorization.split(' ')[1]
  }

  // No token found
  if (!token) {
    res.status(401)
    throw new Error('Access denied. No token provided.')
  }

  // Verify token
  const decoded = verifyAccessToken(token)

  // Find user from token payload
  const user = await User.findById(decoded.id)

  if (!user) {
    res.status(401)
    throw new Error('User no longer exists')
  }

  if (!user.isActive) {
    res.status(401)
    throw new Error('Account is deactivated')
  }

  // Attach user to request object
  req.user = user

  next()
})

// ===========================
// Admin Only Middleware
// ===========================
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403)
    throw new Error('Access denied. Admins only.')
  }
})