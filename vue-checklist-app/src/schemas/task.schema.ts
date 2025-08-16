import { z } from 'zod'

// Task time estimate schema
export const TaskTimeEstimateSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  unit: z.enum(['minutes', 'hours']).default('minutes')
}).refine(data => data.max >= data.min, {
  message: "Maximum time must be greater than or equal to minimum time"
})

// Quality check schema
export const QualityCheckSchema = z.object({
  id: z.string(),
  description: z.string(),
  passed: z.boolean(),
  checkedBy: z.string().optional(),
  checkedAt: z.date().optional(),
  notes: z.string().optional()
})

// Main task schema
export const TaskSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  category: z.enum([
    'cleaning',
    'organizing',
    'inspection',
    'maintenance',
    'setup',
    'teardown',
    'safety',
    'documentation',
    'other'
  ]),
  room: z.string().optional(),
  roomId: z.string().optional(),
  timeEstimate: TaskTimeEstimateSchema,
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  frequency: z.enum([
    'once',
    'daily',
    'weekly',
    'biweekly',
    'monthly',
    'quarterly',
    'annually',
    'as_needed'
  ]).optional(),
  completed: z.boolean().default(false),
  completedBy: z.string().optional(),
  completedAt: z.date().optional(),
  notes: z.string().optional(),
  customTask: z.boolean().optional(),
  supplies: z.array(z.string()).optional(),
  techniques: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  order: z.number().optional(),
  dependencies: z.array(z.string()).optional(),
  qualityChecks: z.array(QualityCheckSchema).optional()
})

// Task template schema
export const TaskTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  category: z.enum([
    'cleaning',
    'organizing',
    'inspection',
    'maintenance',
    'setup',
    'teardown',
    'safety',
    'documentation',
    'other'
  ]),
  defaultTimeEstimate: TaskTimeEstimateSchema,
  defaultPriority: z.enum(['low', 'medium', 'high', 'critical']),
  supplies: z.array(z.string()),
  techniques: z.array(z.string()),
  tags: z.array(z.string()),
  industry: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  usageCount: z.number().default(0)
})

// Create task DTO schema
export const CreateTaskDTOSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum([
    'cleaning',
    'organizing',
    'inspection',
    'maintenance',
    'setup',
    'teardown',
    'safety',
    'documentation',
    'other'
  ]),
  roomId: z.string().optional(),
  timeEstimate: TaskTimeEstimateSchema,
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  frequency: z.enum([
    'once',
    'daily',
    'weekly',
    'biweekly',
    'monthly',
    'quarterly',
    'annually',
    'as_needed'
  ]).optional(),
  supplies: z.array(z.string()).optional(),
  techniques: z.array(z.string()).optional()
})

// Update task DTO schema
export const UpdateTaskDTOSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  completed: z.boolean().optional(),
  notes: z.string().optional(),
  order: z.number().optional()
})

// Type exports
export type Task = z.infer<typeof TaskSchema>
export type TaskTemplate = z.infer<typeof TaskTemplateSchema>
export type TaskTimeEstimate = z.infer<typeof TaskTimeEstimateSchema>
export type QualityCheck = z.infer<typeof QualityCheckSchema>
export type CreateTaskDTO = z.infer<typeof CreateTaskDTOSchema>
export type UpdateTaskDTO = z.infer<typeof UpdateTaskDTOSchema>

// Validation helper functions
export function validateTask(data: unknown): Task {
  return TaskSchema.parse(data)
}

export function validateTaskTemplate(data: unknown): TaskTemplate {
  return TaskTemplateSchema.parse(data)
}

export function validateCreateTask(data: unknown): CreateTaskDTO {
  return CreateTaskDTOSchema.parse(data)
}

export function validateUpdateTask(data: unknown): UpdateTaskDTO {
  return UpdateTaskDTOSchema.parse(data)
}

// Safe validation
export function safeValidateTask(data: unknown) {
  return TaskSchema.safeParse(data)
}

export function safeValidateTaskTemplate(data: unknown) {
  return TaskTemplateSchema.safeParse(data)
}

export function safeValidateCreateTask(data: unknown) {
  return CreateTaskDTOSchema.safeParse(data)
}

export function safeValidateUpdateTask(data: unknown) {
  return UpdateTaskDTOSchema.safeParse(data)
}