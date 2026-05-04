// ===========================
// Input Sanitization Utilities
// ===========================

// Remove ANSI escape codes from terminal output
export const stripAnsi = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(
    /[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><~]/g,
    ''
  )
}

// Sanitize user input before passing to AI
export const sanitizeForAI = (input) => {
  if (typeof input !== 'string') return ''

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit length to prevent token abuse
    .slice(0, 2000)
}

// Sanitize container name
export const sanitizeContainerName = (name) => {
  if (typeof name !== 'string') return 'sandbox'

  return name
    .toLowerCase()
    .trim()
    // Only allow alphanumeric and hyphens
    .replace(/[^a-z0-9-]/g, '-')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    // Limit length
    .slice(0, 50) || 'sandbox'
}

// Sanitize file path — prevent directory traversal
export const sanitizePath = (path) => {
  if (typeof path !== 'string') return '/'

  return path
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove directory traversal attempts
    .replace(/\.\./g, '')
    // Remove double slashes
    .replace(/\/+/g, '/')
    || '/'
}