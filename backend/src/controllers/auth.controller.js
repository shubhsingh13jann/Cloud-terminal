import User from '../models/User.model.js'
import { generateTokens, verifyRefreshToken } from '../services/token.service.js'
import asyncHandler from '../utils/asyncHandler.js'
import logger from '../config/logger.js'

// ===========================
// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
// ===========================
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(400)
    throw new Error('User with this email already exists')
  }

  // Create new user — password auto hashed by pre-save hook
  const user = await User.create({ name, email, password })

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id)

  // Save refresh token to DB
  user.refreshToken = refreshToken
  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })

  // Send refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,       // Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  })

  logger.info(`New user registered: ${email}`)

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toPublicJSON(),
      accessToken,
    },
  })
})

// ===========================
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// ===========================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  // Find user — explicitly select password since select:false
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  // Check if account is active
  if (!user.isActive) {
    res.status(401)
    throw new Error('Account is deactivated. Contact support.')
  }

  // Compare passwords
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  // Generate new tokens
  const { accessToken, refreshToken } = generateTokens(user._id)

  // Update refresh token and last login
  user.refreshToken = refreshToken
  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })

  // Send refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })

  logger.info(`User logged in: ${email}`)

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toPublicJSON(),
      accessToken,
    },
  })
})

// ===========================
// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
// ===========================
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies

  if (refreshToken) {
    // Remove refresh token from DB
    await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null }
    )
  }

  // Clear the cookie
  res.clearCookie('refreshToken')

  logger.info(`User logged out`)

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})

// ===========================
// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
// ===========================
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    res.status(401)
    throw new Error('No refresh token found')
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken)

  // Find user with this refresh token
  const user = await User.findOne({
    _id: decoded.id,
    refreshToken,
  }).select('+refreshToken')

  if (!user) {
    res.status(401)
    throw new Error('Invalid refresh token')
  }

  // Generate new access token
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id)

  // Update refresh token in DB
  user.refreshToken = newRefreshToken
  await user.save({ validateBeforeSave: false })

  // Update cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })

  res.status(200).json({
    success: true,
    data: { accessToken },
  })
})