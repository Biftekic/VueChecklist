import { ref, computed, reactive } from 'vue'

export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
  startTime?: Date
  estimatedTime?: number // in seconds
}

export interface LoadingOptions {
  message?: string
  estimatedTime?: number
  showProgress?: boolean
  minimum?: number // Minimum loading time in ms
}

export function useLoadingState(initialMessage?: string) {
  const loadingStates = reactive<Record<string, LoadingState>>({})
  const globalLoading = ref(false)
  const globalProgress = ref(0)
  const globalMessage = ref(initialMessage || '')

  /**
   * Check if any operation is loading
   */
  const isAnyLoading = computed(() => {
    return globalLoading.value || Object.values(loadingStates).some(state => state.isLoading)
  })

  /**
   * Get loading state for a specific operation
   */
  function getLoadingState(key: string): LoadingState | undefined {
    return loadingStates[key]
  }

  /**
   * Start loading for a specific operation
   */
  function startLoading(key: string, options?: LoadingOptions): void {
    loadingStates[key] = {
      isLoading: true,
      progress: options?.showProgress ? 0 : undefined,
      message: options?.message,
      startTime: new Date(),
      estimatedTime: options?.estimatedTime
    }

    // Start progress simulation if needed
    if (options?.showProgress && options?.estimatedTime) {
      simulateProgress(key, options.estimatedTime)
    }
  }

  /**
   * Stop loading for a specific operation
   */
  async function stopLoading(key: string, options?: { minimum?: number }): Promise<void> {
    const state = loadingStates[key]
    if (!state) return

    const minimumTime = options?.minimum || 0
    const elapsedTime = Date.now() - (state.startTime?.getTime() || 0)
    
    // Ensure minimum loading time for better UX
    if (minimumTime > 0 && elapsedTime < minimumTime) {
      await new Promise(resolve => setTimeout(resolve, minimumTime - elapsedTime))
    }

    delete loadingStates[key]
  }

  /**
   * Update loading progress
   */
  function updateProgress(key: string, progress: number): void {
    const state = loadingStates[key]
    if (state) {
      state.progress = Math.min(100, Math.max(0, progress))
    }
  }

  /**
   * Update loading message
   */
  function updateMessage(key: string, message: string): void {
    const state = loadingStates[key]
    if (state) {
      state.message = message
    }
  }

  /**
   * Simulate progress based on estimated time
   */
  function simulateProgress(key: string, estimatedSeconds: number): void {
    const intervalMs = 100 // Update every 100ms
    const totalIntervals = (estimatedSeconds * 1000) / intervalMs
    let currentInterval = 0

    const interval = setInterval(() => {
      currentInterval++
      const progress = (currentInterval / totalIntervals) * 100
      
      const state = loadingStates[key]
      if (!state || !state.isLoading) {
        clearInterval(interval)
        return
      }

      // Use a logarithmic curve to slow down near the end
      const adjustedProgress = Math.min(95, progress * 0.9)
      updateProgress(key, adjustedProgress)

      if (currentInterval >= totalIntervals) {
        clearInterval(interval)
      }
    }, intervalMs)
  }

  /**
   * Set global loading state
   */
  function setGlobalLoading(loading: boolean, message?: string, progress?: number): void {
    globalLoading.value = loading
    if (message !== undefined) {
      globalMessage.value = message
    }
    if (progress !== undefined) {
      globalProgress.value = progress
    }
  }

  /**
   * Wrapper for async operations with loading state
   */
  async function withLoading<T>(
    key: string,
    operation: () => Promise<T>,
    options?: LoadingOptions
  ): Promise<T> {
    startLoading(key, options)
    
    try {
      const result = await operation()
      await stopLoading(key, { minimum: options?.minimum })
      return result
    } catch (error) {
      await stopLoading(key)
      throw error
    }
  }

  /**
   * Wrapper for multiple concurrent operations with loading state
   */
  async function withConcurrentLoading<T>(
    operations: Array<{
      key: string
      operation: () => Promise<T>
      options?: LoadingOptions
    }>
  ): Promise<T[]> {
    // Start all loading states
    operations.forEach(({ key, options }) => {
      startLoading(key, options)
    })

    try {
      // Execute all operations concurrently
      const results = await Promise.all(
        operations.map(({ operation }) => operation())
      )

      // Stop all loading states
      await Promise.all(
        operations.map(({ key, options }) => 
          stopLoading(key, { minimum: options?.minimum })
        )
      )

      return results
    } catch (error) {
      // Stop all loading states on error
      await Promise.all(
        operations.map(({ key }) => stopLoading(key))
      )
      throw error
    }
  }

  /**
   * Create a loading state for sequential operations
   */
  async function withSequentialLoading<T>(
    steps: Array<{
      key: string
      operation: () => Promise<T>
      message: string
      weight?: number // Relative weight for progress calculation
    }>
  ): Promise<T[]> {
    const totalWeight = steps.reduce((sum, step) => sum + (step.weight || 1), 0)
    let completedWeight = 0
    const results: T[] = []

    setGlobalLoading(true, steps[0]?.message || 'Processing...', 0)

    for (const step of steps) {
      startLoading(step.key, { message: step.message })
      
      try {
        const result = await step.operation()
        results.push(result)
        
        completedWeight += step.weight || 1
        const progress = (completedWeight / totalWeight) * 100
        setGlobalLoading(true, step.message, progress)
        
        await stopLoading(step.key)
      } catch (error) {
        await stopLoading(step.key)
        setGlobalLoading(false)
        throw error
      }
    }

    setGlobalLoading(false, 'Complete', 100)
    return results
  }

  /**
   * Reset all loading states
   */
  function reset(): void {
    Object.keys(loadingStates).forEach(key => {
      delete loadingStates[key]
    })
    globalLoading.value = false
    globalProgress.value = 0
    globalMessage.value = ''
  }

  return {
    // State
    loadingStates,
    globalLoading,
    globalProgress,
    globalMessage,
    isAnyLoading,
    
    // Methods
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    getLoadingState,
    setGlobalLoading,
    withLoading,
    withConcurrentLoading,
    withSequentialLoading,
    reset
  }
}

/**
 * Global loading state instance
 */
export const globalLoadingState = useLoadingState()

/**
 * Convenience function for global loading
 */
export function useGlobalLoading() {
  return {
    show: (message?: string) => globalLoadingState.setGlobalLoading(true, message),
    hide: () => globalLoadingState.setGlobalLoading(false),
    update: (message: string, progress?: number) => 
      globalLoadingState.setGlobalLoading(true, message, progress)
  }
}