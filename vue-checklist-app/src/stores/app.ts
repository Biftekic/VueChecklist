import { defineStore } from 'pinia'
import { ref, computed, Ref, ComputedRef } from 'vue'

interface Notification {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
  timestamp?: number
}

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading: Ref<boolean> = ref(false)
  const isOnline: Ref<boolean> = ref(navigator.onLine)
  const notification: Ref<Notification | null> = ref(null)
  const currentStep: Ref<number> = ref(1)
  const totalSteps: Ref<number> = ref(5)
  
  // Computed
  const stepProgress: ComputedRef<number> = computed(() => {
    return (currentStep.value / totalSteps.value) * 100
  })
  
  // Actions
  function setLoading(value: boolean): void {
    isLoading.value = value
  }
  
  function setOnlineStatus(value: boolean): void {
    isOnline.value = value
  }
  
  function showNotification(options: string | Notification, type?: 'info' | 'success' | 'warning' | 'error'): void {
    // Handle both string and object arguments
    let notificationData: Notification
    if (typeof options === 'string') {
      notificationData = { message: options, type: type || 'info', duration: 3000 }
    } else {
      notificationData = options
    }
    
    notification.value = {
      message: notificationData.message,
      type: notificationData.type || 'info',
      duration: notificationData.duration || 3000,
      action: notificationData.action,
      timestamp: Date.now()
    }
    
    if (notification.value.duration && notification.value.duration > 0) {
      setTimeout(() => {
        notification.value = null
      }, notification.value.duration)
    }
  }
  
  function clearNotification(): void {
    notification.value = null
  }
  
  function setStep(step: number): void {
    currentStep.value = step
  }
  
  function nextStep(): void {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++
    }
  }
  
  function previousStep(): void {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  function resetSteps(): void {
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