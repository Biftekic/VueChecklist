import { ref, watch, type Ref, type UnwrapRef } from 'vue'

export interface UseLocalStorageOptions {
  serializer?: (value: any) => string
  deserializer?: (value: string) => any
  onError?: (error: Error) => void
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions = {}
): [Ref<UnwrapRef<T>>, (value: T | null) => void, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = console.error
  } = options

  // Initialize the ref with the stored value or default
  const data = ref<T>(defaultValue)

  // Try to get initial value from localStorage
  try {
    const item = window.localStorage.getItem(key)
    if (item !== null) {
      data.value = deserializer(item)
    }
  } catch (error) {
    onError(error as Error)
  }

  // Watch for changes and update localStorage
  const stopWatcher = watch(
    data,
    (newValue) => {
      try {
        if (newValue === null || newValue === undefined) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, serializer(newValue))
        }
      } catch (error) {
        onError(error as Error)
      }
    },
    { deep: true }
  )

  // Manual update function
  const setItem = (value: T | null) => {
    try {
      if (value === null) {
        window.localStorage.removeItem(key)
        data.value = defaultValue as UnwrapRef<T>
      } else {
        data.value = value as UnwrapRef<T>
        window.localStorage.setItem(key, serializer(value))
      }
    } catch (error) {
      onError(error as Error)
    }
  }

  // Remove item function
  const removeItem = () => {
    try {
      window.localStorage.removeItem(key)
      data.value = defaultValue as UnwrapRef<T>
    } catch (error) {
      onError(error as Error)
    }
  }

  // Listen for storage events from other tabs
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== null) {
      try {
        data.value = deserializer(e.newValue)
      } catch (error) {
        onError(error as Error)
      }
    } else if (e.key === key && e.newValue === null) {
      data.value = defaultValue as UnwrapRef<T>
    }
  }

  window.addEventListener('storage', handleStorageChange)

  // Cleanup function
  const cleanup = () => {
    stopWatcher()
    window.removeEventListener('storage', handleStorageChange)
  }

  // Auto cleanup when component unmounts
  if (getCurrentInstance) {
    const instance = getCurrentInstance()
    if (instance) {
      onUnmounted(cleanup)
    }
  }

  return [data as Ref<UnwrapRef<T>>, setItem, removeItem]
}

// Helper function to clear all localStorage data with a specific prefix
export function clearLocalStorageByPrefix(prefix: string): void {
  const keys = Object.keys(window.localStorage)
  keys.forEach(key => {
    if (key.startsWith(prefix)) {
      window.localStorage.removeItem(key)
    }
  })
}

// Helper to get all localStorage keys
export function getLocalStorageKeys(): string[] {
  return Object.keys(window.localStorage)
}

// Helper to get localStorage size
export function getLocalStorageSize(): number {
  let size = 0
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      size += window.localStorage[key].length + key.length
    }
  }
  return size
}

// Import these if they're available in the environment
import { getCurrentInstance, onUnmounted } from 'vue'