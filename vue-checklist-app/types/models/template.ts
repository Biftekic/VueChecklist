import type { TaskTemplate } from './task'
import type { RoomTemplate } from './room'
import type { PropertyType } from './checklist'

export interface Template {
  id: string
  name: string
  description: string
  industry: Industry
  propertyType: PropertyType
  estimatedTime: {
    min: number
    max: number
  }
  basePrice?: number
  currency?: string
  rooms: RoomTemplate[]
  tasks: TaskTemplate[]
  supplies: SupplyItem[]
  equipment: EquipmentItem[]
  tags: string[]
  active: boolean
  featured?: boolean
  usageCount: number
  rating?: number
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  version: number
}

export interface SupplyItem {
  id: string
  name: string
  category: SupplyCategory
  unit: string
  estimatedQuantity: number
  costPerUnit?: number
  preferred?: boolean
  alternatives?: string[]
}

export interface EquipmentItem {
  id: string
  name: string
  category: EquipmentCategory
  required: boolean
  alternatives?: string[]
  maintenanceSchedule?: string
}

export type Industry = 
  | 'residential'
  | 'commercial'
  | 'office'
  | 'retail'
  | 'hospitality'
  | 'healthcare'
  | 'education'
  | 'industrial'
  | 'post_construction'
  | 'move_in_out'
  | 'airbnb'
  | 'restaurant'
  | 'medical'
  | 'lawn_care'
  | 'other'

export type SupplyCategory = 
  | 'cleaning_solutions'
  | 'disinfectants'
  | 'tools'
  | 'protective_gear'
  | 'paper_products'
  | 'trash_bags'
  | 'specialty'
  | 'other'

export type EquipmentCategory = 
  | 'vacuum'
  | 'mop_bucket'
  | 'cleaning_cart'
  | 'ladder'
  | 'power_tools'
  | 'safety'
  | 'specialty'
  | 'other'

// Template creation/update DTOs
export interface CreateTemplateDTO {
  name: string
  description: string
  industry: Industry
  propertyType: PropertyType
  rooms: RoomTemplate[]
  tasks: TaskTemplate[]
  supplies?: SupplyItem[]
  equipment?: EquipmentItem[]
  tags?: string[]
}

export interface UpdateTemplateDTO {
  name?: string
  description?: string
  active?: boolean
  featured?: boolean
  tags?: string[]
}

// Template search/filter
export interface TemplateFilter {
  industry?: Industry
  propertyType?: PropertyType
  minTime?: number
  maxTime?: number
  featured?: boolean
  active?: boolean
  tags?: string[]
  searchQuery?: string
}