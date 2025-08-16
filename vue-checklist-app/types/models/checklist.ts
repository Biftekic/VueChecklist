import type { ClientInfo } from './client'
import type { Task } from './task'
import type { Room } from './room'

export interface Checklist {
  id: string
  templateId: string | null
  name: string
  client: ClientInfo
  tasks: Task[]
  rooms: Room[]
  status: ChecklistStatus
  propertyDetails: PropertyDetails
  modifiers: ChecklistModifiers
  totalTime: TimeRange
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  completedBy?: string
  notes?: string
  tags?: string[]
  version?: number
}

export interface PropertyDetails {
  size: string | number
  floors: string | number
  rooms: string | number
  type?: PropertyType
  features?: string[]
}

export interface ChecklistModifiers {
  difficulty: DifficultyLevel
  expectations: ExpectationLevel
  challenges: ChallengeLevel
}

export interface TimeRange {
  min: number
  max: number
}

export type ChecklistStatus = 
  | 'draft'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'paused'

export type PropertyType = 
  | 'apartment'
  | 'house'
  | 'office'
  | 'commercial'
  | 'industrial'
  | 'retail'
  | 'other'

export type DifficultyLevel = 
  | 'easy'
  | 'average'
  | 'difficult'
  | 'very_difficult'

export type ExpectationLevel = 
  | 'low'
  | 'average'
  | 'high'
  | 'very_high'

export type ChallengeLevel = 
  | 'none'
  | 'average'
  | 'challenging'
  | 'very_challenging'

// Checklist creation/update DTOs
export interface CreateChecklistDTO {
  templateId?: string
  name: string
  client: ClientInfo
  propertyDetails: PropertyDetails
  rooms: Room[]
  modifiers?: Partial<ChecklistModifiers>
}

export interface UpdateChecklistDTO {
  name?: string
  client?: Partial<ClientInfo>
  status?: ChecklistStatus
  notes?: string
  tags?: string[]
}