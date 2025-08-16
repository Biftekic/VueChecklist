<template>
  <div v-if="hasError" class="error-boundary">
    <v-container>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6">
          <v-alert
            type="error"
            prominent
            variant="elevated"
            class="mt-4"
          >
            <template v-slot:title>
              <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
              Oops! Something went wrong
            </template>
            
            <div class="mt-3">
              <p class="mb-3">{{ errorMessage }}</p>
              
              <div class="d-flex gap-2 flex-wrap">
                <v-btn
                  color="white"
                  variant="outlined"
                  @click="retry"
                  prepend-icon="mdi-refresh"
                >
                  Try Again
                </v-btn>
                
                <v-btn
                  color="white"
                  variant="outlined"
                  @click="goHome"
                  prepend-icon="mdi-home"
                >
                  Go Home
                </v-btn>
                
                <v-btn
                  v-if="showDetails"
                  color="white"
                  variant="text"
                  @click="toggleDetails"
                  size="small"
                >
                  {{ detailsVisible ? 'Hide' : 'Show' }} Details
                </v-btn>
              </div>
              
              <v-expand-transition>
                <div v-if="detailsVisible && errorDetails" class="mt-4">
                  <v-card variant="outlined" color="error">
                    <v-card-text>
                      <pre class="error-details">{{ errorDetails }}</pre>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </div>
          </v-alert>
          
          <v-card class="mt-4" variant="outlined">
            <v-card-text>
              <p class="text-body-2 text-medium-emphasis">
                If this problem persists, please contact support or try:
              </p>
              <ul class="mt-2 text-body-2">
                <li>Clearing your browser cache</li>
                <li>Checking your internet connection</li>
                <li>Using a different browser</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

// Props
interface Props {
  fallback?: string
  showDetails?: boolean
  onError?: (error: Error) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'An unexpected error occurred. Please try again.',
  showDetails: import.meta.env.DEV // Show details in development
})

// Composables
const router = useRouter()
const appStore = useAppStore()

// State
const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const detailsVisible = ref(false)

// Error capture
onErrorCaptured((err: Error, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message || props.fallback
  
  // Capture error details
  if (props.showDetails) {
    errorDetails.value = `${err.stack || err.toString()}\n\nComponent: ${info}`
  }
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error captured in boundary:', {
      error: err,
      instance,
      info,
      stack: err.stack
    })
  }
  
  // Log to monitoring service in production
  if (import.meta.env.PROD) {
    logErrorToService(err, info)
  }
  
  // Call custom error handler if provided
  if (props.onError) {
    props.onError(err)
  }
  
  // Show notification
  appStore.showNotification({
    message: 'An error occurred. The issue has been logged.',
    type: 'error',
    duration: 5000
  })
  
  // Prevent error propagation
  return false
})

// Methods
const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  detailsVisible.value = false
  
  // Force re-render of child components
  window.location.reload()
}

const goHome = () => {
  hasError.value = false
  router.push('/')
}

const toggleDetails = () => {
  detailsVisible.value = !detailsVisible.value
}

const logErrorToService = async (error: Error, info: string) => {
  try {
    // This would be replaced with actual error logging service
    // For now, just store in localStorage for debugging
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
    errors.push({
      message: error.message,
      stack: error.stack,
      info,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    })
    
    // Keep only last 10 errors
    if (errors.length > 10) {
      errors.shift()
    }
    
    localStorage.setItem('app_errors', JSON.stringify(errors))
  } catch (e) {
    console.error('Failed to log error:', e)
  }
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.error-details {
  font-family: monospace;
  font-size: 0.75rem;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.gap-2 {
  gap: 0.5rem;
}
</style>