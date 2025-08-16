import { z } from 'zod'
import { TaskSchema } from './task.schema'

// Room feature schema
export const RoomFeatureSchema = z.object({
  name: z.string(),
  requiresSpecialCare: z.boolean(),
  notes: z.string().optional()
})

// Room cleaning time schema
export const RoomCleaningTimeSchema = z.object({
  estimated: z.number().min(0),
  actual: z.number().min(0).optional()
})

// Main room schema
export const RoomSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Room name is required"),
  type: z.enum([
    'bedroom',
    'bathroom',
    'kitchen',
    'living_room',
    'dining_room',
    'office',
    'hallway',
    'staircase',
    'basement',
    'attic',
    'garage',
    'laundry',
    'storage',
    'balcony',
    'outdoor',
    'other'
  ]),
  size: z.enum(['small', 'medium', 'large', 'extra_large']).optional(),
  floor: z.number().optional(),
  tasks: z.array(TaskSchema),
  customTasks: z.array(TaskSchema).optional(),
  notes: z.string().optional(),
  priority: z.number().optional(),
  accessibility: z.enum(['easy', 'moderate', 'difficult', 'restricted']).optional(),
  features: z.array(RoomFeatureSchema).optional(),
  cleaningTime: RoomCleaningTimeSchema.optional(),
  lastCleaned: z.date().optional(),
  status: z.enum([
    'not_started',
    'in_progress',
    'completed',
    'skipped',
    'needs_attention'
  ]).optional()
})

// Room template schema
export const RoomTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum([
    'bedroom',
    'bathroom',
    'kitchen',
    'living_room',
    'dining_room',
    'office',
    'hallway',
    'staircase',
    'basement',
    'attic',
    'garage',
    'laundry',
    'storage',
    'balcony',
    'outdoor',
    'other'
  ]),
  defaultTasks: z.array(z.string()), // Task template IDs
  estimatedTime: z.number().min(0),
  industry: z.string().optional()
})

// Create room DTO schema
export const CreateRoomDTOSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    'bedroom',
    'bathroom',
    'kitchen',
    'living_room',
    'dining_room',
    'office',
    'hallway',
    'staircase',
    'basement',
    'attic',
    'garage',
    'laundry',
    'storage',
    'balcony',
    'outdoor',
    'other'
  ]),
  size: z.enum(['small', 'medium', 'large', 'extra_large']).optional(),
  floor: z.number().optional(),
  features: z.array(RoomFeatureSchema).optional()
})

// Update room DTO schema
export const UpdateRoomDTOSchema = z.object({
  name: z.string().min(1).optional(),
  size: z.enum(['small', 'medium', 'large', 'extra_large']).optional(),
  notes: z.string().optional(),
  priority: z.number().optional(),
  status: z.enum([
    'not_started',
    'in_progress',
    'completed',
    'skipped',
    'needs_attention'
  ]).optional()
})

// Type exports
export type Room = z.infer<typeof RoomSchema>
export type RoomTemplate = z.infer<typeof RoomTemplateSchema>
export type RoomFeature = z.infer<typeof RoomFeatureSchema>
export type RoomCleaningTime = z.infer<typeof RoomCleaningTimeSchema>
export type CreateRoomDTO = z.infer<typeof CreateRoomDTOSchema>
export type UpdateRoomDTO = z.infer<typeof UpdateRoomDTOSchema>

// Validation helper functions
export function validateRoom(data: unknown): Room {
  return RoomSchema.parse(data)
}

export function validateRoomTemplate(data: unknown): RoomTemplate {
  return RoomTemplateSchema.parse(data)
}

export function validateCreateRoom(data: unknown): CreateRoomDTO {
  return CreateRoomDTOSchema.parse(data)
}

export function validateUpdateRoom(data: unknown): UpdateRoomDTO {
  return UpdateRoomDTOSchema.parse(data)
}

// Safe validation
export function safeValidateRoom(data: unknown) {
  return RoomSchema.safeParse(data)
}

export function safeValidateRoomTemplate(data: unknown) {
  return RoomTemplateSchema.safeParse(data)
}

export function safeValidateCreateRoom(data: unknown) {
  return CreateRoomDTOSchema.safeParse(data)
}

export function safeValidateUpdateRoom(data: unknown) {
  return UpdateRoomDTOSchema.safeParse(data)
}