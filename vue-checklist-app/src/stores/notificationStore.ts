import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
  timestamp: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  
  function showNotification(message: string, type: Notification['type'] = 'info', timeout = 5000) {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timeout,
      timestamp: Date.now()
    }
    
    notifications.value.push(notification)
    
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, timeout)
    }
    
    return notification.id
  }
  
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  function clearNotifications() {
    notifications.value = []
  }
  
  function showSuccess(message: string, timeout?: number) {
    return showNotification(message, 'success', timeout)
  }
  
  function showError(message: string, timeout?: number) {
    return showNotification(message, 'error', timeout)
  }
  
  function showWarning(message: string, timeout?: number) {
    return showNotification(message, 'warning', timeout)
  }
  
  function showInfo(message: string, timeout?: number) {
    return showNotification(message, 'info', timeout)
  }
  
  return {
    notifications,
    showNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})