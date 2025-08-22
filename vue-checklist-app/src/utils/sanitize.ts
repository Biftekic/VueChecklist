import DOMPurify from 'dompurify'

/**
 * Sanitize plain text input (removes all HTML)
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Remove all HTML tags and attributes
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }).trim()
}

/**
 * Sanitize HTML content (allows safe HTML tags)
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }
  
  // Allow only safe HTML tags for rich text
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 's', 
      'p', 'br', 'span', 'div',
      'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['class', 'style'],
    KEEP_CONTENT: true
  })
}

/**
 * Sanitize URL to prevent XSS through javascript: or data: protocols
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }
  
  // Allow only safe URL protocols
  const sanitized = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  })
  
  // Additional check for javascript: and data: protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i
  if (dangerousProtocols.test(sanitized)) {
    return ''
  }
  
  return sanitized
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return ''
  }
  
  // Basic email validation and sanitization
  const sanitized = sanitizeInput(email).toLowerCase()
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  return emailRegex.test(sanitized) ? sanitized : ''
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return ''
  }
  
  // Remove everything except digits, +, -, (), and spaces
  return phone.replace(/[^0-9+\-() ]/g, '').trim()
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  
  const num = Number(value)
  return isNaN(num) ? null : num
}

/**
 * Sanitize and validate JSON string
 */
export function sanitizeJSON(jsonString: string): object | null {
  if (!jsonString || typeof jsonString !== 'string') {
    return null
  }
  
  try {
    // Parse and re-stringify to remove any potential XSS
    const parsed = JSON.parse(jsonString)
    return JSON.parse(JSON.stringify(parsed))
  } catch {
    return null
  }
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') {
    return ''
  }
  
  // Remove potentially dangerous characters
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_') // Prevent directory traversal
    .substring(0, 255) // Limit length
}

/**
 * Sanitize SQL-like input to prevent SQL injection
 * Note: This is a basic protection - always use parameterized queries
 */
export function sanitizeSQL(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Remove SQL meta-characters
  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/sp_/gi, '')
    .trim()
}

/**
 * Sanitize form data object
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T,
  options: {
    allowHTML?: boolean
    fields?: Array<keyof T>
  } = {}
): T {
  const sanitized = {} as T
  const fieldsToSanitize = options.fields || Object.keys(data)
  
  for (const key of fieldsToSanitize) {
    const value = data[key as keyof T]
    
    if (value === null || value === undefined) {
      sanitized[key as keyof T] = value
    } else if (typeof value === 'string') {
      // Special handling for specific field types
      if (key === 'email') {
        sanitized[key as keyof T] = sanitizeEmail(value) as T[keyof T]
      } else if (key === 'phone' || key === 'tel') {
        sanitized[key as keyof T] = sanitizePhone(value) as T[keyof T]
      } else if (key === 'url' || key === 'website') {
        sanitized[key as keyof T] = sanitizeURL(value) as T[keyof T]
      } else if (options.allowHTML) {
        sanitized[key as keyof T] = sanitizeHTML(value) as T[keyof T]
      } else {
        sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
      }
    } else if (typeof value === 'number') {
      sanitized[key as keyof T] = sanitizeNumber(value) as T[keyof T]
    } else if (typeof value === 'object') {
      // Recursively sanitize nested objects
      sanitized[key as keyof T] = sanitizeFormData(value, options) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }
  
  return sanitized
}

/**
 * Create a sanitized copy of an object with only allowed keys
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  allowedKeys: Array<keyof T>
): Partial<T> {
  const sanitized: Partial<T> = {}
  
  for (const key of allowedKeys) {
    if (key in obj) {
      sanitized[key] = obj[key]
    }
  }
  
  return sanitized
}

// Export a default sanitizer instance for convenience
export const sanitizer = {
  input: sanitizeInput,
  html: sanitizeHTML,
  url: sanitizeURL,
  email: sanitizeEmail,
  phone: sanitizePhone,
  number: sanitizeNumber,
  json: sanitizeJSON,
  fileName: sanitizeFileName,
  sql: sanitizeSQL,
  formData: sanitizeFormData,
  object: sanitizeObject
}

export default sanitizer