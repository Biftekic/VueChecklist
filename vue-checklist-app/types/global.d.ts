/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_API_BASE_URL?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Window extensions
interface Window {
  __APP_VERSION__?: string
  __DEBUG_MODE__?: boolean
}

// Utility types
type Nullable<T> = T | null
type Optional<T> = T | undefined
type MaybeRef<T> = T | import('vue').Ref<T>

// Common types
type ID = string
type Timestamp = number | Date
type Status = 'pending' | 'in_progress' | 'completed' | 'cancelled'
type Priority = 'low' | 'medium' | 'high' | 'critical'

// Error types
interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}