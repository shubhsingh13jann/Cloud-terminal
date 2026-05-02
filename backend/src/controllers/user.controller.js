import User from '../models/User.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import logger from '../config/logger.js'

// ===========================
// @route   GET /api/users/me
// @desc    Get current logged in user
// @access  Private
// ===========================
export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const user = await User.findById(req.user._id)

  res.status(200).json({
    success: true,
    data: { user: user.toPublicJSON() },
  })
})

// ===========================
// @route   PATCH /api/users/me
// @desc    Update current user profile
// @access  Private
// ===========================
export const updateMe = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body

  // Only allow these fields to be updated
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,           // Return updated document
      runValidators: true, // Run schema validators
    }
  )

  logger.info(`User profile updated: ${updatedUser.email}`)

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser.toPublicJSON() },
  })
})

// ===========================
// @route   PATCH /api/users/me/password
// @desc    Change password
// @access  Private
// ===========================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400)
    throw new Error('Current password and new password are required')
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password')

  // Verify current password
  const isCorrect = await user.comparePassword(currentPassword)
  if (!isCorrect) {
    res.status(401)
    throw new Error('Current password is incorrect')
  }

  // Set new password — pre-save hook will hash it
  user.password = newPassword
  await user.save()

  logger.info(`Password changed for: ${user.email}`)

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  })
})