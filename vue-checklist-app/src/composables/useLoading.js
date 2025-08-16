import { ref, computed } from 'vue'

export function useLoading(initialState = false) {
  const isLoading = ref(initialState)
  const loadingMessage = ref('')
  const loadingProgress = ref(0)
  
  const loadingState = computed(() => ({
    loading: isLoading.value,
    message: loadingMessage.value,
    progress: loadingProgress.value
  }))
  
  const startLoading = (message = 'Loading...') => {
    isLoading.value = true
    loadingMessage.value = message
    loadingProgress.value = 0
  }
  
  const stopLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
    loadingProgress.value = 100
  }
  
  const updateProgress = (progress) => {
    loadingProgress.value = Math.min(100, Math.max(0, progress))
  }
  
  const withLoading = async (fn, message = 'Processing...') => {
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