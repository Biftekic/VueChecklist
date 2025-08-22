import { z } from 'zod'

/**
 * Common validation patterns and utilities
 */

// Email validation pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone validation patterns
export const phonePatterns = {
  us: /^(\+1)?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
  international: /^[\d\s\-\+\(\)]+$/
}

// Common Zod schemas
export const commonSchemas = {
  email: z.string()
    .email('Please enter a valid email address')
    .or(z.literal(''))
    .optional(),
  
  phone: z.string()
    .regex(phonePatterns.international, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .or(z.literal(''))
    .optional(),
  
  url: z.string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  
  positiveNumber: z.number()
    .positive('Must be a positive number')
    .finite('Must be a valid number'),
  
  percentage: z.number()
    .min(0, 'Percentage must be between 0 and 100')
    .max(100, 'Percentage must be between 0 and 100'),
  
  currency: z.number()
    .min(0, 'Amount must be positive')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places')
}

/**
 * Vuetify validation rule generators
 */
export const validationRules = {
  required: (message = 'This field is required') => 
    (value: any) => !!value || message,
  
  email: (message = 'Please enter a valid email') =>
    (value: string) => !value || emailPattern.test(value) || message,
  
  minLength: (min: number, message?: string) =>
    (value: string) => !value || value.length >= min || 
      message || `Must be at least ${min} characters`,
  
  maxLength: (max: number, message?: string) =>
    (value: string) => !value || value.length <= max || 
      message || `Must be at most ${max} characters`,
  
  pattern: (pattern: RegExp, message = 'Invalid format') =>
    (value: string) => !value || pattern.test(value) || message,
  
  numeric: (message = 'Must be a number') =>
    (value: any) => !value || !isNaN(Number(value)) || message,
  
  min: (min: number, message?: string) =>
    (value: number) => value >= min || 
      message || `Must be at least ${min}`,
  
  max: (max: number, message?: string) =>
    (value: number) => value <= max || 
      message || `Must be at most ${max}`,
  
  between: (min: number, max: number, message?: string) =>
    (value: number) => (value >= min && value <= max) || 
      message || `Must be between ${min} and ${max}`
}

/**
 * Format validation error messages for display
 */
export function formatValidationError(error: z.ZodError): string {
  const messages = error.errors.map(err => {
    const field = err.path.join('.')
    return field ? `${field}: ${err.message}` : err.message
  })
  return messages.join(', ')
}

/**
 * Check if a value is empty (null, undefined, or empty string)
 */
export function isEmpty(value: any): boolean {
  return value === null || 
         value === undefined || 
         (typeof value === 'string' && value.trim() === '')
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  
  // Return original if not a standard US number
  return phone
}

/**
 * Create a debounced validation function
 */
export function debounceValidation(
  validateFn: (...args: any[]) => void,
  delay = 300
): (...args: any[]) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      validateFn(...args)
    }, delay)
  }
}