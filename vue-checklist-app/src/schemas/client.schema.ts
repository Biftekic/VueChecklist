import { z } from 'zod'

// Contact person schema
export const ContactPersonSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  role: z.string(),
  phone: z.string(),
  email: z.string().email(),
  isPrimary: z.boolean()
})

// Billing info schema
export const BillingInfoSchema = z.object({
  method: z.enum([
    'cash',
    'check',
    'credit_card',
    'bank_transfer',
    'online',
    'invoice'
  ]),
  rate: z.number().positive(),
  currency: z.string().default('USD'),
  billingCycle: z.enum([
    'per_service',
    'weekly',
    'monthly',
    'quarterly',
    'annually'
  ]).optional(),
  invoiceEmail: z.string().email().optional(),
  taxId: z.string().optional()
})

// Main client schema
export const ClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Client name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(
    /^\+?[\d\s\-()]+$/,
    "Please enter a valid phone number"
  ),
  email: z.string().email("Please enter a valid email address"),
  frequency: z.enum([
    'once',
    'daily',
    'weekly',
    'biweekly',
    'monthly',
    'quarterly',
    'as_needed'
  ]),
  preferredDay: z.enum([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ]).optional(),
  preferredTime: z.enum([
    'morning',
    'afternoon',
    'evening',
    'night',
    'flexible'
  ]).optional(),
  specialInstructions: z.string().optional(),
  contractType: z.enum([
    'one_time',
    'recurring',
    'seasonal',
    'project'
  ]).optional(),
  billingInfo: BillingInfoSchema.optional(),
  contacts: z.array(ContactPersonSchema).optional(),
  tags: z.array(z.string()).optional(),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Create client DTO schema
export const CreateClientDTOSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/),
  email: z.string().email(),
  frequency: z.enum([
    'once',
    'daily',
    'weekly',
    'biweekly',
    'monthly',
    'quarterly',
    'as_needed'
  ]),
  preferredDay: z.enum([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ]).optional(),
  preferredTime: z.enum([
    'morning',
    'afternoon',
    'evening',
    'night',
    'flexible'
  ]).optional(),
  specialInstructions: z.string().optional()
})

// Update client DTO schema
export const UpdateClientDTOSchema = CreateClientDTOSchema.partial().extend({
  active: z.boolean().optional()
})

// Type exports
export type ClientInfo = z.infer<typeof ClientSchema>
export type ContactPerson = z.infer<typeof ContactPersonSchema>
export type BillingInfo = z.infer<typeof BillingInfoSchema>
export type CreateClientDTO = z.infer<typeof CreateClientDTOSchema>
export type UpdateClientDTO = z.infer<typeof UpdateClientDTOSchema>

// Validation helper functions
export function validateClient(data: unknown): ClientInfo {
  return ClientSchema.parse(data)
}

export function validateCreateClient(data: unknown): CreateClientDTO {
  return CreateClientDTOSchema.parse(data)
}

export function validateUpdateClient(data: unknown): UpdateClientDTO {
  return UpdateClientDTOSchema.parse(data)
}

// Safe validation
export function safeValidateClient(data: unknown) {
  return ClientSchema.safeParse(data)
}

export function safeValidateCreateClient(data: unknown) {
  return CreateClientDTOSchema.safeParse(data)
}

export function safeValidateUpdateClient(data: unknown) {
  return UpdateClientDTOSchema.safeParse(data)
}