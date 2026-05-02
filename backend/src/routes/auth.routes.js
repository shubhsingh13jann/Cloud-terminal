import express from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
} from '../controllers/auth.controller.js'
import { validate, registerSchema, loginSchema } from '../middleware/validate.middleware.js'

const router = express.Router()

// Validation added to register and login
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh', refreshToken)

export default router