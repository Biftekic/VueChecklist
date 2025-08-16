import type { Task } from './task'

export interface Room {
  id: string
  name: string
  type: RoomType
  size?: RoomSize
  floor?: number
  tasks: Task[]
  customTasks?: Task[]
  notes?: string
  priority?: number
  accessibility?: AccessibilityLevel
  features?: RoomFeature[]
  cleaningTime?: {
    estimated: number
    actual?: number
  }
  lastCleaned?: Date
  status?: RoomStatus
}

export type RoomType = 
  | 'bedroom'
  | 'bathroom'
  | 'kitchen'
  | 'living_room'
  | 'dining_room'
  | 'office'
  | 'hallway'
  | 'staircase'
  | 'basement'
  | 'attic'
  | 'garage'
  | 'laundry'
  | 'storage'
  | 'balcony'
  | 'outdoor'
  | 'other'

export type RoomSize = 
  | 'small'
  | 'medium'
  | 'large'
  | 'extra_large'

export type AccessibilityLevel = 
  | 'easy'
  | 'moderate'
  | 'difficult'
  | 'restricted'

export type RoomStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'needs_attention'

export interface RoomFeature {
  name: string
  requiresSpecialCare: boolean
  notes?: string
}

// Common room features
export const COMMON_ROOM_FEATURES: Record<RoomType, string[]> = {
  bedroom: ['bed', 'closet', 'dresser', 'nightstand', 'desk', 'mirror'],
  bathroom: ['toilet', 'sink', 'shower', 'bathtub', 'mirror', 'cabinet'],
  kitchen: ['stove', 'oven', 'refrigerator', 'dishwasher', 'microwave', 'sink', 'countertop'],
  living_room: ['sofa', 'tv', 'coffee_table', 'bookshelf', 'fireplace'],
  dining_room: ['table', 'chairs', 'cabinet', 'chandelier'],
  office: ['desk', 'chair', 'computer', 'bookshelf', 'filing_cabinet'],
  hallway: ['coat_rack', 'shoe_storage', 'mirror'],
  staircase: ['handrail', 'carpet', 'landing'],
  basement: ['storage', 'utilities', 'workshop'],
  attic: ['storage', 'insulation', 'ventilation'],
  garage: ['parking', 'storage', 'workbench', 'tools'],
  laundry: ['washer', 'dryer', 'sink', 'storage'],
  storage: ['shelving', 'boxes', 'seasonal_items'],
  balcony: ['furniture', 'plants', 'railing'],
  outdoor: ['patio', 'garden', 'lawn', 'driveway'],
  other: []
}

// Room template for quick setup
export interface RoomTemplate {
  id: string
  name: string
  type: RoomType
  defaultTasks: string[] // Task template IDs
  estimatedTime: number
  industry?: string
}

// Room creation/update DTOs
export interface CreateRoomDTO {
  name: string
  type: RoomType
  size?: RoomSize
  floor?: number
  features?: RoomFeature[]
}

export interface UpdateRoomDTO {
  name?: string
  size?: RoomSize
  notes?: string
  priority?: number
  status?: RoomStatus
}