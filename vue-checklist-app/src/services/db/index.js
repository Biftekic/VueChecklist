import Dexie from 'dexie'

// Create the database
export const db = new Dexie('CleaningChecklistDB')

// Define database schema
db.version(1).stores({
  templates: '++id, name, industry, createdAt, updatedAt',
  tasks: '++id, templateId, name, frequency, baseTime',
  checklists: '++id, name, templateId, syncStatus, createdAt, updatedAt',
  syncQueue: '++id, type, action, entityId, status, attempts, lastAttempt'
})

// Database helper functions
export const dbOperations = {
  // Templates
  async getAllTemplates() {
    return await db.templates.toArray()
  },
  
  async getTemplateById(id) {
    return await db.templates.get(id)
  },
  
  async saveTemplate(template) {
    return await db.templates.add(template)
  },
  
  async updateTemplate(id, updates) {
    return await db.templates.update(id, updates)
  },
  
  // Tasks
  async getTasksByTemplateId(templateId) {
    return await db.tasks.where('templateId').equals(templateId).toArray()
  },
  
  async saveTask(task) {
    return await db.tasks.add(task)
  },
  
  async updateTask(id, updates) {
    return await db.tasks.update(id, updates)
  },
  
  // Checklists
  async getAllChecklists() {
    return await db.checklists.orderBy('createdAt').reverse().toArray()
  },
  
  async getChecklistById(id) {
    return await db.checklists.get(id)
  },
  
  async saveChecklist(checklist) {
    const now = new Date()
    checklist.createdAt = now
    checklist.updatedAt = now
    checklist.syncStatus = 'pending'
    return await db.checklists.add(checklist)
  },
  
  async updateChecklist(id, updates) {
    updates.updatedAt = new Date()
    return await db.checklists.update(id, updates)
  },
  
  async deleteChecklist(id) {
    return await db.checklists.delete(id)
  },
  
  // Sync Queue
  async addToSyncQueue(item) {
    item.attempts = 0
    item.status = 'pending'
    item.lastAttempt = null
    return await db.syncQueue.add(item)
  },
  
  async getPendingSyncItems() {
    return await db.syncQueue.where('status').equals('pending').toArray()
  },
  
  async updateSyncItem(id, updates) {
    return await db.syncQueue.update(id, updates)
  },
  
  async clearSyncQueue() {
    return await db.syncQueue.clear()
  }
}

export default db