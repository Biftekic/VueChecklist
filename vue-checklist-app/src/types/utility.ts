// Utility type definitions for Vue Checklist Application

// Generic types for common patterns
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type MaybeRef<T> = T | import('vue').Ref<T>

// Function types
export type VoidFunction = () => void
export type AsyncVoidFunction = () => Promise<void>
export type Callback<T = void> = (result: T) => void
export type AsyncCallback<T = void> = (result: T) => Promise<void>
export type ErrorCallback = (error: Error) => void

// Form and validation types
export type ValidationRule<T = unknown> = (value: T) => boolean | string
export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
  warnings?: Record<string, string>
}

export type FormField<T = unknown> = {
  value: T
  error: string | null
  touched: boolean
  dirty: boolean
  rules?: ValidationRule<T>[]
}

export type FormData = Record<string, unknown>
export type FormErrors = Record<string, string>
export type FormTouched = Record<string, boolean>

// Database operation types
export type DbOperation<T> = {
  type: 'create' | 'read' | 'update' | 'delete'
  data?: T
  id?: string | number
  options?: DbOperationOptions
}

export type DbOperationOptions = {
  transaction?: boolean
  cascade?: boolean
  validate?: boolean
  skipHooks?: boolean
}

export type DbResult<T> = {
  success: boolean
  data?: T
  error?: DbError
  metadata?: DbMetadata
}

export type DbError = {
  code: string
  message: string
  field?: string
  value?: unknown
  details?: Record<string, unknown>
}

export type DbMetadata = {
  rowsAffected?: number
  lastInsertId?: string | number
  executionTime?: number
}

// API and network types
export type ApiResponse<T = unknown> = {
  data?: T
  error?: ApiError
  status: number
  headers?: Record<string, string>
}

export type ApiError = {
  code: string
  message: string
  statusCode: number
  details?: Record<string, unknown>
}

// Logger types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'
export type LogEntry = {
  level: LogLevel
  message: string
  timestamp: Date
  context?: string
  data?: unknown
  error?: Error
}

export type LoggerOptions = {
  minLevel?: LogLevel
  enableConsole?: boolean
  enableRemote?: boolean
  remoteUrl?: string
  format?: 'json' | 'text'
}

// Event types
export type EventHandler<T = Event> = (event: T) => void
export type CustomEventHandler<T = unknown> = (data: T) => void

// Storage types
export type StorageValue = string | number | boolean | object | null
export type StorageOptions = {
  expires?: Date | number
  encrypt?: boolean
  compress?: boolean
}

// Task and checklist specific utility types
export type TaskUpdate = Partial<import('./index').Task>
export type ChecklistUpdate = Partial<import('./index').Checklist>
export type ClientUpdate = Partial<import('./index').ClientInfo>
export type PropertyUpdate = Partial<import('./index').PropertyDetails>

// PDF generation types
export type PdfOptions = {
  orientation?: 'portrait' | 'landscape'
  format?: 'a4' | 'letter' | 'legal'
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  includeImages?: boolean
  includeSignature?: boolean
  watermark?: string
}

export type PdfContent = {
  title: string
  subtitle?: string
  sections: PdfSection[]
  footer?: string
}

export type PdfSection = {
  heading: string
  content: string | string[] | Record<string, unknown>
  type: 'text' | 'list' | 'table' | 'image'
}

// Router and navigation types
export type RouteParams = Record<string, string | number>
export type QueryParams = Record<string, string | number | boolean | undefined>
export type NavigationGuard = (to: unknown, from: unknown) => boolean | string | void

// Component prop types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type Variant = 'filled' | 'outlined' | 'text' | 'elevated'
export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center'

// Sorting and filtering types
export type SortOrder = 'asc' | 'desc'
export type SortField<T> = keyof T | string
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith'

export type Filter<T = unknown> = {
  field: keyof T | string
  operator: FilterOperator
  value: unknown
}

export type SortConfig<T = unknown> = {
  field: SortField<T>
  order: SortOrder
}

// Pagination types
export type PaginationOptions = {
  page: number
  pageSize: number
  total?: number
}

export type PaginatedResult<T> = {
  data: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Date and time types
export type DateRange = {
  start: Date
  end: Date
}

export type TimeSlot = {
  start: string // HH:mm format
  end: string // HH:mm format
  available?: boolean
}

// File and upload types
export type FileUpload = {
  file: File
  progress?: number
  status?: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
}

export type FileValidation = {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  allowedExtensions?: string[]
}

// Search and fuzzy matching types
export type SearchOptions = {
  caseSensitive?: boolean
  fuzzy?: boolean
  threshold?: number
  limit?: number
  fields?: string[]
}

export type SearchResult<T> = {
  item: T
  score: number
  matches?: SearchMatch[]
}

export type SearchMatch = {
  field: string
  value: string
  indices: [number, number][]
}

// Export all types for convenience
export type AnyFunction = (...args: unknown[]) => unknown
export type AnyObject = Record<string, unknown>
export type AnyArray = unknown[]
export type Primitive = string | number | boolean | null | undefined | symbol | bigint