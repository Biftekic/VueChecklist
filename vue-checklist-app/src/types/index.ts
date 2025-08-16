// Core type definitions for Vue Checklist Application

export type CleaningFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'

export type PropertyType = 'apartment' | 'house' | 'condo' | 'office' | 'commercial'

export type RoomType = 
  | 'kitchen' 
  | 'bathroom' 
  | 'bedroom' 
  | 'living_room' 
  | 'dining_room' 
  | 'office' 
  | 'garage' 
  | 'basement' 
  | 'attic'
  | 'laundry_room'
  | 'hallway'
  | 'other'

export interface ClientInfo {
  name: string
  address: string
  phone: string
  email: string
  frequency: CleaningFrequency
  specialInstructions?: string
}

export interface PropertyDetails {
  type: PropertyType
  size: number // in square feet
  bedrooms: number
  bathrooms: number
  hasGarage: boolean
  hasBasement: boolean
  hasAttic: boolean
  floors: number
  specialFeatures?: string[]
}

export interface Task {
  id: string
  name: string
  description?: string
  category: string
  roomType?: RoomType
  priority: TaskPriority
  status: TaskStatus
  estimatedTime?: number // in minutes
  actualTime?: number // in minutes
  notes?: string
  supplies?: string[]
  completed: boolean
  completedAt?: Date
  completedBy?: string
  order?: number
  subtasks?: Subtask[]
  frequency?: CleaningFrequency
  customizable: boolean
  required: boolean
}

export interface Subtask {
  id: string
  name: string
  completed: boolean
  completedAt?: Date
}

export interface Room {
  id: string
  name: string
  type: RoomType
  tasks: Task[]
  customTasks?: Task[]
  notes?: string
  order?: number
  isCustom?: boolean
}

export interface ChecklistTemplate {
  id: string
  name: string
  description?: string
  category: string
  propertyType: PropertyType
  frequency: CleaningFrequency
  tasks: Task[]
  rooms: Room[]
  defaultDuration?: number // in minutes
  tags?: string[]
  isDefault?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Checklist {
  id: string
  templateId: string | null
  name: string
  client: ClientInfo
  property: PropertyDetails
  rooms: Room[]
  tasks: Task[]
  startTime?: Date
  endTime?: Date
  totalDuration?: number // in minutes
  status: 'draft' | 'active' | 'completed' | 'archived'
  completionPercentage: number
  notes?: string
  attachments?: Attachment[]
  signature?: string
  signedAt?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  version?: number
  tags?: string[]
  customFields?: Record<string, any>
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export interface QualityAssessment {
  id: string
  checklistId: string
  rating: number // 1-5
  feedback?: string
  issues?: QualityIssue[]
  inspector?: string
  inspectedAt: Date
}

export interface QualityIssue {
  id: string
  category: string
  description: string
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
  images?: string[]
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minQuantity: number
  maxQuantity?: number
  supplier?: string
  cost?: number
  lastRestocked?: Date
  notes?: string
}

export interface Team {
  id: string
  name: string
  description?: string
  members: TeamMember[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  id: string
  name: string
  email: string
  phone?: string
  role: 'manager' | 'supervisor' | 'cleaner' | 'inspector'
  permissions: string[]
  avatar?: string
  active: boolean
  joinedAt: Date
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  read: boolean
  createdAt: Date
  expiresAt?: Date
  action?: {
    label: string
    url?: string
    callback?: () => void
  }
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  currency: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  autoSave: boolean
  autoSaveInterval: number // in seconds
  offlineMode: boolean
  dataSync: boolean
  privacyMode: boolean
}

export interface Analytics {
  totalChecklists: number
  completedChecklists: number
  averageCompletionTime: number
  averageCompletionRate: number
  taskCompletionRate: number
  mostUsedTemplate?: string
  peakHours?: number[]
  commonIssues?: string[]
  customerSatisfaction?: number
}

// Store State Types
export interface ChecklistsState {
  byId: Record<string, Checklist>
  allIds: string[]
  active: string | null
  loading: boolean
  error: Error | null
  filter: {
    status?: Checklist['status']
    clientName?: string
    dateRange?: {
      start: Date
      end: Date
    }
  }
  sort: {
    field: keyof Checklist
    order: 'asc' | 'desc'
  }
}

export interface TemplatesState {
  byId: Record<string, ChecklistTemplate>
  allIds: string[]
  loading: boolean
  error: Error | null
  categories: string[]
  selected: string | null
}

export interface InventoryState {
  items: InventoryItem[]
  categories: string[]
  loading: boolean
  error: Error | null
  lowStockItems: string[]
}

export interface TeamState {
  teams: Team[]
  currentTeam: string | null
  members: TeamMember[]
  loading: boolean
  error: Error | null
}

export interface NotificationsState {
  items: Notification[]
  unreadCount: number
  loading: boolean
  error: Error | null
}

export interface AppState {
  settings: Settings
  analytics: Analytics
  isOnline: boolean
  isSyncing: boolean
  lastSync: Date | null
  version: string
  user?: {
    id: string
    name: string
    email: string
    role: string
    permissions: string[]
  }
}