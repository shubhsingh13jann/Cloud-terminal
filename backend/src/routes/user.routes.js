import express from 'express'
import {
  getMe,
  updateMe,
  changePassword,
} from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes below require authentication
router.use(protect)

router.get('/me', getMe)
router.patch('/me', updateMe)
router.patch('/me/password', changePassword)

export default router