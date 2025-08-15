import { openDB } from 'idb'

const DB_NAME = 'TaskTemplateDB'
const DB_VERSION = 1
const STORE_NAME = 'taskTemplates'

// Initialize the database
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id',
          autoIncrement: true 
        })
        
        // Create indexes
        store.createIndex('name', 'name', { unique: false })
        store.createIndex('category', 'category', { unique: false })
        store.createIndex('room', 'room', { unique: false })
        store.createIndex('frequency', 'frequency', { unique: false })
        store.createIndex('isShared', 'isShared', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

// Task Template Service
export const taskTemplateService = {
  // Create a new task template
  async createTemplate(taskData) {
    const db = await initDB()
    const template = {
      ...taskData,
      id: undefined, // Let IndexedDB auto-generate
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      isShared: taskData.isShared || false,
      tags: taskData.tags || []
    }
    
    const id = await db.add(STORE_NAME, template)
    return { ...template, id }
  },

  // Get all templates
  async getAllTemplates() {
    const db = await initDB()
    return db.getAll(STORE_NAME)
  },

  // Get template by ID
  async getTemplate(id) {
    const db = await initDB()
    return db.get(STORE_NAME, id)
  },

  // Get templates by category
  async getTemplatesByCategory(category) {
    const db = await initDB()
    const index = db.transaction(STORE_NAME).store.index('category')
    return index.getAll(category)
  },

  // Get templates by room
  async getTemplatesByRoom(room) {
    const db = await initDB()
    const index = db.transaction(STORE_NAME).store.index('room')
    return index.getAll(room)
  },

  // Get shared templates
  async getSharedTemplates() {
    const db = await initDB()
    const index = db.transaction(STORE_NAME).store.index('isShared')
    return index.getAll(true)
  },

  // Update template
  async updateTemplate(id, updates) {
    const db = await initDB()
    const template = await db.get(STORE_NAME, id)
    
    if (!template) {
      throw new Error('Template not found')
    }
    
    const updated = {
      ...template,
      ...updates,
      id, // Preserve ID
      updatedAt: new Date().toISOString()
    }
    
    await db.put(STORE_NAME, updated)
    return updated
  },

  // Delete template
  async deleteTemplate(id) {
    const db = await initDB()
    await db.delete(STORE_NAME, id)
  },

  // Increment usage count
  async incrementUsageCount(id) {
    const db = await initDB()
    const template = await db.get(STORE_NAME, id)
    
    if (template) {
      template.usageCount = (template.usageCount || 0) + 1
      template.lastUsedAt = new Date().toISOString()
      await db.put(STORE_NAME, template)
    }
  },

  // Search templates
  async searchTemplates(query) {
    const db = await initDB()
    const allTemplates = await db.getAll(STORE_NAME)
    
    const searchTerm = query.toLowerCase()
    return allTemplates.filter(template => {
      return (
        template.name.toLowerCase().includes(searchTerm) ||
        template.description?.toLowerCase().includes(searchTerm) ||
        template.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    })
  },

  // Get popular templates (most used)
  async getPopularTemplates(limit = 10) {
    const db = await initDB()
    const allTemplates = await db.getAll(STORE_NAME)
    
    return allTemplates
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, limit)
  },

  // Get recent templates
  async getRecentTemplates(limit = 10) {
    const db = await initDB()
    const allTemplates = await db.getAll(STORE_NAME)
    
    return allTemplates
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  },

  // Export templates (for sharing)
  async exportTemplates(templateIds = null) {
    const db = await initDB()
    
    let templates
    if (templateIds) {
      templates = await Promise.all(
        templateIds.map(id => db.get(STORE_NAME, id))
      )
      templates = templates.filter(Boolean)
    } else {
      templates = await db.getAll(STORE_NAME)
    }
    
    return {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      templates: templates.map(t => {
        const { id, ...template } = t
        return template
      })
    }
  },

  // Import templates
  async importTemplates(exportData) {
    const db = await initDB()
    const imported = []
    
    for (const template of exportData.templates) {
      const newTemplate = {
        ...template,
        id: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isImported: true
      }
      
      const id = await db.add(STORE_NAME, newTemplate)
      imported.push({ ...newTemplate, id })
    }
    
    return imported
  },

  // Create template from existing task
  async createTemplateFromTask(task, templateName = null) {
    const template = {
      name: templateName || `${task.name} Template`,
      description: task.description || '',
      room: task.room,
      category: task.category || 'Custom',
      frequency: task.frequency,
      estimatedTime: task.estimatedTime,
      minTime: task.minTime,
      maxTime: task.maxTime,
      chemicals: task.chemicals || [],
      tools: task.tools || [],
      safetyWarnings: task.safetyWarnings || [],
      steps: task.steps || [],
      qualityStandards: task.qualityStandards || [],
      professionalTime: task.professionalTime,
      tags: task.tags || [],
      isShared: false
    }
    
    return this.createTemplate(template)
  },

  // Apply template to checklist
  async applyTemplateToChecklist(templateId, room = null) {
    const template = await this.getTemplate(templateId)
    
    if (!template) {
      throw new Error('Template not found')
    }
    
    // Increment usage count
    await this.incrementUsageCount(templateId)
    
    // Create task from template
    const task = {
      id: `task-${Date.now()}`,
      name: template.name,
      description: template.description,
      room: room || template.room,
      category: template.category,
      frequency: template.frequency,
      estimatedTime: template.estimatedTime,
      minTime: template.minTime,
      maxTime: template.maxTime,
      chemicals: [...(template.chemicals || [])],
      tools: [...(template.tools || [])],
      safetyWarnings: [...(template.safetyWarnings || [])],
      steps: [...(template.steps || [])],
      qualityStandards: [...(template.qualityStandards || [])],
      professionalTime: template.professionalTime,
      fromTemplate: true,
      templateId: templateId
    }
    
    return task
  },

  // Get template categories
  async getCategories() {
    const db = await initDB()
    const templates = await db.getAll(STORE_NAME)
    
    const categories = new Set()
    templates.forEach(t => {
      if (t.category) categories.add(t.category)
    })
    
    return Array.from(categories).sort()
  },

  // Initialize with default templates
  async initializeDefaultTemplates() {
    const db = await initDB()
    const count = await db.count(STORE_NAME)
    
    // Only initialize if no templates exist
    if (count === 0) {
      const defaultTemplates = [
        {
          name: 'Deep Clean Kitchen Appliances',
          category: 'Kitchen',
          room: 'Kitchen',
          frequency: 'MONTHLY',
          estimatedTime: 45,
          minTime: 30,
          maxTime: 60,
          description: 'Thorough cleaning of all kitchen appliances',
          chemicals: ['Degreaser', 'All-purpose cleaner', 'Stainless steel cleaner'],
          tools: ['Microfiber cloths', 'Scrub brush', 'Vacuum with attachments'],
          steps: [
            'Clean refrigerator inside and out',
            'Deep clean oven and stovetop',
            'Clean microwave thoroughly',
            'Descale coffee maker',
            'Clean dishwasher filters'
          ],
          qualityStandards: [
            'No grease or food residue',
            'All surfaces streak-free',
            'Fresh smell throughout'
          ],
          tags: ['deep-clean', 'appliances', 'kitchen'],
          isShared: true
        },
        {
          name: 'Bathroom Sanitization',
          category: 'Bathroom',
          room: 'Bathroom',
          frequency: 'WEEKLY',
          estimatedTime: 30,
          minTime: 20,
          maxTime: 40,
          description: 'Complete bathroom sanitization and cleaning',
          chemicals: ['Disinfectant', 'Toilet bowl cleaner', 'Glass cleaner'],
          tools: ['Toilet brush', 'Scrub brush', 'Microfiber cloths', 'Squeegee'],
          steps: [
            'Apply toilet bowl cleaner and let sit',
            'Spray and wipe all surfaces with disinfectant',
            'Clean mirrors and glass',
            'Scrub shower/tub',
            'Mop floor with disinfectant'
          ],
          qualityStandards: [
            'All surfaces disinfected',
            'No soap scum or water spots',
            'Fresh, clean smell'
          ],
          tags: ['sanitize', 'bathroom', 'weekly'],
          isShared: true
        },
        {
          name: 'Window Cleaning',
          category: 'General',
          room: 'All Rooms',
          frequency: 'MONTHLY',
          estimatedTime: 20,
          minTime: 15,
          maxTime: 30,
          description: 'Professional window cleaning inside and out',
          chemicals: ['Window cleaner', 'Ammonia-free glass cleaner'],
          tools: ['Squeegee', 'Microfiber cloths', 'Extension pole', 'Bucket'],
          steps: [
            'Remove dust and debris from window frame',
            'Apply cleaning solution',
            'Squeegee from top to bottom',
            'Wipe edges and sills',
            'Polish with dry microfiber cloth'
          ],
          qualityStandards: [
            'Streak-free glass',
            'Clean frames and sills',
            'No water spots'
          ],
          tags: ['windows', 'glass', 'monthly'],
          isShared: true
        }
      ]
      
      for (const template of defaultTemplates) {
        await this.createTemplate(template)
      }
    }
  }
}

// Initialize default templates on first load
taskTemplateService.initializeDefaultTemplates().catch(console.error)