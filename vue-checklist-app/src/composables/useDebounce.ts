import { ref, watch, type Ref, type UnwrapRef } from 'vue'

export function useDebounce<T>(
  value: Ref<T> | T,
  delay: number = 300
): Ref<UnwrapRef<T>> {
  const debouncedValue = ref<T>(value)
  let timeoutId: NodeJS.Timeout | null = null

  const updateValue = (newValue: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue as UnwrapRef<T>
    }, delay)
  }

  // If value is a ref, watch it
  if (value && typeof value === 'object' && 'value' in value) {
    watch(value as Ref<T>, (newValue) => {
      updateValue(newValue)
    }, { immediate: true })
  } else {
    // If it's a plain value, set it immediately
    debouncedValue.value = value as UnwrapRef<T>
  }

  return debouncedValue as Ref<UnwrapRef<T>>
}

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  let timeoutId: NodeJS.Timeout | null = null

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(fn(...args))
      }, delay)
    })
  }) as T
}