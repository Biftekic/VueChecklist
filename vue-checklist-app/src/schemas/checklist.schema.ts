import { z } from 'zod'
import { ClientSchema } from './client.schema'
import { TaskSchema } from './task.schema'
import { RoomSchema } from './room.schema'

// Time range schema
export const TimeRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0)
}).refine(data => data.max >= data.min, {
  message: "Maximum time must be greater than or equal to minimum time"
})

// Property details schema
export const PropertyDetailsSchema = z.object({
  size: z.union([z.string(), z.number()]),
  floors: z.union([z.string(), z.number()]),
  rooms: z.union([z.string(), z.number()]),
  type: z.enum([
    'apartment',
    'house',
    'office',
    'commercial',
    'industrial',
    'retail',
    'other'
  ]).optional(),
  features: z.array(z.string()).optional()
})

// Checklist modifiers schema
export const ChecklistModifiersSchema = z.object({
  difficulty: z.enum(['easy', 'average', 'difficult', 'very_difficult']),
  expectations: z.enum(['low', 'average', 'high', 'very_high']),
  challenges: z.enum(['none', 'average', 'challenging', 'very_challenging'])
})

// Main checklist schema
export const ChecklistSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().nullable(),
  name: z.string().min(1, "Checklist name is required").max(255),
  client: ClientSchema,
  tasks: z.array(TaskSchema),
  rooms: z.array(RoomSchema),
  status: z.enum([
    'draft',
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'paused'
  ]),
  propertyDetails: PropertyDetailsSchema,
  modifiers: ChecklistModifiersSchema,
  totalTime: TimeRangeSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
  completedBy: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  version: z.number().optional()
})

// Create checklist DTO schema
export const CreateChecklistDTOSchema = z.object({
  templateId: z.string().optional(),
  name: z.string().min(1).max(255),
  client: ClientSchema,
  propertyDetails: PropertyDetailsSchema,
  rooms: z.array(RoomSchema),
  modifiers: ChecklistModifiersSchema.partial().optional()
})

// Update checklist DTO schema
export const UpdateChecklistDTOSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  client: ClientSchema.partial().optional(),
  status: z.enum([
    'draft',
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'paused'
  ]).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional()
})

// Type exports
export type Checklist = z.infer<typeof ChecklistSchema>
export type CreateChecklistDTO = z.infer<typeof CreateChecklistDTOSchema>
export type UpdateChecklistDTO = z.infer<typeof UpdateChecklistDTOSchema>
export type PropertyDetails = z.infer<typeof PropertyDetailsSchema>
export type ChecklistModifiers = z.infer<typeof ChecklistModifiersSchema>
export type TimeRange = z.infer<typeof TimeRangeSchema>

// Validation helper functions
export function validateChecklist(data: unknown): Checklist {
  return ChecklistSchema.parse(data)
}

export function validateCreateChecklist(data: unknown): CreateChecklistDTO {
  return CreateChecklistDTOSchema.parse(data)
}

export function validateUpdateChecklist(data: unknown): UpdateChecklistDTO {
  return UpdateChecklistDTOSchema.parse(data)
}

// Safe validation (returns result with success flag)
export function safeValidateChecklist(data: unknown) {
  return ChecklistSchema.safeParse(data)
}

export function safeValidateCreateChecklist(data: unknown) {
  return CreateChecklistDTOSchema.safeParse(data)
}

export function safeValidateUpdateChecklist(data: unknown) {
  return UpdateChecklistDTOSchema.safeParse(data)
}