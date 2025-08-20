import Dexie, { Table } from 'dexie'
import { runMigrations } from './db/migrations'

// Interfaces
interface ChecklistRecord {
  id?: string
  name?: string
  clientName?: string
  clientId?: string
  industry?: string
  templateUsed?: string
  createdAt?: string
  updatedAt?: string
  status?: string
  frequency?: string
  qualityScore?: number
  lastInspection?: string
  customizations?: {
    modifiedTasks?: any[]
    addedTasks?: any[]
    removedTasks?: any[]
  }
  [key: string]: any
}

interface TemplateRecord {
  id?: string
  name: string
  industry: string
  isCustom?: boolean
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

interface TaskRecord {
  id?: string
  checklistId?: string | null
  templateId?: string | null
  name: string
  room?: string
  estimatedTime?: number
  chemicals?: string[]
  tools?: string[]
  [key: string]: any
}

interface ClientRecord {
  id?: string
  name: string
  email?: string
  phone?: string
  address?: string
  createdAt?: string
  [key: string]: any
}

interface SettingRecord {
  key: string
  value: any
}

interface SyncQueueRecord {
  id?: string
  type: string
  action: string
  data: any
  timestamp: string
  status: string
}

interface ExportData {
  checklists: ChecklistRecord[]
  templates: TemplateRecord[]
  tasks: TaskRecord[]
  clients: ClientRecord[]
  settings: SettingRecord[]
  exportDate: string
  version: string
}

// Database class extending Dexie
class VueChecklistDB extends Dexie {
  checklists!: Table<ChecklistRecord>
  templates!: Table<TemplateRecord>
  tasks!: Table<TaskRecord>
  clients!: Table<ClientRecord>
  settings!: Table<SettingRecord>
  syncQueue!: Table<SyncQueueRecord>
  inspections!: Table<any>
  taskTemplates!: Table<any>
  inventory!: Table<any>
  equipment!: Table<any>
  usageHistory!: Table<any>
  reorderAlerts!: Table<any>
  maintenanceAlerts!: Table<any>
  maintenanceHistory!: Table<any>
  _migrations!: Table<any>

  constructor() {
    super('VueChecklistDB')
    
    // Define database schema
    this.version(1).stores({
      checklists: '++id, name, clientName, clientId, industry, templateUsed, createdAt, updatedAt, status, frequency, qualityScore, lastInspection',
      templates: '++id, name, industry, isCustom, createdAt, updatedAt',
      tasks: '++id, checklistId, templateId, name, room, estimatedTime, chemicals, tools',
      clients: '++id, name, email, phone, address, createdAt',
      settings: 'key, value',
      syncQueue: '++id, type, action, data, timestamp, status',
      inspections: '++id, checklistId, inspectionDate, qualityScore, categories, issues, photos, signOff, createdAt',
      taskTemplates: '++id, name, category, estimatedTime, chemicals, tools, steps, safety, quality, createdAt, updatedAt, isPublic, usageCount',
      inventory: '++id, name, category, type, unit, currentStock, reorderPoint, reorderQuantity, costPerUnit, createdAt, updatedAt',
      equipment: '++id, name, category, status, purchaseDate, lastMaintenance, maintenanceInterval, lifespan, costPerUnit, createdAt, updatedAt',
      usageHistory: '++id, supplyId, checklistId, quantity, date, cost',
      reorderAlerts: '++id, supplyId, supplyName, currentStock, reorderPoint, reorderQuantity, status, createdAt, completedAt',
      maintenanceAlerts: '++id, equipmentId, equipmentName, type, priority, status, createdAt, completedAt',
      maintenanceHistory: '++id, equipmentId, alertId, date, type, notes, cost',
      _migrations: '++version, name, appliedAt, success, error'
    })
  }
}

// Create database instance
export const db = new VueChecklistDB()

// Initialize database and run migrations
db.on('ready', async function() {
  try {
    await runMigrations()
  } catch (error) {
    console.error('Failed to run migrations:', error)
  }
})

// Checklist status enum
export const ChecklistStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const

export type ChecklistStatusType = typeof ChecklistStatus[keyof typeof ChecklistStatus]

// Database service class
class DatabaseService {
  // Checklists
  async saveChecklist(checklist: ChecklistRecord): Promise<string> {
    const now = new Date().toISOString()
    const data: ChecklistRecord = {
      ...checklist,
      createdAt: checklist.createdAt || now,
      updatedAt: now,
      status: checklist.status || ChecklistStatus.ACTIVE
    }
    
    if (checklist.id) {
      await db.checklists.update(checklist.id, data)
      return checklist.id
    } else {
      const id = await db.checklists.add(data)
      return String(id)
    }
  }
  
  async getChecklist(id: string): Promise<ChecklistRecord | undefined> {
    return await db.checklists.get(id)
  }
  
  async getAllChecklists(): Promise<ChecklistRecord[]> {
    return await db.checklists.orderBy('updatedAt').reverse().toArray()
  }
  
  async getChecklistsByClient(clientName: string): Promise<ChecklistRecord[]> {
    return await db.checklists
      .where('clientName')
      .equals(clientName)
      .toArray()
  }
  
  async deleteChecklist(id: string): Promise<void> {
    await db.checklists.delete(id)
    // Also delete associated tasks
    await db.tasks.where('checklistId').equals(id).delete()
  }
  
  // Templates
  async saveTemplate(template: TemplateRecord): Promise<string> {
    const now = new Date().toISOString()
    const data: TemplateRecord = {
      ...template,
      createdAt: template.createdAt || now,
      updatedAt: now,
      isCustom: true
    }
    
    if (template.id) {
      await db.templates.update(template.id, data)
      return template.id
    } else {
      const id = await db.templates.add(data)
      return String(id)
    }
  }
  
  async getTemplate(id: string): Promise<TemplateRecord | undefined> {
    return await db.templates.get(id)
  }
  
  async getAllTemplates(): Promise<TemplateRecord[]> {
    return await db.templates.orderBy('name').toArray()
  }
  
  async getTemplatesByIndustry(industry: string): Promise<TemplateRecord[]> {
    return await db.templates
      .where('industry')
      .equals(industry)
      .toArray()
  }
  
  async deleteTemplate(id: string): Promise<void> {
    await db.templates.delete(id)
    // Also delete associated tasks
    await db.tasks.where('templateId').equals(id).delete()
  }
  
  // Tasks
  async saveTasks(tasks: TaskRecord[], checklistId: string | null = null, templateId: string | null = null): Promise<string[]> {
    const tasksWithIds = tasks.map(task => ({
      ...task,
      checklistId,
      templateId
    }))
    
    const ids = await db.tasks.bulkAdd(tasksWithIds, { allKeys: true })
    return ids.map(String)
  }
  
  async getTasksByChecklistId(checklistId: string): Promise<TaskRecord[]> {
    return await db.tasks
      .where('checklistId')
      .equals(checklistId)
      .toArray()
  }
  
  async getTasksByChecklist(checklistId: string): Promise<TaskRecord[]> {
    return await db.tasks
      .where('checklistId')
      .equals(checklistId)
      .toArray()
  }
  
  async getTasksByTemplate(templateId: string): Promise<TaskRecord[]> {
    return await db.tasks
      .where('templateId')
      .equals(templateId)
      .toArray()
  }
  
  async updateTaskStatus(taskId: string, completed: boolean): Promise<void> {
    await db.tasks.update(taskId, { completed })
  }
  
  // Clients
  async saveClient(client: ClientRecord): Promise<string> {
    const now = new Date().toISOString()
    const data: ClientRecord = {
      ...client,
      createdAt: client.createdAt || now
    }
    
    if (client.id) {
      await db.clients.update(client.id, data)
      return client.id
    } else {
      const id = await db.clients.add(data)
      return String(id)
    }
  }
  
  async getClient(id: string): Promise<ClientRecord | undefined> {
    return await db.clients.get(id)
  }
  
  async getAllClients(): Promise<ClientRecord[]> {
    return await db.clients.orderBy('name').toArray()
  }
  
  async searchClients(query: string): Promise<ClientRecord[]> {
    const lowerQuery = query.toLowerCase()
    return await db.clients
      .filter(client => 
        client.name.toLowerCase().includes(lowerQuery) ||
        client.email?.toLowerCase().includes(lowerQuery) ||
        client.phone?.includes(query)
      )
      .toArray()
  }
  
  // Settings
  async saveSetting(key: string, value: any): Promise<void> {
    await db.settings.put({ key, value })
  }
  
  async getSetting(key: string): Promise<any> {
    const setting = await db.settings.get(key)
    return setting?.value
  }
  
  async getAllSettings(): Promise<Record<string, any>> {
    const settings = await db.settings.toArray()
    return settings.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {} as Record<string, any>)
  }
  
  // Sync Queue
  async addToSyncQueue(type: string, action: string, data: any): Promise<void> {
    await db.syncQueue.add({
      type,
      action,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    })
  }
  
  async getSyncQueue(): Promise<SyncQueueRecord[]> {
    return await db.syncQueue
      .where('status')
      .equals('pending')
      .toArray()
  }
  
  async markSynced(id: string): Promise<void> {
    await db.syncQueue.update(id, { status: 'synced' })
  }
  
  async clearSyncQueue(): Promise<void> {
    await db.syncQueue.where('status').equals('synced').delete()
  }
  
  // Client-specific methods
  async getClientChecklists(clientId: string): Promise<ChecklistRecord[]> {
    return await db.checklists
      .where('clientId')
      .equals(clientId)
      .reverse()
      .sortBy('createdAt')
  }
  
  async getClientPreferences(clientId: string): Promise<any> {
    // Get the most recent checklist for the client to extract preferences
    const recentChecklists = await this.getClientChecklists(clientId)
    if (recentChecklists.length > 0) {
      const lastChecklist = recentChecklists[0]
      return {
        customizations: lastChecklist.customizations,
        templateUsed: lastChecklist.templateUsed,
        industry: lastChecklist.industry,
        frequency: lastChecklist.frequency
      }
    }
    return null
  }
  
  async saveClientPreferences(clientId: string, preferences: any): Promise<void> {
    // Store preferences in settings with client-specific key
    const key = `client_preferences_${clientId}`
    await this.saveSetting(key, preferences)
  }
  
  async getClientPreferencesBySetting(clientId: string): Promise<any> {
    const key = `client_preferences_${clientId}`
    return await this.getSetting(key)
  }

  // Export/Import
  async exportData(): Promise<string> {
    const data: ExportData = {
      checklists: await db.checklists.toArray(),
      templates: await db.templates.toArray(),
      tasks: await db.tasks.toArray(),
      clients: await db.clients.toArray(),
      settings: await db.settings.toArray(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    return JSON.stringify(data, null, 2)
  }
  
  async importData(jsonData: string): Promise<boolean> {
    try {
      const data: ExportData = JSON.parse(jsonData)
      
      // Clear existing data
      await db.transaction('rw', db.checklists, db.templates, db.tasks, db.clients, db.settings, async () => {
        await db.checklists.clear()
        await db.templates.clear()
        await db.tasks.clear()
        await db.clients.clear()
        await db.settings.clear()
        
        // Import new data
        if (data.checklists) await db.checklists.bulkAdd(data.checklists)
        if (data.templates) await db.templates.bulkAdd(data.templates)
        if (data.tasks) await db.tasks.bulkAdd(data.tasks)
        if (data.clients) await db.clients.bulkAdd(data.clients)
        if (data.settings) await db.settings.bulkAdd(data.settings)
      })
      
      return true
    } catch (error) {
      console.error('Import error:', error)
      throw new Error('Failed to import data: ' + (error as Error).message)
    }
  }
  
  // Clear all data
  async clearAllData(): Promise<void> {
    await db.transaction('rw', db.checklists, db.templates, db.tasks, db.clients, db.settings, db.syncQueue, async () => {
      await db.checklists.clear()
      await db.templates.clear()
      await db.tasks.clear()
      await db.clients.clear()
      await db.settings.clear()
      await db.syncQueue.clear()
    })
  }
  
  // Statistics
  async getStatistics(): Promise<{
    checklists: number
    templates: number
    clients: number
    tasks: number
  }> {
    const [checklistCount, templateCount, clientCount, taskCount] = await Promise.all([
      db.checklists.count(),
      db.templates.count(),
      db.clients.count(),
      db.tasks.count()
    ])
    
    return {
      checklists: checklistCount,
      templates: templateCount,
      clients: clientCount,
      tasks: taskCount
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()

// Export default for convenience
export default databaseService