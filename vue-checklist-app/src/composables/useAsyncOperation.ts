import { ref, computed } from 'vue'
import { useErrorHandler } from './useErrorHandler'
import { logger } from '@/services/logger'

/**
 * Composable for handling async operations with loading, error, and success states
 */
export function useAsyncOperation<T = any>() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<T | null>(null)
  const isSuccess = ref(false)
  
  const { handleError } = useErrorHandler()
  
  // Computed properties for convenience
  const isIdle = computed(() => !isLoading.value && !error.value && !isSuccess.value)
  const hasError = computed(() => error.value !== null)
  
  /**
   * Execute an async operation with proper error handling and loading states
   */
  async function execute(
    operation: () => Promise<T>,
    options: {
      onSuccess?: (result: T) => void
      onError?: (error: Error) => void
      context?: string
      showErrorNotification?: boolean
    } = {}
  ): Promise<T | null> {
    // Reset states
    isLoading.value = true
    error.value = null
    isSuccess.value = false
    data.value = null
    
    try {
      logger.debug(`Starting async operation: ${options.context || 'Unknown'}`)
      
      const result = await operation()
      
      // Success handling
      data.value = result
      isSuccess.value = true
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      
      logger.debug(`Async operation completed: ${options.context || 'Unknown'}`)
      
      return result
    } catch (err) {
      // Error handling
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      
      logger.error(`Async operation failed: ${options.context || 'Unknown'}`, errorObj)
      
      if (options.showErrorNotification !== false) {
        handleError(errorObj, options.context)
      }
      
      if (options.onError) {
        options.onError(errorObj)
      }
      
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Reset all states
   */
  function reset() {
    isLoading.value = false
    error.value = null
    data.value = null
    isSuccess.value = false
  }
  
  /**
   * Retry the last operation
   */
  async function retry(
    operation: () => Promise<T>,
    options: Parameters<typeof execute>[1] = {}
  ): Promise<T | null> {
    reset()
    return execute(operation, options)
  }
  
  return {
    // State
    isLoading,
    error,
    data,
    isSuccess,
    isIdle,
    hasError,
    
    // Methods
    execute,
    reset,
    retry
  }
}

/**
 * Composable for managing multiple async operations
 */
export function useMultipleAsyncOperations() {
  const operations = new Map<string, ReturnType<typeof useAsyncOperation>>()
  
  function getOperation(key: string) {
    if (!operations.has(key)) {
      operations.set(key, useAsyncOperation())
    }
    return operations.get(key)!
  }
  
  function resetAll() {
    operations.forEach(op => op.reset())
  }
  
  const isAnyLoading = computed(() => 
    Array.from(operations.values()).some(op => op.isLoading.value)
  )
  
  const hasAnyError = computed(() => 
    Array.from(operations.values()).some(op => op.hasError.value)
  )
  
  return {
    getOperation,
    resetAll,
    isAnyLoading,
    hasAnyError
  }
}