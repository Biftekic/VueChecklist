import { z } from 'zod'

// Template Schema
export const templateSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, 'Template name is required')
    .max(100, 'Template name too long'),
  
  category: z.enum([
    'Residential',
    'Commercial',
    'Deep Clean',
    'Special',
    'Maintenance',
    'Custom'
  ]),
  
  description: z.string()
    .max(500, 'Description too long')
    .optional(),
  
  icon: z.string()
    .min(1, 'Icon is required'),
  
  color: z.enum([
    'primary',
    'blue',
    'green',
    'orange',
    'red',
    'purple',
    'cyan',
    'yellow-darken-3',
    'teal',
    'indigo'
  ]),
  
  rooms: z.number()
    .min(1, 'Must have at least 1 room')
    .max(50, 'Too many rooms'),
  
  estimatedTime: z.number()
    .min(5, 'Estimated time must be at least 5 minutes')
    .max(480, 'Estimated time too long'),
  
  tasksByRoom: z.record(
    z.string(),
    z.array(z.string().min(1, 'Task cannot be empty'))
  ).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one room with tasks is required' }
  )
})

// Create Template Schema
export const createTemplateSchema = templateSchema.omit({ id: true })

// Edit Template Schema
export const editTemplateSchema = templateSchema

// Type exports
export type Template = z.infer<typeof templateSchema>
export type CreateTemplate = z.infer<typeof createTemplateSchema>
export type EditTemplate = z.infer<typeof editTemplateSchema>