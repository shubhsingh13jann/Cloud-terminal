import { z } from 'zod'

// ===========================
// Register validation schema
// ===========================
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

// ===========================
// Login validation schema
// ===========================
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

// ===========================
// Validate middleware factory
// ===========================
export const validate = (schema) => (req, res, next) => {
  try {
    // Parse and validate request body against schema
    schema.parse(req.body)
    next()
  } catch (error) {
    // Extract Zod error messages
    const messages = error.errors.map((e) => e.message)
    res.status(400).json({
      success: false,
      message: messages[0], // Send first error message
      errors: messages,
    })
  }
}