import { z } from 'zod'

// Client Info Schema
export const clientInfoSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number')
    .min(10, 'Phone number too short')
    .max(20, 'Phone number too long')
    .optional()
    .or(z.literal('')),
  address: z.string().max(200, 'Address too long').optional().or(z.literal('')),
  notes: z.string().max(500, 'Notes too long').optional().or(z.literal('')),
  frequency: z.string().optional()
})

// Task Schema
export const taskSchema = z.object({
  id: z.string(),
  roomId: z.string().optional(),
  name: z.string().min(1, 'Task name is required').max(200, 'Task name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  estimatedTime: z.number().min(1, 'Time must be at least 1 minute').max(480, 'Time too long').optional(),
  adjustedTime: z.number().min(1).max(480).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  completed: z.boolean().default(false),
  category: z.string().optional(),
  subtasks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    completed: z.boolean()
  })).optional(),
  supplies: z.array(z.string()).optional(),
  standards: z.object({
    description: z.string().optional(),
    checkItems: z.array(z.string()).optional(),
    standards: z.array(z.string()).optional()
  }).optional()
})

// Room Schema
export const roomSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Room name is required').max(100, 'Room name too long'),
  category: z.string().optional(),
  floor: z.number().optional(),
  selected: z.boolean().optional()
})

// Checklist Schema
export const checklistSchema = z.object({
  name: z.string()
    .min(1, 'Checklist name is required')
    .max(100, 'Checklist name too long')
    .nullable()
    .transform(val => val || null),
  
  industry: z.string()
    .min(1, 'Industry is required')
    .max(50, 'Industry name too long')
    .nullable(),
  
  propertySize: z.number()
    .min(100, 'Property size must be at least 100 sq ft')
    .max(100000, 'Property size too large')
    .nullable(),
  
  numberOfFloors: z.number()
    .min(1, 'Must have at least 1 floor')
    .max(100, 'Too many floors')
    .nullable(),
  
  difficulty: z.enum(['Light', 'Average', 'Heavy']),
  
  expectations: z.enum(['Very Reasonable', 'Reasonable', 'Demanding', 'Very Demanding']),
  
  challenges: z.enum(['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard']),
  
  selectedRooms: z.array(roomSchema).default([]),
  
  selectedTasks: z.array(taskSchema).default([]),
  
  clientInfo: clientInfoSchema.nullable(),
  
  frequency: z.string().optional(),
  
  estimatedDuration: z.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(960, 'Duration too long')
    .optional()
})

// Create Checklist Form Schema (for initial creation)
export const createChecklistSchema = checklistSchema.extend({
  name: z.string().min(1, 'Checklist name is required').max(100, 'Checklist name too long'),
  industry: z.string().min(1, 'Industry is required').max(50, 'Industry name too long'),
  propertySize: z.number().min(100, 'Property size must be at least 100 sq ft').max(100000, 'Property size too large'),
  numberOfFloors: z.number().min(1, 'Must have at least 1 floor').max(100, 'Too many floors')
})

// Edit Checklist Form Schema (for editing existing checklists)
export const editChecklistSchema = checklistSchema.partial()

// Type exports
export type ClientInfo = z.infer<typeof clientInfoSchema>
export type Task = z.infer<typeof taskSchema>
export type Room = z.infer<typeof roomSchema>
export type Checklist = z.infer<typeof checklistSchema>
export type CreateChecklist = z.infer<typeof createChecklistSchema>
export type EditChecklist = z.infer<typeof editChecklistSchema>