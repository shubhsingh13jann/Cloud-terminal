import express from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
} from '../controllers/auth.controller.js'
import {
  validate,
  registerSchema,
  loginSchema,
} from '../middleware/validate.middleware.js'
import { authRateLimiter } from '../middleware/rateLimit.middleware.js'

const router = express.Router()

// Rate limiter applied to all auth routes
router.use(authRateLimiter)

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh', refreshToken)

export default router