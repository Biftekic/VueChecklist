export interface ClientInfo {
  id?: string
  name: string
  address: string
  phone: string
  email: string
  frequency: CleaningFrequency
  preferredDay?: DayOfWeek
  preferredTime?: TimeSlot
  specialInstructions?: string
  contractType?: ContractType
  billingInfo?: BillingInfo
  contacts?: ContactPerson[]
  tags?: string[]
  active?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface ContactPerson {
  id: string
  name: string
  role: string
  phone: string
  email: string
  isPrimary: boolean
}

export interface BillingInfo {
  method: PaymentMethod
  rate: number
  currency?: string
  billingCycle?: BillingCycle
  invoiceEmail?: string
  taxId?: string
}

export type CleaningFrequency = 
  | 'once'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'as_needed'

export type DayOfWeek = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type TimeSlot = 
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'flexible'

export type ContractType = 
  | 'one_time'
  | 'recurring'
  | 'seasonal'
  | 'project'

export type PaymentMethod = 
  | 'cash'
  | 'check'
  | 'credit_card'
  | 'bank_transfer'
  | 'online'
  | 'invoice'

export type BillingCycle = 
  | 'per_service'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'

// Client creation/update DTOs
export interface CreateClientDTO {
  name: string
  address: string
  phone: string
  email: string
  frequency: CleaningFrequency
  preferredDay?: DayOfWeek
  preferredTime?: TimeSlot
  specialInstructions?: string
}

export interface UpdateClientDTO {
  name?: string
  address?: string
  phone?: string
  email?: string
  frequency?: CleaningFrequency
  preferredDay?: DayOfWeek
  preferredTime?: TimeSlot
  specialInstructions?: string
  active?: boolean
}