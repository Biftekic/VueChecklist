import { ref, computed } from 'vue'

export interface LoadingState {
  loading: boolean
  message: string
  progress: number
}

export interface LoadingOptions {
  message?: string
  progress?: number
  timeout?: number
}

export function useLoading(initialState = false) {
  const isLoading = ref(initialState)
  const loadingMessage = ref('')
  const loadingProgress = ref(0)
  
  const loadingState = computed<LoadingState>(() => ({
    loading: isLoading.value,
    message: loadingMessage.value,
    progress: loadingProgress.value
  }))
  
  const startLoading = (message = 'Loading...'): void => {
    isLoading.value = true
    loadingMessage.value = message
    loadingProgress.value = 0
  }
  
  const stopLoading = (): void => {
    isLoading.value = false
    loadingMessage.value = ''
    loadingProgress.value = 100
  }
  
  const updateProgress = (progress: number): void => {
    loadingProgress.value = Math.min(100, Math.max(0, progress))
  }
  
  const withLoading = async <T>(
    fn: () => Promise<T>, 
    message = 'Processing...'
  ): Promise<T> => {
    try {
      startLoading(message)
      const result = await fn()
      return result
    } finally {
      stopLoading()
    }
  }
  
  return {
    isLoading,
    loadingMessage,
    loadingProgress,
    loadingState,
    startLoading,
    stopLoading,
    updateProgress,
    withLoading
  }
}