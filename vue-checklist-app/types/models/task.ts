export interface Task {
  id: string
  name: string
  description?: string
  category: TaskCategory
  room?: string
  roomId?: string
  timeEstimate: TaskTimeEstimate
  priority: TaskPriority
  frequency?: TaskFrequency
  completed: boolean
  completedBy?: string
  completedAt?: Date
  notes?: string
  customTask?: boolean
  supplies?: string[]
  techniques?: string[]
  tags?: string[]
  order?: number
  dependencies?: string[] // Task IDs that must be completed first
  qualityChecks?: QualityCheck[]
}

export interface TaskTimeEstimate {
  min: number
  max: number
  unit?: TimeUnit
}

export interface QualityCheck {
  id: string
  description: string
  passed: boolean
  checkedBy?: string
  checkedAt?: Date
  notes?: string
}

export type TaskCategory = 
  | 'cleaning'
  | 'organizing'
  | 'inspection'
  | 'maintenance'
  | 'setup'
  | 'teardown'
  | 'safety'
  | 'documentation'
  | 'other'

export type TaskPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'

export type TaskFrequency = 
  | 'once'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'as_needed'

export type TimeUnit = 
  | 'minutes'
  | 'hours'

// Task templates for reusable tasks
export interface TaskTemplate {
  id: string
  name: string
  description: string
  category: TaskCategory
  defaultTimeEstimate: TaskTimeEstimate
  defaultPriority: TaskPriority
  supplies: string[]
  techniques: string[]
  tags: string[]
  industry?: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
}

// Task creation/update DTOs
export interface CreateTaskDTO {
  name: string
  description?: string
  category: TaskCategory
  roomId?: string
  timeEstimate: TaskTimeEstimate
  priority?: TaskPriority
  frequency?: TaskFrequency
  supplies?: string[]
  techniques?: string[]
}

export interface UpdateTaskDTO {
  name?: string
  description?: string
  priority?: TaskPriority
  completed?: boolean
  notes?: string
  order?: number
}