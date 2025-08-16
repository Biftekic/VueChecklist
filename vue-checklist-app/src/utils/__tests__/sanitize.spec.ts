import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  sanitizeHTML,
  sanitizeURL,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  sanitizeFileName,
  sanitizeFormData
} from '../sanitize'

describe('Sanitization Utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove all HTML tags', () => {
      const input = '<script>alert("XSS")</script>Hello World'
      expect(sanitizeInput(input)).toBe('Hello World')
    })

    it('should handle null and undefined', () => {
      expect(sanitizeInput(null as any)).toBe('')
      expect(sanitizeInput(undefined as any)).toBe('')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  Hello World  ')).toBe('Hello World')
    })

    it('should remove dangerous attributes', () => {
      const input = '<div onclick="alert(1)">Test</div>'
      expect(sanitizeInput(input)).toBe('Test')
    })
  })

  describe('sanitizeHTML', () => {
    it('should allow safe HTML tags', () => {
      const html = '<p>Hello <strong>World</strong></p>'
      expect(sanitizeHTML(html)).toBe('<p>Hello <strong>World</strong></p>')
    })

    it('should remove script tags', () => {
      const html = '<p>Hello</p><script>alert("XSS")</script>'
      expect(sanitizeHTML(html)).toBe('<p>Hello</p>')
    })

    it('should remove event handlers', () => {
      const html = '<div onclick="alert(1)">Click me</div>'
      expect(sanitizeHTML(html)).toBe('<div>Click me</div>')
    })

    it('should allow style attributes with safe properties', () => {
      const html = '<span style="color: red;">Red text</span>'
      expect(sanitizeHTML(html)).toContain('style')
    })
  })

  describe('sanitizeURL', () => {
    it('should allow HTTP and HTTPS URLs', () => {
      expect(sanitizeURL('https://example.com')).toBe('https://example.com')
      expect(sanitizeURL('http://example.com')).toBe('http://example.com')
    })

    it('should remove javascript: protocol', () => {
      expect(sanitizeURL('javascript:alert(1)')).toBe('')
    })

    it('should remove data: protocol', () => {
      expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('')
    })

    it('should allow mailto: protocol', () => {
      expect(sanitizeURL('mailto:test@example.com')).toBe('mailto:test@example.com')
    })
  })

  describe('sanitizeEmail', () => {
    it('should validate and sanitize email addresses', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com')
      expect(sanitizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com')
    })

    it('should reject invalid email addresses', () => {
      expect(sanitizeEmail('not-an-email')).toBe('')
      expect(sanitizeEmail('test@')).toBe('')
      expect(sanitizeEmail('@example.com')).toBe('')
    })

    it('should remove HTML from email', () => {
      expect(sanitizeEmail('<script>test</script>@example.com')).toBe('')
    })
  })

  describe('sanitizePhone', () => {
    it('should allow valid phone characters', () => {
      expect(sanitizePhone('+1 (555) 123-4567')).toBe('+1 (555) 123-4567')
      expect(sanitizePhone('555-123-4567')).toBe('555-123-4567')
    })

    it('should remove invalid characters', () => {
      expect(sanitizePhone('555-ABC-1234')).toBe('555--1234')
      expect(sanitizePhone('<script>555</script>')).toBe('555')
    })
  })

  describe('sanitizeNumber', () => {
    it('should convert valid numbers', () => {
      expect(sanitizeNumber('123')).toBe(123)
      expect(sanitizeNumber(456)).toBe(456)
      expect(sanitizeNumber('12.34')).toBe(12.34)
    })

    it('should return null for invalid numbers', () => {
      expect(sanitizeNumber('abc')).toBe(null)
      expect(sanitizeNumber('')).toBe(null)
      expect(sanitizeNumber(null)).toBe(null)
      expect(sanitizeNumber(undefined)).toBe(null)
    })
  })

  describe('sanitizeFileName', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeFileName('file<script>.txt')).toBe('file_script_.txt')
      expect(sanitizeFileName('../../etc/passwd')).toBe('_etc_passwd')
    })

    it('should prevent directory traversal', () => {
      expect(sanitizeFileName('file..txt')).toBe('file_txt')
      expect(sanitizeFileName('..file.txt')).toBe('_file.txt')
    })

    it('should limit file name length', () => {
      const longName = 'a'.repeat(300) + '.txt'
      const sanitized = sanitizeFileName(longName)
      expect(sanitized.length).toBeLessThanOrEqual(255)
    })
  })

  describe('sanitizeFormData', () => {
    it('should sanitize all string fields', () => {
      const data = {
        name: '<script>John</script>',
        email: 'john@example.com',
        phone: '555-1234',
        message: 'Hello <b>World</b>'
      }

      const sanitized = sanitizeFormData(data)
      expect(sanitized.name).toBe('John')
      expect(sanitized.email).toBe('john@example.com')
      expect(sanitized.phone).toBe('555-1234')
      expect(sanitized.message).toBe('Hello World')
    })

    it('should handle nested objects', () => {
      const data = {
        user: {
          name: '<script>John</script>',
          email: 'john@example.com'
        }
      }

      const sanitized = sanitizeFormData(data)
      expect(sanitized.user?.name).toBe('John')
      expect(sanitized.user?.email).toBe('john@example.com')
    })

    it('should allow HTML when specified', () => {
      const data = {
        content: '<p>Hello <strong>World</strong></p>'
      }

      const sanitized = sanitizeFormData(data, { allowHTML: true })
      expect(sanitized.content).toBe('<p>Hello <strong>World</strong></p>')
    })

    it('should sanitize only specified fields', () => {
      const data = {
        name: '<script>John</script>',
        untouched: '<script>alert(1)</script>'
      }

      const sanitized = sanitizeFormData(data, { fields: ['name'] })
      expect(sanitized.name).toBe('John')
      expect(sanitized.untouched).toBeUndefined()
    })
  })
})