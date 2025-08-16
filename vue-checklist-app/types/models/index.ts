// Re-export all model types for convenient importing
export * from './checklist'
export * from './task'
export * from './client'
export * from './room'
export * from './template'

// Additional shared types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: Date
    version: string
  }
}

export interface FilterOptions {
  search?: string
  dateFrom?: Date
  dateTo?: Date
  status?: string[]
  tags?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}