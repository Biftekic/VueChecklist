import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useErrorHandling, useFormErrorHandling } from '../useErrorHandling'
import { errorHandler } from '@/services/errorHandler'

// Mock error handler
vi.mock('@/services/errorHandler', () => ({
  errorHandler: {
    handleError: vi.fn()
  },
  ErrorCategory: {
    VALIDATION: 'validation',
    NETWORK: 'network',
    DATABASE: 'database'
  },
  ErrorSeverity: {
    LOW: 'low',
    HIGH: 'high',
    CRITICAL: 'critical'
  }
}))

describe('useErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('executeWithErrorHandling', () => {
    it('should execute successful operations', async () => {
      const { executeWithErrorHandling } = useErrorHandling()
      
      const result = await executeWithErrorHandling(
        async () => 'success'
      )
      
      expect(result).toBe('success')
      expect(errorHandler.handleError).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const { executeWithErrorHandling, error } = useErrorHandling()
      
      const testError = new Error('Test error')
      const result = await executeWithErrorHandling(
        async () => {
          throw testError
        }
      )
      
      expect(result).toBeUndefined()
      expect(error.value).toBeTruthy()
      expect(errorHandler.handleError).toHaveBeenCalledWith(
        testError,
        expect.any(Object)
      )
    })

    it('should re-throw critical errors', async () => {
      const { executeWithErrorHandling } = useErrorHandling()
      
      const criticalError = new Error('Critical error') as any
      criticalError.severity = 'critical'
      
      await expect(
        executeWithErrorHandling(async () => {
          throw criticalError
        })
      ).rejects.toThrow('Critical error')
    })
  })

  describe('validation error handling', () => {
    it('should handle validation errors', () => {
      const { handleValidationError, error } = useErrorHandling()
      
      handleValidationError('Invalid email', 'email', 'test@')
      
      expect(error.value).toBeTruthy()
      expect(errorHandler.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid email',
          category: 'validation',
          severity: 'low'
        })
      )
    })
  })

  describe('network error handling', () => {
    it('should handle network errors', () => {
      const { handleNetworkError, error } = useErrorHandling()
      
      const networkError = new Error('Network failed')
      handleNetworkError(networkError, '/api/endpoint')
      
      expect(error.value).toBeTruthy()
      expect(errorHandler.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Network failed',
          category: 'network',
          severity: 'high',
          retryable: true
        })
      )
    })
  })

  describe('database error handling', () => {
    it('should handle database errors', () => {
      const { handleDatabaseError, error } = useErrorHandling()
      
      const dbError = new Error('Database connection failed')
      handleDatabaseError(dbError, 'INSERT', { id: 1 })
      
      expect(error.value).toBeTruthy()
      expect(errorHandler.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Database connection failed',
          category: 'database',
          severity: 'high',
          recoverable: true
        })
      )
    })
  })

  describe('error clearing', () => {
    it('should clear errors', () => {
      const { handleValidationError, clearError, error, hasError } = useErrorHandling()
      
      handleValidationError('Test error')
      expect(hasError.value).toBe(true)
      
      clearError()
      expect(hasError.value).toBe(false)
      expect(error.value).toBeNull()
    })
  })
})

describe('useFormErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('field validation', () => {
    it('should validate individual fields', () => {
      const { validateField, fieldErrors } = useFormErrorHandling('test-form')
      
      const validator = (value: string) => 
        value.length < 3 ? 'Too short' : null
      
      const isValid = validateField('username', 'ab', validator)
      
      expect(isValid).toBe(false)
      expect(fieldErrors.value.username).toBe('Too short')
    })

    it('should clear field errors when valid', () => {
      const { validateField, fieldErrors } = useFormErrorHandling('test-form')
      
      const validator = (value: string) => 
        value.length < 3 ? 'Too short' : null
      
      // First set an error
      validateField('username', 'ab', validator)
      expect(fieldErrors.value.username).toBe('Too short')
      
      // Then validate with valid value
      validateField('username', 'valid', validator)
      expect(fieldErrors.value.username).toBeUndefined()
    })
  })

  describe('multiple field validation', () => {
    it('should validate multiple fields', () => {
      const { validateFields, fieldErrors } = useFormErrorHandling('test-form')
      
      const validators = {
        username: (v: string) => v.length < 3 ? 'Too short' : null,
        email: (v: string) => !v.includes('@') ? 'Invalid email' : null
      }
      
      const isValid = validateFields(
        { username: 'ab', email: 'invalid' },
        validators
      )
      
      expect(isValid).toBe(false)
      expect(fieldErrors.value.username).toBe('Too short')
      expect(fieldErrors.value.email).toBe('Invalid email')
    })
  })

  describe('form submission', () => {
    it('should submit valid forms', async () => {
      const { submitForm } = useFormErrorHandling('test-form')
      
      const validators = {
        username: (v: string) => v.length < 3 ? 'Too short' : null
      }
      
      const submitFn = vi.fn().mockResolvedValue({ success: true })
      
      const result = await submitForm(
        submitFn,
        validators,
        { username: 'validname' }
      )
      
      expect(submitFn).toHaveBeenCalled()
      expect(result).toEqual({ success: true })
    })

    it('should not submit invalid forms', async () => {
      const { submitForm, fieldErrors } = useFormErrorHandling('test-form')
      
      const validators = {
        username: (v: string) => v.length < 3 ? 'Too short' : null
      }
      
      const submitFn = vi.fn()
      
      const result = await submitForm(
        submitFn,
        validators,
        { username: 'ab' }
      )
      
      expect(submitFn).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
      expect(fieldErrors.value.username).toBe('Too short')
    })
  })

  describe('clearing field errors', () => {
    it('should clear specific field errors', () => {
      const { validateField, clearFieldErrors, fieldErrors } = useFormErrorHandling('test-form')
      
      const validator = () => 'Error'
      
      validateField('field1', 'value', validator)
      validateField('field2', 'value', validator)
      
      expect(fieldErrors.value.field1).toBe('Error')
      expect(fieldErrors.value.field2).toBe('Error')
      
      clearFieldErrors('field1')
      
      expect(fieldErrors.value.field1).toBeUndefined()
      expect(fieldErrors.value.field2).toBe('Error')
    })

    it('should clear all field errors', () => {
      const { validateField, clearFieldErrors, fieldErrors } = useFormErrorHandling('test-form')
      
      const validator = () => 'Error'
      
      validateField('field1', 'value', validator)
      validateField('field2', 'value', validator)
      
      clearFieldErrors()
      
      expect(fieldErrors.value).toEqual({})
    })
  })
})