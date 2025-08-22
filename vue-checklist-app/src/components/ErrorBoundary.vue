<template>
  <div v-if="hasError" class="error-boundary">
    <v-alert
      type="error"
      prominent
      :icon="errorIcon"
      class="ma-4"
    >
      <template #title>
        <h3>{{ errorTitle }}</h3>
      </template>
      
      <div class="error-content">
        <p class="mb-2">{{ errorMessage }}</p>
        
        <v-expansion-panels v-if="showDetails && errorDetails" class="mt-3">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon left>mdi-information-outline</v-icon>
              Error Details
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="error-stack">{{ errorDetails }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <div class="mt-4 d-flex gap-2">
        <v-btn
          color="primary"
          variant="elevated"
          @click="handleRetry"
          :loading="isRetrying"
        >
          <v-icon left>mdi-refresh</v-icon>
          Retry
        </v-btn>
        
        <v-btn
          variant="outlined"
          @click="handleReset"
        >
          <v-icon left>mdi-restart</v-icon>
          Reset
        </v-btn>

        <v-btn
          v-if="canGoBack"
          variant="text"
          @click="handleGoBack"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Go Back
        </v-btn>
      </div>
    </v-alert>

    <!-- Fallback UI -->
    <div v-if="showFallback" class="fallback-content pa-4">
      <slot name="fallback">
        <v-card class="mx-auto" max-width="600">
          <v-card-text class="text-center">
            <v-icon size="64" color="warning" class="mb-4">
              mdi-alert-circle-outline
            </v-icon>
            <h3 class="mb-2">Unable to load this section</h3>
            <p class="text-grey">
              We're having trouble loading this content. 
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </v-card-text>
        </v-card>
      </slot>
    </div>
  </div>
  
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { logger } from '@/services/logger'
import { useErrorHandler } from '@/composables/useErrorHandler'

interface Props {
  fallback?: boolean
  showDetails?: boolean
  canRetry?: boolean
  resetOnError?: boolean
  errorTitle?: string
  errorIcon?: string
  onError?: (error: Error) => void
  onRetry?: () => Promise<void>
  onReset?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: true,
  showDetails: import.meta.env.DEV,
  canRetry: true,
  resetOnError: false,
  errorTitle: 'Something went wrong',
  errorIcon: 'mdi-alert-circle'
})

const emit = defineEmits<{
  error: [error: Error]
  retry: []
  reset: []
}>()

const router = useRouter()
const { handleError } = useErrorHandler()

const hasError = ref(false)
const currentError = ref<Error | null>(null)
const errorMessage = ref('')
const errorDetails = ref('')
const isRetrying = ref(false)
const showFallback = ref(false)
const retryCount = ref(0)
const maxRetries = 3

const canGoBack = computed(() => {
  return window.history.length > 1
})

/**
 * Capture errors from child components
 */
onErrorCaptured((error: Error, instance, info) => {
  logger.error('Error captured in boundary:', { error, instance, info })
  
  hasError.value = true
  currentError.value = error
  errorMessage.value = getErrorMessage(error)
  errorDetails.value = getErrorDetails(error)
  
  // Call custom error handler if provided
  if (props.onError) {
    props.onError(error)
  }
  
  // Handle error with global handler
  handleError(error, 'Component Error')
  
  // Emit error event
  emit('error', error)
  
  // Show fallback after multiple retries
  if (retryCount.value >= maxRetries) {
    showFallback.value = true
  }
  
  // Prevent error propagation
  return false
})

/**
 * Get user-friendly error message
 */
function getErrorMessage(error: Error): string {
  // Check for common error types
  if (error.name === 'ChunkLoadError') {
    return 'Failed to load application resources. Please refresh the page.'
  }
  
  if (error.message.includes('Network')) {
    return 'Network error. Please check your internet connection.'
  }
  
  if (error.message.includes('Permission')) {
    return 'You do not have permission to access this resource.'
  }
  
  // Default message
  return error.message || 'An unexpected error occurred.'
}

/**
 * Get error details for debugging
 */
function getErrorDetails(error: Error): string {
  if (!props.showDetails) {
    return ''
  }
  
  const details = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  }
  
  return JSON.stringify(details, null, 2)
}

/**
 * Handle retry action
 */
async function handleRetry(): Promise<void> {
  isRetrying.value = true
  retryCount.value++
  
  try {
    if (props.onRetry) {
      await props.onRetry()
    }
    
    // Clear error state on successful retry
    hasError.value = false
    currentError.value = null
    errorMessage.value = ''
    errorDetails.value = ''
    showFallback.value = false
    
    emit('retry')
  } catch (error) {
    logger.error('Retry failed:', error)
    
    if (retryCount.value >= maxRetries) {
      showFallback.value = true
      errorMessage.value = 'Multiple retry attempts failed. Please contact support.'
    }
  } finally {
    isRetrying.value = false
  }
}

/**
 * Handle reset action
 */
function handleReset(): void {
  if (props.onReset) {
    props.onReset()
  }
  
  // Reset all error state
  hasError.value = false
  currentError.value = null
  errorMessage.value = ''
  errorDetails.value = ''
  showFallback.value = false
  retryCount.value = 0
  
  emit('reset')
  
  // Optionally reload the page
  if (props.resetOnError) {
    window.location.reload()
  }
}

/**
 * Handle go back action
 */
function handleGoBack(): void {
  if (router) {
    router.back()
  } else {
    window.history.back()
  }
}

/**
 * Watch for prop changes to reset error state
 */
watch(() => props.resetOnError, (shouldReset) => {
  if (shouldReset && hasError.value) {
    handleReset()
  }
})

// Expose methods for parent components
defineExpose({
  hasError,
  currentError,
  handleRetry,
  handleReset
})
</script>

<style scoped>
.error-boundary {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.error-content {
  max-width: 800px;
}

.error-stack {
  font-family: monospace;
  font-size: 12px;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.fallback-content {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d-flex.gap-2 {
  gap: 8px;
}
</style>