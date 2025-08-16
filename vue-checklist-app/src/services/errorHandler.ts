/**
 * Comprehensive Error Handling Service
 * Provides centralized error management, logging, and recovery strategies
 */

import { useAppStore } from '@/stores/app'
import { Router } from 'vue-router'

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  DATABASE = 'database',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

export interface ErrorContext {
  userId?: string
  action?: string
  component?: string
  data?: any
  timestamp?: string
  url?: string
  userAgent?: string
}

export interface AppError extends Error {
  severity?: ErrorSeverity
  category?: ErrorCategory
  context?: ErrorContext
  recoverable?: boolean
  retryable?: boolean
  userMessage?: string
  technicalDetails?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorQueue: AppError[] = []
  private maxQueueSize = 50
  private retryAttempts = new Map<string, number>()
  private maxRetries = 3
  private router?: Router

  private constructor() {
    this.setupGlobalHandlers()
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  setRouter(router: Router) {
    this.router = router
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason), {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        context: {
          action: 'unhandledrejection',
          timestamp: new Date().toISOString()
        }
      })
      event.preventDefault()
    })

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        context: {
          action: 'global_error',
          timestamp: new Date().toISOString(),
          url: event.filename,
          data: { line: event.lineno, column: event.colno }
        }
      })
      event.preventDefault()
    })
  }

  /**
   * Main error handling method
   */
  handleError(error: Error | AppError, options: Partial<AppError> = {}): void {
    const appError = this.createAppError(error, options)
    
    // Add to error queue
    this.addToQueue(appError)
    
    // Log the error
    this.logError(appError)
    
    // Show user notification based on severity
    this.notifyUser(appError)
    
    // Attempt recovery if possible
    if (appError.recoverable) {
      this.attemptRecovery(appError)
    }
    
    // Report to monitoring service
    if (import.meta.env.PROD) {
      this.reportToMonitoring(appError)
    }
  }

  /**
   * Create standardized error object
   */
  private createAppError(error: Error | AppError, options: Partial<AppError>): AppError {
    const appError = error as AppError
    
    // Categorize error if not already categorized
    if (!appError.category) {
      appError.category = this.categorizeError(error)
    }
    
    // Determine severity if not set
    if (!appError.severity) {
      appError.severity = this.determineSeverity(appError)
    }
    
    // Add context
    appError.context = {
      ...appError.context,
      ...options.context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }
    
    // Set user-friendly message
    if (!appError.userMessage) {
      appError.userMessage = this.getUserMessage(appError)
    }
    
    // Merge additional options
    Object.assign(appError, options)
    
    return appError
  }

  /**
   * Categorize error based on type and message
   */
  private categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorCategory.NETWORK
    } else if (message.includes('database') || message.includes('indexeddb')) {
      return ErrorCategory.DATABASE
    } else if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCategory.VALIDATION
    } else if (message.includes('permission') || message.includes('unauthorized')) {
      return ErrorCategory.PERMISSION
    } else if (message.includes('business') || message.includes('rule')) {
      return ErrorCategory.BUSINESS_LOGIC
    } else {
      return ErrorCategory.UNKNOWN
    }
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: AppError): ErrorSeverity {
    switch (error.category) {
      case ErrorCategory.PERMISSION:
      case ErrorCategory.SYSTEM:
        return ErrorSeverity.CRITICAL
      case ErrorCategory.DATABASE:
      case ErrorCategory.NETWORK:
        return ErrorSeverity.HIGH
      case ErrorCategory.BUSINESS_LOGIC:
        return ErrorSeverity.MEDIUM
      case ErrorCategory.VALIDATION:
        return ErrorSeverity.LOW
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  /**
   * Get user-friendly error message
   */
  private getUserMessage(error: AppError): string {
    const messages: Record<ErrorCategory, string> = {
      [ErrorCategory.NETWORK]: 'Connection issue. Please check your internet and try again.',
      [ErrorCategory.DATABASE]: 'Unable to access data. Please refresh the page.',
      [ErrorCategory.VALIDATION]: 'Please check your input and try again.',
      [ErrorCategory.PERMISSION]: 'You don\'t have permission to perform this action.',
      [ErrorCategory.BUSINESS_LOGIC]: 'Unable to complete the operation. Please try again.',
      [ErrorCategory.SYSTEM]: 'A system error occurred. Please refresh the page.',
      [ErrorCategory.UNKNOWN]: 'An unexpected error occurred. Please try again.'
    }
    
    return error.userMessage || messages[error.category || ErrorCategory.UNKNOWN]
  }

  /**
   * Add error to queue for analysis
   */
  private addToQueue(error: AppError): void {
    this.errorQueue.push(error)
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('error_queue', JSON.stringify(
        this.errorQueue.slice(-10).map(e => ({
          message: e.message,
          category: e.category,
          severity: e.severity,
          context: e.context,
          timestamp: e.context?.timestamp
        }))
      ))
    } catch (e) {
      console.error('Failed to persist error queue:', e)
    }
  }

  /**
   * Log error based on environment
   */
  private logError(error: AppError): void {
    const logData = {
      message: error.message,
      category: error.category,
      severity: error.severity,
      context: error.context,
      stack: error.stack
    }
    
    if (import.meta.env.DEV) {
      // Detailed logging in development
      console.group(`🔴 ${error.severity?.toUpperCase()} Error`)
      console.error('Message:', error.message)
      console.error('Category:', error.category)
      console.error('Context:', error.context)
      console.error('Stack:', error.stack)
      console.groupEnd()
    } else {
      // Simplified logging in production
      console.error('Application Error:', logData)
    }
  }

  /**
   * Show user notification
   */
  private notifyUser(error: AppError): void {
    const appStore = useAppStore()
    
    // Don't show notification for low severity validation errors
    if (error.severity === ErrorSeverity.LOW && error.category === ErrorCategory.VALIDATION) {
      return
    }
    
    const notificationTypes = {
      [ErrorSeverity.LOW]: 'info',
      [ErrorSeverity.MEDIUM]: 'warning',
      [ErrorSeverity.HIGH]: 'error',
      [ErrorSeverity.CRITICAL]: 'error'
    }
    
    appStore.showNotification({
      message: error.userMessage || 'An error occurred',
      type: notificationTypes[error.severity || ErrorSeverity.MEDIUM],
      duration: error.severity === ErrorSeverity.CRITICAL ? 8000 : 5000,
      action: error.retryable ? {
        label: 'Retry',
        handler: () => this.retry(error)
      } : undefined
    })
  }

  /**
   * Attempt to recover from error
   */
  private attemptRecovery(error: AppError): void {
    switch (error.category) {
      case ErrorCategory.NETWORK:
        this.handleNetworkRecovery(error)
        break
      case ErrorCategory.DATABASE:
        this.handleDatabaseRecovery(error)
        break
      case ErrorCategory.PERMISSION:
        this.handlePermissionRecovery(error)
        break
      default:
        // No specific recovery strategy
        break
    }
  }

  /**
   * Handle network error recovery
   */
  private handleNetworkRecovery(error: AppError): void {
    // Check if online
    if (!navigator.onLine) {
      // Wait for connection
      window.addEventListener('online', () => {
        this.retry(error)
      }, { once: true })
    } else {
      // Retry with exponential backoff
      const retryCount = this.retryAttempts.get(error.message) || 0
      if (retryCount < this.maxRetries) {
        setTimeout(() => {
          this.retry(error)
        }, Math.pow(2, retryCount) * 1000)
      }
    }
  }

  /**
   * Handle database error recovery
   */
  private handleDatabaseRecovery(error: AppError): void {
    // Clear potentially corrupted data
    if (error.message.includes('corruption') || error.message.includes('quota')) {
      this.clearLocalData()
    }
  }

  /**
   * Handle permission error recovery
   */
  private handlePermissionRecovery(error: AppError): void {
    // Redirect to login or home
    if (this.router) {
      this.router.push('/login')
    }
  }

  /**
   * Retry failed operation
   */
  private retry(error: AppError): void {
    const retryCount = this.retryAttempts.get(error.message) || 0
    this.retryAttempts.set(error.message, retryCount + 1)
    
    // Execute retry callback if provided
    if (error.context?.action) {
      // This would trigger the original action
      console.log('Retrying action:', error.context.action)
    }
  }

  /**
   * Clear local data as recovery mechanism
   */
  private clearLocalData(): void {
    try {
      // Clear IndexedDB
      if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name)
            }
          })
        })
      }
      
      // Clear localStorage
      localStorage.clear()
      
      // Reload page
      window.location.reload()
    } catch (e) {
      console.error('Failed to clear local data:', e)
    }
  }

  /**
   * Report error to monitoring service
   */
  private async reportToMonitoring(error: AppError): Promise<void> {
    try {
      // This would be replaced with actual monitoring service integration
      // For example: Sentry, LogRocket, or custom service
      const errorReport = {
        message: error.message,
        category: error.category,
        severity: error.severity,
        context: error.context,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        url: window.location.href
      }
      
      // Simulate sending to monitoring service
      console.log('Error reported to monitoring:', errorReport)
      
      // In production, this would be:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // })
    } catch (e) {
      console.error('Failed to report error to monitoring:', e)
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number
    byCategory: Record<ErrorCategory, number>
    bySeverity: Record<ErrorSeverity, number>
    recent: AppError[]
  } {
    const byCategory: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}
    
    this.errorQueue.forEach(error => {
      const category = error.category || ErrorCategory.UNKNOWN
      const severity = error.severity || ErrorSeverity.MEDIUM
      
      byCategory[category] = (byCategory[category] || 0) + 1
      bySeverity[severity] = (bySeverity[severity] || 0) + 1
    })
    
    return {
      total: this.errorQueue.length,
      byCategory: byCategory as Record<ErrorCategory, number>,
      bySeverity: bySeverity as Record<ErrorSeverity, number>,
      recent: this.errorQueue.slice(-5)
    }
  }

  /**
   * Clear error queue
   */
  clearErrors(): void {
    this.errorQueue = []
    this.retryAttempts.clear()
    localStorage.removeItem('error_queue')
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Export helper function for use in components
export function useErrorHandler() {
  return errorHandler
}