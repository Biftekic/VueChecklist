/**
 * Database Validation Service
 * Integrates Zod schemas with database operations for data integrity
 */

import { 
  validateChecklist, 
  validateCreateChecklist, 
  validateUpdateChecklist,
  safeValidateChecklist,
  type Checklist,
  type CreateChecklistDTO,
  type UpdateChecklistDTO
} from '@/schemas/checklist.schema'

import {
  validateClient,
  safeValidateClient,
  type ClientInfo
} from '@/schemas/client.schema'

import { dbOperations } from './index'
import { logger } from '@/services/logger'

// Type definitions
type Client = ClientInfo

// Simple error handling helper
function useErrorHandling(options: { component: string; retryable: boolean }) {
  return {
    handleError: (error: Error) => {
      logger.error(`[${options.component}] Error:`, error)
      if (options.retryable) {
        logger.info(`[${options.component}] Error is retryable`)
      }
    },
    handleValidationError: (message: string, field?: string, value?: any) => {
      logger.error(`[${options.component}] Validation Error:`, { message, field, value })
    }
  }
}

import {
  validateTask,
  safeValidateTask,
  type Task
} from '@/schemas/task.schema'

import {
  validateRoom,
  safeValidateRoom,
  type Room
} from '@/schemas/room.schema'

import { databaseService } from '@/services/database'

class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any,
    public errors?: any[]
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validated database operations wrapper
 */
export class ValidatedDBOperations {
  private errorHandler = useErrorHandling({
    component: 'DatabaseValidation',
    retryable: false
  })

  /**
   * Create a new checklist with validation
   */
  async createChecklist(data: unknown): Promise<string | null> {
    try {
      // Validate input data
      const validatedData = validateCreateChecklist(data)
      
      // Generate ID and timestamps
      const checklist: Checklist = {
        ...validatedData,
        id: crypto.randomUUID(),
        tasks: [],
        status: 'draft',
        totalTime: { min: 0, max: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        modifiers: {
          difficulty: validatedData.modifiers?.difficulty || 'average',
          expectations: validatedData.modifiers?.expectations || 'average',
          challenges: validatedData.modifiers?.challenges || 'average'
        },
        version: 1
      }
      
      // Validate complete checklist
      const finalChecklist = validateChecklist(checklist)
      
      // Save to database
      const { id: _, ...checklistWithoutId } = finalChecklist
      return await dbOperations.createChecklist(checklistWithoutId)
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        this.handleValidationError(error as any)
      }
      throw error
    }
  }

  /**
   * Update a checklist with validation
   */
  async updateChecklist(id: string, updates: unknown): Promise<boolean> {
    try {
      // Validate update data
      const validatedUpdates = validateUpdateChecklist(updates)
      
      // Get existing checklist
      const existing = await dbOperations.getChecklistById(id)
      if (!existing) {
        throw new Error(`Checklist ${id} not found`)
      }
      
      // Merge updates
      const updated = {
        ...existing,
        ...validatedUpdates,
        updatedAt: new Date()
      }
      
      // Validate complete checklist
      const finalChecklist = validateChecklist(updated)
      
      // Save to database
      return (await dbOperations.updateChecklist(id, finalChecklist as any)) ? true : false
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        this.handleValidationError(error as any)
      }
      throw error
    }
  }

  /**
   * Batch validate checklists
   */
  async validateBatch(checklists: unknown[]): Promise<{
    valid: Checklist[]
    invalid: Array<{ data: unknown; errors: any[] }>
  }> {
    const valid: Checklist[] = []
    const invalid: Array<{ data: unknown; errors: any[] }> = []
    
    for (const checklist of checklists) {
      const result = safeValidateChecklist(checklist)
      if (result.success) {
        valid.push(result.data)
      } else {
        invalid.push({
          data: checklist,
          errors: (result.error as any).errors || []
        })
      }
    }
    
    return { valid, invalid }
  }

  /**
   * Validate and update task
   */
  async updateTask(
    checklistId: string, 
    taskId: string, 
    updates: unknown
  ): Promise<boolean> {
    try {
      const checklist = await dbOperations.getChecklistById(checklistId)
      if (!checklist) {
        throw new Error(`Checklist ${checklistId} not found`)
      }
      
      const taskIndex = checklist.tasks.findIndex((t: any) => t.id === taskId)
      if (taskIndex === -1) {
        throw new Error(`Task ${taskId} not found`)
      }
      
      // Merge and validate task
      const updatedTask = {
        ...checklist.tasks[taskIndex],
        ...(typeof updates === 'object' && updates !== null ? updates : {})
      }
      const validatedTask = validateTask(updatedTask)
      
      // Update in checklist
      checklist.tasks[taskIndex] = validatedTask
      checklist.updatedAt = new Date()
      
      // Validate entire checklist
      const validatedChecklist = validateChecklist(checklist)
      
      // Save to database
      return (await dbOperations.updateChecklist(checklistId, validatedChecklist as any)) ? true : false
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        this.handleValidationError(error as any)
      }
      throw error
    }
  }

  /**
   * Validate client data
   */
  validateClientData(data: unknown): Client {
    try {
      return validateClient(data)
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        this.handleValidationError(error as any)
      }
      throw error
    }
  }

  /**
   * Validate room data
   */
  validateRoomData(data: unknown): Room {
    try {
      return validateRoom(data)
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        this.handleValidationError(error as any)
      }
      throw error
    }
  }

  /**
   * Handle Zod validation errors
   */
  private handleValidationError(error: any): never {
    const issues = error.errors || []
    const firstIssue = issues[0]
    
    const validationError = new ValidationError(
      `Validation failed: ${firstIssue?.message || 'Invalid data'}`,
      firstIssue?.path?.join('.'),
      firstIssue?.received,
      issues
    )
    
    this.errorHandler.handleValidationError(
      validationError.message,
      validationError.field,
      validationError.value
    )
    
    throw validationError
  }

  /**
   * Sanitize user input before validation
   */
  sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      // Trim whitespace
      data = data.trim()
      
      // Remove null bytes
      data = data.replace(/\0/g, '')
      
      // Limit length for safety
      if (data.length > 10000) {
        data = data.substring(0, 10000)
      }
    } else if (Array.isArray(data)) {
      // Recursively sanitize array items
      data = data.map(item => this.sanitizeInput(item))
    } else if (data && typeof data === 'object') {
      // Recursively sanitize object properties
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        // Skip prototype pollution attempts
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue
        }
        sanitized[key] = this.sanitizeInput(value)
      }
      data = sanitized
    }
    
    return data
  }

  /**
   * Validate data against a specific schema
   */
  validate<T>(schema: any, data: unknown): T {
    const sanitized = this.sanitizeInput(data)
    return schema.parse(sanitized)
  }

  /**
   * Safe validate with error details
   */
  safeValidate<T>(schema: any, data: unknown): {
    success: boolean
    data?: T
    error?: ValidationError
  } {
    const sanitized = this.sanitizeInput(data)
    const result = schema.safeParse(sanitized)
    
    if (result.success) {
      return { success: true, data: result.data }
    } else {
      const firstIssue = result.error.errors[0]
      return {
        success: false,
        error: new ValidationError(
          `Validation failed: ${firstIssue?.message || 'Invalid data'}`,
          firstIssue?.path?.join('.'),
          sanitized,
          result.error.errors
        )
      }
    }
  }
}

// Export singleton instance
export const validatedDB = new ValidatedDBOperations()

// Export validation utilities
export { ValidationError }
export type { Checklist, CreateChecklistDTO, UpdateChecklistDTO, Client, Task, Room }