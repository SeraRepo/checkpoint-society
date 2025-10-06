/**
 * Email validation
 * Validates email format according to RFC 5322 standard (simplified version)
 * - Alphanumeric characters, dots, hyphens, underscores allowed before @
 * - Domain must have at least one dot
 * - TLD must be at least 2 characters
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Password validation
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/

/**
 * Phone number validation (international format)
 * Accepts: +33612345678, +1-234-567-8900, etc.
 */
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, errors: string[] }
 */
const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] }
  }

  const errors = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false
  // Remove spaces, hyphens, parentheses for validation
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return PHONE_REGEX.test(cleaned)
}

module.exports = {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  isValidEmail,
  isValidPassword,
  isValidPhone
}
