/**
 * Application-wide constants
 */

// Time constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  
  // Notification timeouts
  NOTIFICATION_SHORT: 3000,
  NOTIFICATION_DEFAULT: 5000,
  NOTIFICATION_LONG: 10000,
  
  // API timeouts
  API_TIMEOUT: 30000,
  API_TIMEOUT_LONG: 60000,
  
  // Debounce delays
  DEBOUNCE_SHORT: 300,
  DEBOUNCE_DEFAULT: 500,
  DEBOUNCE_LONG: 1000
} as const

// Size limits
export const LIMITS = {
  // Component size limits (lines of code)
  MAX_COMPONENT_LINES: 200,
  WARNING_COMPONENT_LINES: 300,
  
  // List rendering
  VIRTUAL_SCROLL_THRESHOLD: 50,
  MAX_ITEMS_PER_PAGE: 25,
  DEFAULT_PAGE_SIZE: 10,
  
  // File sizes (in bytes)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // String lengths
  MAX_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_NOTES_LENGTH: 5000,
  
  // Bundle size targets (in KB)
  TARGET_BUNDLE_SIZE: 500,
  WARNING_BUNDLE_SIZE: 800,
  MAX_BUNDLE_SIZE: 1000
} as const

// Validation rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100
} as const

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const

// Checklist status
export const CHECKLIST_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived'
} as const

// Task priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const

// Frequency options
export const FREQUENCY = {
  ONCE: 'once',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as_needed'
} as const

// Industry types
export const INDUSTRY = {
  OFFICE: 'office',
  RESIDENTIAL: 'residential',
  MEDICAL: 'medical',
  HOSPITALITY: 'hospitality',
  RESTAURANT: 'restaurant',
  RETAIL: 'retail',
  AIRBNB: 'airbnb',
  INDUSTRIAL: 'industrial',
  EDUCATIONAL: 'educational',
  OTHER: 'other'
} as const

// Difficulty levels
export const DIFFICULTY = {
  EASY: 'easy',
  AVERAGE: 'average',
  DIFFICULT: 'difficult',
  VERY_DIFFICULT: 'very_difficult'
} as const

// Performance metrics
export const PERFORMANCE = {
  TARGET_FPS: 60,
  TARGET_LIGHTHOUSE_SCORE: 90,
  TARGET_ACCESSIBILITY_SCORE: 95,
  TARGET_TEST_COVERAGE: 80,
  MIN_TEST_COVERAGE: 60
} as const

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_CLIENTS: 'recent_clients',
  DRAFT_CHECKLIST: 'draft_checklist',
  LAST_SYNC: 'last_sync'
} as const

// Event names
export const EVENTS = {
  CHECKLIST_CREATED: 'checklist:created',
  CHECKLIST_UPDATED: 'checklist:updated',
  CHECKLIST_DELETED: 'checklist:deleted',
  TASK_COMPLETED: 'task:completed',
  SYNC_STARTED: 'sync:started',
  SYNC_COMPLETED: 'sync:completed',
  SYNC_FAILED: 'sync:failed',
  ERROR_OCCURRED: 'error:occurred'
} as const

// Keyboard shortcuts
export const SHORTCUTS = {
  SAVE: 'ctrl+s',
  NEW: 'ctrl+n',
  DELETE: 'ctrl+d',
  SEARCH: 'ctrl+f',
  ESCAPE: 'escape',
  ENTER: 'enter',
  TAB: 'tab',
  ARROW_UP: 'arrowup',
  ARROW_DOWN: 'arrowdown'
} as const