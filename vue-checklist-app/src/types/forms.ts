/**
 * Form-related types for the application
 */

export interface ChecklistFormData {
  propertyName: string
  address: string
  propertyType: PropertyType
  cleaningType: CleaningType
  date: string
  time: string
  notes: string
  priority?: 'low' | 'medium' | 'high'
  estimatedDuration?: number
}

export type PropertyType = 
  | 'House'
  | 'Apartment'
  | 'Condo'
  | 'Villa'
  | 'Office'
  | 'Commercial Space'

export type CleaningType = 
  | 'Standard Cleaning'
  | 'Deep Cleaning'
  | 'Move-in/Move-out'
  | 'Post-Construction'
  | 'Regular Maintenance'

export interface FormValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'select' | 'date' | 'time' | 'textarea' | 'number'
  rules?: FormValidationRules
  placeholder?: string
  icon?: string
  options?: readonly string[] | readonly { text: string; value: any }[]
}