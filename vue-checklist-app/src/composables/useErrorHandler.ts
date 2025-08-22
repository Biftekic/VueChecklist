import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { logger } from '@/services/logger'
import type { ApiError, DbError } from '@/types/utility'

export interface ErrorState {
  hasError: boolean
  message: string | null
  code?: string
  details?: Record<string, unknown>
  field?: string
  timestamp?: Date
}

export interface ErrorNotification {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

export function useErrorHandler() {
  const router = useRouter()
  const errors = ref<ErrorState[]>([])
  const notifications = ref<ErrorNotification[]>([])
  const isLoading = ref(false)
  const retryAttempts = ref(0)
  const maxRetries = 3

  const hasErrors = computed(() => errors.value.length > 0)
  const latestError = computed(() => errors.value[errors.value.length - 1] || null)

  /**
   * Handle different types of errors
   */
  function handleError(error: Error | ApiError | DbError | unknown, context?: string): void {
    logger.error('Error occurred', { error, context })

    let errorState: ErrorState = {
      hasError: true,
      message: 'An unexpected error occurred',
      timestamp: new Date()
    }

    if (error instanceof Error) {
      errorState.message = error.message
    } else if (isApiError(error)) {
      errorState = handleApiError(error)
    } else if (isDbError(error)) {
      errorState = handleDbError(error)
    } else if (typeof error === 'string') {
      errorState.message = error
    }

    errors.value.push(errorState)

    // Show notification for user-facing errors
    if (context) {
      showErrorNotification(errorState.message, context || 'Error')
    }

    // Handle specific error codes
    if (errorState.code) {
      handleSpecificErrorCode(errorState.code)
    }
  }

  /**
   * Handle API errors
   */
  function handleApiError(error: ApiError): ErrorState {
    const errorState: ErrorState = {
      hasError: true,
      message: error.message || 'API request failed',
      code: error.code,
      details: error.details
    }

    // Handle specific API error status codes
    switch (error.statusCode) {
      case 401:
        errorState.message = 'Authentication required. Please log in.'
        router.push('/login')
        break
      case 403:
        errorState.message = 'You do not have permission to perform this action.'
        break
      case 404:
        errorState.message = 'The requested resource was not found.'
        break
      case 429:
        errorState.message = 'Too many requests. Please try again later.'
        break
      case 500:
      case 502:
      case 503:
        errorState.message = 'Server error. Please try again later.'
        break
    }

    return errorState
  }

  /**
   * Handle database errors
   */
  function handleDbError(error: DbError): ErrorState {
    const errorState: ErrorState = {
      hasError: true,
      message: error.message || 'Database operation failed',
      code: error.code,
      field: error.field,
      details: error.details
    }

    // Handle specific database error codes
    switch (error.code) {
      case 'UNIQUE_CONSTRAINT':
        errorState.message = `This ${error.field || 'value'} already exists.`
        break
      case 'FOREIGN_KEY_CONSTRAINT':
        errorState.message = 'Cannot delete this item as it is referenced by other records.'
        break
      case 'CONNECTION_ERROR':
        errorState.message = 'Unable to connect to the database. Please check your connection.'
        break
      case 'VALIDATION_ERROR':
        errorState.message = error.message || 'Validation failed. Please check your input.'
        break
    }

    return errorState
  }

  /**
   * Handle specific error codes
   */
  function handleSpecificErrorCode(code: string): void {
    switch (code) {
      case 'NETWORK_ERROR':
        if (retryAttempts.value < maxRetries) {
          retryAttempts.value++
          showRetryNotification()
        }
        break
      case 'SESSION_EXPIRED':
        router.push('/login')
        break
      case 'MAINTENANCE_MODE':
        router.push('/maintenance')
        break
    }
  }

  /**
   * Show error notification to user
   */
  function showErrorNotification(message: string, context: string): void {
    const notification: ErrorNotification = {
      id: Date.now().toString(),
      type: 'error',
      title: `Error in ${context}`,
      message,
      duration: 5000
    }

    notifications.value.push(notification)

    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(notification.id)
    }, notification.duration)
  }

  /**
   * Show retry notification
   */
  function showRetryNotification(): void {
    const notification: ErrorNotification = {
      id: Date.now().toString(),
      type: 'warning',
      title: 'Connection Issue',
      message: `Retrying... (Attempt ${retryAttempts.value}/${maxRetries})`,
      duration: 3000,
      action: {
        label: 'Retry Now',
        handler: () => retry()
      }
    }

    notifications.value.push(notification)
  }

  /**
   * Remove notification
   */
  function removeNotification(id: string): void {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Clear all errors
   */
  function clearErrors(): void {
    errors.value = []
  }

  /**
   * Clear specific error
   */
  function clearError(index: number): void {
    errors.value.splice(index, 1)
  }

  /**
   * Retry last failed operation
   */
  let retryCallback: (() => Promise<void>) | null = null

  function setRetryCallback(callback: () => Promise<void>): void {
    retryCallback = callback
  }

  async function retry(): Promise<void> {
    if (retryCallback && retryAttempts.value < maxRetries) {
      isLoading.value = true
      try {
        await retryCallback()
        retryAttempts.value = 0
        clearErrors()
      } catch (error) {
        handleError(error, 'Retry')
      } finally {
        isLoading.value = false
      }
    }
  }

  /**
   * Type guards
   */
  function isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'message' in error
    )
  }

  function isDbError(error: unknown): error is DbError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error &&
      !('statusCode' in error)
    )
  }

  /**
   * Wrapper for async operations with error handling
   */
  async function withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string,
    options?: {
      showNotification?: boolean
      retryable?: boolean
      fallback?: T
    }
  ): Promise<T | undefined> {
    isLoading.value = true
    clearErrors()

    try {
      const result = await operation()
      retryAttempts.value = 0
      return result
    } catch (error) {
      handleError(error, context)
      
      if (options?.retryable) {
        setRetryCallback(operation)
      }

      if (options?.showNotification !== false) {
        // Notification is already shown by handleError
      }

      return options?.fallback
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Form validation error handling
   */
  function handleValidationErrors(errors: Record<string, string>): void {
    Object.entries(errors).forEach(([field, message]) => {
      const errorState: ErrorState = {
        hasError: true,
        message,
        field,
        code: 'VALIDATION_ERROR',
        timestamp: new Date()
      }
      this.errors.value.push(errorState)
    })
  }

  return {
    // State
    errors,
    notifications,
    isLoading,
    hasErrors,
    latestError,
    
    // Methods
    handleError,
    clearErrors,
    clearError,
    removeNotification,
    retry,
    setRetryCallback,
    withErrorHandling,
    handleValidationErrors,
    
    // Utilities
    isApiError,
    isDbError
  }
}

// Global error handler for uncaught errors
export function setupGlobalErrorHandler(): void {
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection:', event.reason)
    event.preventDefault()
  })

  window.addEventListener('error', (event) => {
    logger.error('Global error:', event.error)
    event.preventDefault()
  })
}