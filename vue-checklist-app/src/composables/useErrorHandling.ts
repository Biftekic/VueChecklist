/**
 * Error Handling Composable
 * Provides error handling utilities for Vue components
 */

import { ref, computed } from 'vue'
import { errorHandler, ErrorSeverity, ErrorCategory, type AppError } from '@/services/errorHandler'

export interface UseErrorHandlingOptions {
  component?: string
  retryable?: boolean
  recoverable?: boolean
}

export function useErrorHandling(options: UseErrorHandlingOptions = {}) {
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)
  const hasError = computed(() => !!error.value)

  /**
   * Execute an async operation with error handling
   */
  async function executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorOptions: Partial<AppError> = {}
  ): Promise<T | undefined> {
    isLoading.value = true
    error.value = null

    try {
      const result = await operation()
      return result
    } catch (err) {
      const appError = err as AppError
      
      // Enhance error with context
      appError.context = {
        ...appError.context,
        component: options.component,
        ...errorOptions.context
      }
      
      // Set error properties
      appError.retryable = options.retryable ?? errorOptions.retryable
      appError.recoverable = options.recoverable ?? errorOptions.recoverable
      
      // Handle the error
      errorHandler.handleError(appError, errorOptions)
      error.value = appError
      
      // Re-throw if critical
      if (appError.severity === ErrorSeverity.CRITICAL) {
        throw appError
      }
      
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Wrap a function with error handling
   */
  function wrapWithErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    errorOptions: Partial<AppError> = {}
  ): T {
    return (async (...args: Parameters<T>) => {
      return executeWithErrorHandling(
        () => Promise.resolve(fn(...args)),
        errorOptions
      )
    }) as T
  }

  /**
   * Handle validation errors
   */
  function handleValidationError(
    message: string,
    field?: string,
    value?: any
  ): void {
    const validationError: AppError = new Error(message) as AppError
    validationError.category = ErrorCategory.VALIDATION
    validationError.severity = ErrorSeverity.LOW
    validationError.context = {
      component: options.component,
      field,
      value
    }
    validationError.userMessage = message
    
    errorHandler.handleError(validationError)
    error.value = validationError
  }

  /**
   * Handle network errors
   */
  function handleNetworkError(
    err: Error,
    endpoint?: string,
    retryCallback?: () => void
  ): void {
    const networkError = err as AppError
    networkError.category = ErrorCategory.NETWORK
    networkError.severity = ErrorSeverity.HIGH
    networkError.retryable = true
    networkError.context = {
      component: options.component,
      endpoint,
      action: retryCallback ? 'api_call' : undefined
    }
    
    errorHandler.handleError(networkError)
    error.value = networkError
  }

  /**
   * Handle database errors
   */
  function handleDatabaseError(
    err: Error,
    operation?: string,
    data?: any
  ): void {
    const dbError = err as AppError
    dbError.category = ErrorCategory.DATABASE
    dbError.severity = ErrorSeverity.HIGH
    dbError.recoverable = true
    dbError.context = {
      component: options.component,
      operation,
      data
    }
    
    errorHandler.handleError(dbError)
    error.value = dbError
  }

  /**
   * Clear current error
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Retry last failed operation
   */
  async function retry<T>(
    operation: () => Promise<T>
  ): Promise<T | undefined> {
    if (!error.value?.retryable) {
      console.warn('Current error is not retryable')
      return undefined
    }
    
    clearError()
    return executeWithErrorHandling(operation)
  }

  return {
    isLoading,
    error,
    hasError,
    executeWithErrorHandling,
    wrapWithErrorHandling,
    handleValidationError,
    handleNetworkError,
    handleDatabaseError,
    clearError,
    retry
  }
}

/**
 * Form-specific error handling
 */
export function useFormErrorHandling(formName: string) {
  const fieldErrors = ref<Record<string, string>>({})
  const { 
    isLoading, 
    error, 
    hasError, 
    executeWithErrorHandling,
    clearError 
  } = useErrorHandling({ component: formName })

  /**
   * Validate a single field
   */
  function validateField(
    field: string,
    value: any,
    validator: (value: any) => string | null
  ): boolean {
    const errorMessage = validator(value)
    
    if (errorMessage) {
      fieldErrors.value[field] = errorMessage
      return false
    }
    
    delete fieldErrors.value[field]
    return true
  }

  /**
   * Validate multiple fields
   */
  function validateFields(
    fields: Record<string, any>,
    validators: Record<string, (value: any) => string | null>
  ): boolean {
    let isValid = true
    fieldErrors.value = {}

    for (const [field, value] of Object.entries(fields)) {
      if (validators[field]) {
        const errorMessage = validators[field](value)
        if (errorMessage) {
          fieldErrors.value[field] = errorMessage
          isValid = false
        }
      }
    }

    return isValid
  }

  /**
   * Clear field errors
   */
  function clearFieldErrors(field?: string): void {
    if (field) {
      delete fieldErrors.value[field]
    } else {
      fieldErrors.value = {}
    }
  }

  /**
   * Submit form with error handling
   */
  async function submitForm<T>(
    submitFn: () => Promise<T>,
    validators?: Record<string, (value: any) => string | null>,
    formData?: Record<string, any>
  ): Promise<T | undefined> {
    // Clear previous errors
    clearError()
    clearFieldErrors()

    // Validate if validators provided
    if (validators && formData) {
      if (!validateFields(formData, validators)) {
        const validationError = new Error('Validation failed') as AppError
        validationError.category = ErrorCategory.VALIDATION
        validationError.severity = ErrorSeverity.LOW
        validationError.userMessage = 'Please correct the errors and try again'
        error.value = validationError
        return undefined
      }
    }

    // Submit with error handling
    return executeWithErrorHandling(submitFn, {
      context: { form: formName }
    })
  }

  return {
    isLoading,
    error,
    hasError,
    fieldErrors,
    validateField,
    validateFields,
    clearFieldErrors,
    clearError,
    submitForm
  }
}