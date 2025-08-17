import Dexie, { Table } from 'dexie'

interface Template {
  id?: string
  name: string
  industry: string
  createdAt?: Date
  updatedAt?: Date
}

interface Task {
  id?: string
  templateId?: string
  name: string
  frequency?: string
  baseTime?: number
}

interface Checklist {
  id?: string
  name?: string
  templateId?: string
  syncStatus?: string
  createdAt?: Date
  updatedAt?: Date
}

interface SyncQueueItem {
  id?: string
  type: string
  action: string
  entityId: string
  status: string
  attempts: number
  lastAttempt?: Date
}

// Create the database
class CleaningChecklistDB extends Dexie {
  templates!: Table<Template>
  tasks!: Table<Task>
  checklists!: Table<Checklist>
  syncQueue!: Table<SyncQueueItem>

  constructor() {
    super('CleaningChecklistDB')
    
    // Define database schema
    this.version(1).stores({
      templates: '++id, name, industry, createdAt, updatedAt',
      tasks: '++id, templateId, name, frequency, baseTime',
      checklists: '++id, name, templateId, syncStatus, createdAt, updatedAt',
      syncQueue: '++id, type, action, entityId, status, attempts, lastAttempt'
    })
  }
}

export const db = new CleaningChecklistDB()

// Database helper functions
export const dbOperations = {
  // Templates
  async getAllTemplates(): Promise<Template[]> {
    return await db.templates.toArray()
  },
  
  async getTemplateById(id: string): Promise<Template | undefined> {
    return await db.templates.get(id)
  },
  
  async saveTemplate(template: Template): Promise<string> {
    const id = await db.templates.add(template)
    return String(id)
  },
  
  async updateTemplate(id: string, updates: Partial<Template>): Promise<number> {
    return await db.templates.update(id, updates)
  },
  
  // Tasks
  async getTasksByTemplateId(templateId: string): Promise<Task[]> {
    return await db.tasks.where('templateId').equals(templateId).toArray()
  },
  
  async saveTask(task: Task): Promise<string> {
    const id = await db.tasks.add(task)
    return String(id)
  },
  
  async updateTask(id: string, updates: Partial<Task>): Promise<number> {
    return await db.tasks.update(id, updates)
  },
  
  // Checklists
  async getAllChecklists(): Promise<Checklist[]> {
    return await db.checklists.orderBy('createdAt').reverse().toArray()
  },
  
  async getChecklistById(id: string): Promise<Checklist | undefined> {
    return await db.checklists.get(id)
  },
  
  async createChecklist(checklist: Omit<Checklist, 'id'>): Promise<string> {
    const id = await db.checklists.add({
      ...checklist,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return String(id)
  },
  
  async updateChecklist(id: string, updates: Partial<Checklist>): Promise<number> {
    return await db.checklists.update(id, {
      ...updates,
      updatedAt: new Date()
    })
  },
  
  async deleteChecklist(id: string): Promise<void> {
    await db.checklists.delete(id)
  },
  
  // Sync Queue
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<string> {
    const id = await db.syncQueue.add({
      ...item,
      status: 'pending',
      attempts: 0
    })
    return String(id)
  },
  
  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    return await db.syncQueue
      .where('status')
      .equals('pending')
      .toArray()
  },
  
  async updateSyncItem(id: string, updates: Partial<SyncQueueItem>): Promise<number> {
    return await db.syncQueue.update(id, updates)
  },
  
  async deleteSyncItem(id: string): Promise<void> {
    await db.syncQueue.delete(id)
  }
}