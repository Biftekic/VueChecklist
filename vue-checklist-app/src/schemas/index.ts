// Re-export all schemas for convenient importing
export * from './checklist.schema'
export * from './client.schema'
export * from './task.schema'
export * from './room.schema'

import { z } from 'zod'

// Common validation schemas
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export const FilterOptionsSchema = z.object({
  search: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  status: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

// API response schemas
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional()
})

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: ApiErrorSchema.optional(),
  meta: z.object({
    timestamp: z.date(),
    version: z.string()
  }).optional()
})

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  })

// Type exports
export type Pagination = z.infer<typeof PaginationSchema>
export type FilterOptions = z.infer<typeof FilterOptionsSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: ApiError
  meta?: {
    timestamp: Date
    version: string
  }
}

// Validation utilities
export function createApiResponse<T>(data?: T, error?: ApiError): ApiResponse<T> {
  if (error) {
    return {
      success: false,
      error,
      meta: {
        timestamp: new Date(),
        version: '1.0.0'
      }
    }
  }
  
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date(),
      version: '1.0.0'
    }
  }
}

export function handleValidationError(error: z.ZodError): ApiError {
  const issues = error.issues.map(e => ({
    path: e.path.join('.'),
    message: e.message
  }))
  
  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: issues
  }
}