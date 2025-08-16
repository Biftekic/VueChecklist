import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const isOnline = ref(navigator.onLine)
  const notification = ref(null)
  const currentStep = ref(1)
  const totalSteps = ref(5)
  
  // Computed
  const stepProgress = computed(() => {
    return (currentStep.value / totalSteps.value) * 100
  })
  
  // Actions
  function setLoading(value) {
    isLoading.value = value
  }
  
  function setOnlineStatus(value) {
    isOnline.value = value
  }
  
  function showNotification(options) {
    // Handle both string and object arguments
    if (typeof options === 'string') {
      options = { message: options, type: 'info', duration: 3000 }
    }
    
    notification.value = {
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 3000,
      action: options.action,
      timestamp: Date.now()
    }
    
    if (notification.value.duration > 0) {
      setTimeout(() => {
        notification.value = null
      }, notification.value.duration)
    }
  }
  
  function clearNotification() {
    notification.value = null
  }
  
  function setStep(step) {
    currentStep.value = step
  }
  
  function nextStep() {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++
    }
  }
  
  function previousStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  function resetSteps() {
    currentStep.value = 1
  }
  
  // Initialize online/offline listeners
  window.addEventListener('online', () => setOnlineStatus(true))
  window.addEventListener('offline', () => setOnlineStatus(false))
  
  return {
    // State
    isLoading,
    isOnline,
    notification,
    currentStep,
    totalSteps,
    
    // Computed
    stepProgress,
    
    // Actions
    setLoading,
    setOnlineStatus,
    showNotification,
    clearNotification,
    setStep,
    nextStep,
    previousStep,
    resetSteps
  }
})