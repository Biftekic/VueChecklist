// Task Template Service
export interface TaskTemplate {
  id: string
  name: string
  description: string
  category: TaskCategory
  type: 'basic' | 'advanced' | 'professional'
  estimatedTime: {
    min: number
    max: number
    unit: 'minutes' | 'hours'
  }
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'asNeeded'
  industry: Industry[]
  rooms: RoomType[]
  requiredSkills: Skill[]
  tools: ToolRequirement[]
  chemicals: ChemicalRequirement[]
  steps: TaskStep[]
  qualityChecks: QualityCheck[]
  safetyRequirements: SafetyRequirement[]
  variations: TaskVariation[]
  tags: string[]
  createdAt: string
  updatedAt: string
  isActive: boolean
  customFields?: CustomField[]
}

export interface TaskStep {
  id: string
  order: number
  instruction: string
  description?: string
  timeEstimate?: number
  tips?: string[]
  warnings?: string[]
  photos?: string[]
  videoUrl?: string
  requiredTools?: string[]
  requiredChemicals?: string[]
  qualityCheckpoint?: boolean
}

export interface QualityCheck {
  id: string
  name: string
  description: string
  type: 'visual' | 'measurement' | 'test'
  criteria: string
  passingStandard: string
  tools?: string[]
  frequency: 'always' | 'random' | 'weekly' | 'monthly'
}

export interface SafetyRequirement {
  id: string
  type: 'ppe' | 'procedure' | 'environmental' | 'chemical'
  description: string
  mandatory: boolean
  consequences?: string
}

export interface TaskVariation {
  id: string
  name: string
  description: string
  conditions: string[]
  stepModifications: StepModification[]
  timeMultiplier: number
}

export interface StepModification {
  stepId: string
  action: 'add' | 'remove' | 'modify' | 'replace'
  content?: string
  timeChange?: number
}

export interface ToolRequirement {
  id: string
  name: string
  type: 'essential' | 'preferred' | 'optional'
  category: string
  specifications?: string
  alternatives?: string[]
}

export interface ChemicalRequirement {
  id: string
  name: string
  type: 'essential' | 'preferred' | 'optional'
  category: string
  concentration?: string
  dilutionRatio?: string
  safetyLevel: 'low' | 'medium' | 'high' | 'hazardous'
  alternatives?: string[]
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  description: string
  trainingRequired?: boolean
}

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect'
  value: any
  options?: string[]
  required: boolean
}

export type TaskCategory = 
  | 'cleaning'
  | 'sanitization'
  | 'maintenance'
  | 'inspection'
  | 'setup'
  | 'breakdown'
  | 'deep-cleaning'
  | 'specialized'

export type Industry = 
  | 'residential'
  | 'commercial'
  | 'medical'
  | 'hospitality'
  | 'education'
  | 'industrial'
  | 'retail'
  | 'food-service'

export type RoomType = 
  | 'bathroom'
  | 'kitchen'
  | 'bedroom'
  | 'living-room'
  | 'office'
  | 'hallway'
  | 'dining-room'
  | 'garage'
  | 'outdoor'
  | 'laundry-room'
  | 'basement'
  | 'attic'
  | 'lobby'
  | 'conference-room'
  | 'cafeteria'
  | 'gymnasium'
  | 'laboratory'
  | 'patient-room'
  | 'operating-room'
  | 'all-rooms'

export interface TemplateFilter {
  category?: TaskCategory[]
  industry?: Industry[]
  roomType?: RoomType[]
  difficulty?: string[]
  frequency?: string[]
  timeRange?: {
    min: number
    max: number
  }
  requiredSkills?: string[]
  tags?: string[]
  searchTerm?: string
}

export interface TemplateCollection {
  id: string
  name: string
  description: string
  templates: string[] // template IDs
  industry: Industry
  roomType?: RoomType
  estimatedTotalTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt: string
  isPublic: boolean
}

export interface TaskTemplateUsage {
  templateId: string
  usageCount: number
  lastUsed: string
  averageTimeActual: number
  averageTimeEstimated: number
  completionRate: number
  userRating: number
  feedback: TemplateFeedback[]
}

export interface TemplateFeedback {
  id: string
  userId: string
  rating: number
  comment: string
  suggestions: string[]
  createdAt: string
}

export interface TemplateMetrics {
  popularTemplates: Array<{
    template: TaskTemplate
    usage: TaskTemplateUsage
  }>
  categoryUsage: Array<{
    category: TaskCategory
    count: number
    percentage: number
  }>
  industryUsage: Array<{
    industry: Industry
    count: number
    percentage: number
  }>
  averageCompletionTime: number
  userSatisfactionScore: number
}

// Predefined templates for common cleaning tasks
export const STANDARD_TEMPLATES: TaskTemplate[] = [
  {
    id: 'template-bathroom-001',
    name: 'Standard Bathroom Cleaning',
    description: 'Complete bathroom cleaning including all fixtures and surfaces',
    category: 'cleaning',
    type: 'basic',
    estimatedTime: { min: 15, max: 25, unit: 'minutes' },
    difficulty: 'easy',
    frequency: 'daily',
    industry: ['residential', 'commercial', 'hospitality'],
    rooms: ['bathroom'],
    requiredSkills: [
      {
        id: 'skill-001',
        name: 'Basic Cleaning',
        level: 'beginner',
        description: 'Understanding of basic cleaning principles'
      }
    ],
    tools: [
      {
        id: 'tool-001',
        name: 'Toilet Brush',
        type: 'essential',
        category: 'cleaning-tools'
      },
      {
        id: 'tool-002',
        name: 'Microfiber Cloths',
        type: 'essential',
        category: 'cleaning-tools'
      },
      {
        id: 'tool-003',
        name: 'Scrub Brush',
        type: 'preferred',
        category: 'cleaning-tools'
      }
    ],
    chemicals: [
      {
        id: 'chem-001',
        name: 'Toilet Bowl Cleaner',
        type: 'essential',
        category: 'disinfectant',
        safetyLevel: 'medium'
      },
      {
        id: 'chem-002',
        name: 'All-Purpose Cleaner',
        type: 'essential',
        category: 'general',
        safetyLevel: 'low'
      },
      {
        id: 'chem-003',
        name: 'Glass Cleaner',
        type: 'preferred',
        category: 'specialty',
        safetyLevel: 'low'
      }
    ],
    steps: [
      {
        id: 'step-001',
        order: 1,
        instruction: 'Gather all cleaning supplies and tools',
        description: 'Collect toilet cleaner, all-purpose cleaner, microfiber cloths, toilet brush, and scrub brush',
        timeEstimate: 2,
        tips: ['Use a cleaning caddy to carry supplies efficiently'],
        qualityCheckpoint: false
      },
      {
        id: 'step-002',
        order: 2,
        instruction: 'Apply toilet bowl cleaner',
        description: 'Squirt toilet bowl cleaner under the rim and let it sit for 5 minutes',
        timeEstimate: 1,
        warnings: ['Do not mix with other chemicals', 'Ensure adequate ventilation'],
        requiredChemicals: ['chem-001'],
        qualityCheckpoint: false
      },
      {
        id: 'step-003',
        order: 3,
        instruction: 'Clean mirror and light fixtures',
        description: 'Spray glass cleaner on mirror and wipe with microfiber cloth. Dust light fixtures.',
        timeEstimate: 3,
        requiredTools: ['tool-002'],
        requiredChemicals: ['chem-003'],
        qualityCheckpoint: true
      },
      {
        id: 'step-004',
        order: 4,
        instruction: 'Clean sink and counter',
        description: 'Spray all-purpose cleaner on sink, faucet, and counter. Scrub and wipe clean.',
        timeEstimate: 4,
        requiredTools: ['tool-002'],
        requiredChemicals: ['chem-002'],
        qualityCheckpoint: true
      },
      {
        id: 'step-005',
        order: 5,
        instruction: 'Scrub and flush toilet',
        description: 'Scrub toilet bowl thoroughly with toilet brush, then flush. Clean exterior surfaces.',
        timeEstimate: 5,
        requiredTools: ['tool-001', 'tool-002'],
        requiredChemicals: ['chem-001', 'chem-002'],
        qualityCheckpoint: true
      },
      {
        id: 'step-006',
        order: 6,
        instruction: 'Clean shower/tub',
        description: 'Apply cleaner to all shower surfaces. Scrub tiles, fixtures, and glass. Rinse thoroughly.',
        timeEstimate: 8,
        requiredTools: ['tool-003', 'tool-002'],
        requiredChemicals: ['chem-002'],
        qualityCheckpoint: true
      },
      {
        id: 'step-007',
        order: 7,
        instruction: 'Sweep and mop floor',
        description: 'Sweep floor thoroughly, then mop with appropriate cleaner. Work from far corner toward exit.',
        timeEstimate: 5,
        requiredChemicals: ['chem-002'],
        qualityCheckpoint: true
      },
      {
        id: 'step-008',
        order: 8,
        instruction: 'Replace supplies and final check',
        description: 'Restock toilet paper, towels, and soap. Do final quality inspection.',
        timeEstimate: 2,
        qualityCheckpoint: true
      }
    ],
    qualityChecks: [
      {
        id: 'qc-001',
        name: 'Mirror Clarity',
        description: 'Mirror should be streak-free and crystal clear',
        type: 'visual',
        criteria: 'No streaks, spots, or residue visible',
        passingStandard: '100% clear reflection',
        frequency: 'always'
      },
      {
        id: 'qc-002',
        name: 'Toilet Cleanliness',
        description: 'Toilet should be sanitized inside and out',
        type: 'visual',
        criteria: 'No visible dirt, stains, or odors',
        passingStandard: 'Spotless and odor-free',
        frequency: 'always'
      },
      {
        id: 'qc-003',
        name: 'Floor Condition',
        description: 'Floor should be clean and dry',
        type: 'visual',
        criteria: 'No dirt, hair, or cleaning residue',
        passingStandard: 'Clean and completely dry',
        frequency: 'always'
      }
    ],
    safetyRequirements: [
      {
        id: 'safety-001',
        type: 'ppe',
        description: 'Wear disposable gloves when handling chemicals',
        mandatory: true,
        consequences: 'Skin irritation, chemical exposure'
      },
      {
        id: 'safety-002',
        type: 'environmental',
        description: 'Ensure adequate ventilation when using chemical cleaners',
        mandatory: true,
        consequences: 'Respiratory irritation, chemical fumes inhalation'
      },
      {
        id: 'safety-003',
        type: 'procedure',
        description: 'Never mix different cleaning chemicals',
        mandatory: true,
        consequences: 'Toxic gas production, chemical burns'
      }
    ],
    variations: [
      {
        id: 'var-001',
        name: 'Deep Clean Variation',
        description: 'Monthly deep cleaning with additional steps',
        conditions: ['Monthly frequency', 'Heavy soil buildup'],
        stepModifications: [
          {
            stepId: 'step-006',
            action: 'modify',
            content: 'Remove soap scum and mineral deposits with specialized cleaner',
            timeChange: 10
          }
        ],
        timeMultiplier: 1.5
      },
      {
        id: 'var-002',
        name: 'Quick Clean Variation',
        description: 'Abbreviated cleaning for maintenance',
        conditions: ['Daily frequency', 'Light usage'],
        stepModifications: [
          {
            stepId: 'step-006',
            action: 'modify',
            content: 'Quick rinse and wipe of shower surfaces',
            timeChange: -5
          }
        ],
        timeMultiplier: 0.7
      }
    ],
    tags: ['bathroom', 'daily', 'basic', 'sanitization'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'template-kitchen-001',
    name: 'Kitchen Deep Clean',
    description: 'Comprehensive kitchen cleaning including appliances and surfaces',
    category: 'deep-cleaning',
    type: 'advanced',
    estimatedTime: { min: 45, max: 75, unit: 'minutes' },
    difficulty: 'medium',
    frequency: 'weekly',
    industry: ['residential', 'food-service'],
    rooms: ['kitchen'],
    requiredSkills: [
      {
        id: 'skill-002',
        name: 'Kitchen Sanitation',
        level: 'intermediate',
        description: 'Knowledge of food safety and kitchen hygiene'
      }
    ],
    tools: [],
    chemicals: [],
    steps: [],
    qualityChecks: [],
    safetyRequirements: [],
    variations: [],
    tags: ['kitchen', 'deep-clean', 'weekly', 'food-safety'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
]

class TaskTemplateService {
  private templates: TaskTemplate[] = [...STANDARD_TEMPLATES]
  private collections: TemplateCollection[] = []
  private usage: Map<string, TaskTemplateUsage> = new Map()

  // Template CRUD operations
  async createTemplate(template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskTemplate> {
    const newTemplate: TaskTemplate = {
      ...template,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.templates.push(newTemplate)
    return newTemplate
  }

  async updateTemplate(id: string, updates: Partial<TaskTemplate>): Promise<TaskTemplate | null> {
    const index = this.templates.findIndex(t => t.id === id)
    if (index === -1) return null

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return this.templates[index]
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const index = this.templates.findIndex(t => t.id === id)
    if (index === -1) return false

    this.templates.splice(index, 1)
    return true
  }

  async getTemplate(id: string): Promise<TaskTemplate | null> {
    return this.templates.find(t => t.id === id) || null
  }

  async getAllTemplates(): Promise<TaskTemplate[]> {
    return this.templates.filter(t => t.isActive)
  }

  // Search and filter templates
  async searchTemplates(filter: TemplateFilter): Promise<TaskTemplate[]> {
    let results = this.templates.filter(t => t.isActive)

    // Filter by category
    if (filter.category && filter.category.length > 0) {
      results = results.filter(t => filter.category!.includes(t.category))
    }

    // Filter by industry
    if (filter.industry && filter.industry.length > 0) {
      results = results.filter(t => 
        t.industry.some(industry => filter.industry!.includes(industry))
      )
    }

    // Filter by room type
    if (filter.roomType && filter.roomType.length > 0) {
      results = results.filter(t => 
        t.rooms.some(room => filter.roomType!.includes(room))
      )
    }

    // Filter by difficulty
    if (filter.difficulty && filter.difficulty.length > 0) {
      results = results.filter(t => filter.difficulty!.includes(t.difficulty))
    }

    // Filter by frequency
    if (filter.frequency && filter.frequency.length > 0) {
      results = results.filter(t => filter.frequency!.includes(t.frequency))
    }

    // Filter by time range
    if (filter.timeRange) {
      results = results.filter(t => {
        const maxTime = t.estimatedTime.unit === 'hours' 
          ? t.estimatedTime.max * 60 
          : t.estimatedTime.max
        return maxTime >= filter.timeRange!.min && maxTime <= filter.timeRange!.max
      })
    }

    // Filter by required skills
    if (filter.requiredSkills && filter.requiredSkills.length > 0) {
      results = results.filter(t => 
        t.requiredSkills.some(skill => filter.requiredSkills!.includes(skill.name))
      )
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      results = results.filter(t => 
        t.tags.some(tag => filter.tags!.includes(tag))
      )
    }

    // Text search
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase()
      results = results.filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    return results
  }

  // Get templates by category
  async getTemplatesByCategory(category: TaskCategory): Promise<TaskTemplate[]> {
    return this.templates.filter(t => t.isActive && t.category === category)
  }

  // Get templates by industry
  async getTemplatesByIndustry(industry: Industry): Promise<TaskTemplate[]> {
    return this.templates.filter(t => t.isActive && t.industry.includes(industry))
  }

  // Get templates by room type
  async getTemplatesByRoom(roomType: RoomType): Promise<TaskTemplate[]> {
    return this.templates.filter(t => t.isActive && t.rooms.includes(roomType))
  }

  // Template collections
  async createCollection(collection: Omit<TemplateCollection, 'id' | 'createdAt'>): Promise<TemplateCollection> {
    const newCollection: TemplateCollection = {
      ...collection,
      id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    this.collections.push(newCollection)
    return newCollection
  }

  async getCollections(isPublic?: boolean): Promise<TemplateCollection[]> {
    if (isPublic !== undefined) {
      return this.collections.filter(c => c.isPublic === isPublic)
    }
    return this.collections
  }

  async getCollection(id: string): Promise<TemplateCollection | null> {
    return this.collections.find(c => c.id === id) || null
  }

  // Usage tracking
  async recordTemplateUsage(
    templateId: string,
    actualTime: number,
    completed: boolean,
    rating?: number,
    feedback?: string
  ): Promise<void> {
    const existing = this.usage.get(templateId)
    const now = new Date().toISOString()

    if (existing) {
      existing.usageCount++
      existing.lastUsed = now
      existing.averageTimeActual = (existing.averageTimeActual + actualTime) / 2
      
      if (completed) {
        existing.completionRate = (existing.completionRate + 1) / existing.usageCount
      }

      if (rating) {
        existing.userRating = (existing.userRating + rating) / 2
      }

      if (feedback) {
        existing.feedback.push({
          id: `feedback-${Date.now()}`,
          userId: 'current-user', // Would come from auth context
          rating: rating || 0,
          comment: feedback,
          suggestions: [],
          createdAt: now
        })
      }
    } else {
      const template = await this.getTemplate(templateId)
      if (template) {
        const estimatedTime = template.estimatedTime.unit === 'hours'
          ? (template.estimatedTime.min + template.estimatedTime.max) / 2 * 60
          : (template.estimatedTime.min + template.estimatedTime.max) / 2

        this.usage.set(templateId, {
          templateId,
          usageCount: 1,
          lastUsed: now,
          averageTimeActual: actualTime,
          averageTimeEstimated: estimatedTime,
          completionRate: completed ? 1 : 0,
          userRating: rating || 0,
          feedback: feedback ? [{
            id: `feedback-${Date.now()}`,
            userId: 'current-user',
            rating: rating || 0,
            comment: feedback,
            suggestions: [],
            createdAt: now
          }] : []
        })
      }
    }
  }

  async getTemplateUsage(templateId: string): Promise<TaskTemplateUsage | null> {
    return this.usage.get(templateId) || null
  }

  // Analytics and metrics
  async getTemplateMetrics(): Promise<TemplateMetrics> {
    const allUsage = Array.from(this.usage.values())
    
    // Popular templates
    const popularTemplates = await Promise.all(
      allUsage
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 10)
        .map(async usage => ({
          template: await this.getTemplate(usage.templateId),
          usage
        }))
    ).then(results => results.filter(r => r.template !== null) as Array<{
      template: TaskTemplate
      usage: TaskTemplateUsage
    }>)

    // Category usage
    const categoryMap = new Map<TaskCategory, number>()
    this.templates.forEach(template => {
      const usage = this.usage.get(template.id)
      const count = usage?.usageCount || 0
      categoryMap.set(template.category, (categoryMap.get(template.category) || 0) + count)
    })

    const totalCategoryUsage = Array.from(categoryMap.values()).reduce((sum, count) => sum + count, 0)
    const categoryUsage = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: totalCategoryUsage > 0 ? Math.round((count / totalCategoryUsage) * 100) : 0
    }))

    // Industry usage
    const industryMap = new Map<Industry, number>()
    this.templates.forEach(template => {
      const usage = this.usage.get(template.id)
      const count = usage?.usageCount || 0
      template.industry.forEach(industry => {
        industryMap.set(industry, (industryMap.get(industry) || 0) + count)
      })
    })

    const totalIndustryUsage = Array.from(industryMap.values()).reduce((sum, count) => sum + count, 0)
    const industryUsage = Array.from(industryMap.entries()).map(([industry, count]) => ({
      industry,
      count,
      percentage: totalIndustryUsage > 0 ? Math.round((count / totalIndustryUsage) * 100) : 0
    }))

    // Average completion time
    const averageCompletionTime = allUsage.length > 0
      ? allUsage.reduce((sum, usage) => sum + usage.averageTimeActual, 0) / allUsage.length
      : 0

    // User satisfaction
    const ratingsWithValues = allUsage.filter(usage => usage.userRating > 0)
    const userSatisfactionScore = ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, usage) => sum + usage.userRating, 0) / ratingsWithValues.length
      : 0

    return {
      popularTemplates,
      categoryUsage,
      industryUsage,
      averageCompletionTime: Math.round(averageCompletionTime),
      userSatisfactionScore: Math.round(userSatisfactionScore * 10) / 10 // Round to 1 decimal
    }
  }

  // Template recommendations
  async getRecommendedTemplates(
    industry?: Industry,
    roomType?: RoomType,
    difficulty?: string,
    limit = 5
  ): Promise<TaskTemplate[]> {
    let candidates = this.templates.filter(t => t.isActive)

    // Filter by criteria
    if (industry) {
      candidates = candidates.filter(t => t.industry.includes(industry))
    }

    if (roomType) {
      candidates = candidates.filter(t => t.rooms.includes(roomType))
    }

    if (difficulty) {
      candidates = candidates.filter(t => t.difficulty === difficulty)
    }

    // Sort by usage and rating
    candidates.sort((a, b) => {
      const usageA = this.usage.get(a.id)
      const usageB = this.usage.get(b.id)
      
      const scoreA = (usageA?.usageCount || 0) * (usageA?.userRating || 3)
      const scoreB = (usageB?.usageCount || 0) * (usageB?.userRating || 3)
      
      return scoreB - scoreA
    })

    return candidates.slice(0, limit)
  }

  // Clone template for customization
  async cloneTemplate(id: string, newName: string): Promise<TaskTemplate | null> {
    const original = await this.getTemplate(id)
    if (!original) return null

    const cloned = {
      ...original,
      name: newName,
      id: undefined, // Will be generated
      createdAt: undefined,
      updatedAt: undefined
    }

    return this.createTemplate(cloned)
  }

  // Validate template structure
  validateTemplate(template: Partial<TaskTemplate>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!template.name || template.name.trim().length === 0) {
      errors.push('Template name is required')
    }

    if (!template.description || template.description.trim().length === 0) {
      errors.push('Template description is required')
    }

    if (!template.category) {
      errors.push('Template category is required')
    }

    if (!template.estimatedTime || template.estimatedTime.min <= 0 || template.estimatedTime.max <= 0) {
      errors.push('Valid estimated time range is required')
    }

    if (template.estimatedTime && template.estimatedTime.min > template.estimatedTime.max) {
      errors.push('Minimum time cannot be greater than maximum time')
    }

    if (!template.steps || template.steps.length === 0) {
      errors.push('At least one step is required')
    }

    if (template.steps) {
      // Validate step order
      const orders = template.steps.map(s => s.order).sort((a, b) => a - b)
      for (let i = 0; i < orders.length; i++) {
        if (orders[i] !== i + 1) {
          errors.push('Step order must be sequential starting from 1')
          break
        }
      }

      // Validate step content
      template.steps.forEach((step, index) => {
        if (!step.instruction || step.instruction.trim().length === 0) {
          errors.push(`Step ${index + 1}: Instruction is required`)
        }
      })
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Export templates
  async exportTemplates(templateIds?: string[]): Promise<string> {
    const templatesToExport = templateIds
      ? this.templates.filter(t => templateIds.includes(t.id))
      : this.templates

    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      templates: templatesToExport
    }, null, 2)
  }

  // Import templates
  async importTemplates(jsonData: string): Promise<{ imported: number; errors: string[] }> {
    try {
      const data = JSON.parse(jsonData)
      const errors: string[] = []
      let imported = 0

      if (!data.templates || !Array.isArray(data.templates)) {
        return { imported: 0, errors: ['Invalid import format: templates array not found'] }
      }

      for (const templateData of data.templates) {
        const validation = this.validateTemplate(templateData)
        if (validation.valid) {
          await this.createTemplate(templateData)
          imported++
        } else {
          errors.push(`Template "${templateData.name || 'unnamed'}": ${validation.errors.join(', ')}`)
        }
      }

      return { imported, errors }
    } catch (error) {
      return { imported: 0, errors: ['Invalid JSON format'] }
    }
  }
}

// Export singleton instance
export const taskTemplateService = new TaskTemplateService()

// Export default
export default taskTemplateService