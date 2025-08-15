import Dexie from 'dexie'

// Create database instance
export const db = new Dexie('VueChecklistDB')

// Define database schema
db.version(1).stores({
  checklists: '++id, name, clientName, industry, createdAt, updatedAt, status, frequency',
  templates: '++id, name, industry, isCustom, createdAt, updatedAt',
  tasks: '++id, checklistId, templateId, name, room, estimatedTime, chemicals, tools',
  clients: '++id, name, email, phone, address, createdAt',
  settings: 'key, value',
  syncQueue: '++id, type, action, data, timestamp, status'
})

// Checklist status enum
export const ChecklistStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
}

// Database service class
class DatabaseService {
  // Checklists
  async saveChecklist(checklist) {
    const now = new Date().toISOString()
    const data = {
      ...checklist,
      createdAt: checklist.createdAt || now,
      updatedAt: now,
      status: checklist.status || ChecklistStatus.ACTIVE
    }
    
    if (checklist.id) {
      await db.checklists.update(checklist.id, data)
      return checklist.id
    } else {
      return await db.checklists.add(data)
    }
  }
  
  async getChecklist(id) {
    return await db.checklists.get(id)
  }
  
  async getAllChecklists() {
    return await db.checklists.orderBy('updatedAt').reverse().toArray()
  }
  
  async getChecklistsByClient(clientName) {
    return await db.checklists
      .where('clientName')
      .equals(clientName)
      .toArray()
  }
  
  async deleteChecklist(id) {
    await db.checklists.delete(id)
    // Also delete associated tasks
    await db.tasks.where('checklistId').equals(id).delete()
  }
  
  // Templates
  async saveTemplate(template) {
    const now = new Date().toISOString()
    const data = {
      ...template,
      createdAt: template.createdAt || now,
      updatedAt: now,
      isCustom: true
    }
    
    if (template.id) {
      await db.templates.update(template.id, data)
      return template.id
    } else {
      return await db.templates.add(data)
    }
  }
  
  async getTemplate(id) {
    return await db.templates.get(id)
  }
  
  async getAllTemplates() {
    return await db.templates.orderBy('name').toArray()
  }
  
  async getTemplatesByIndustry(industry) {
    return await db.templates
      .where('industry')
      .equals(industry)
      .toArray()
  }
  
  async deleteTemplate(id) {
    await db.templates.delete(id)
    // Also delete associated tasks
    await db.tasks.where('templateId').equals(id).delete()
  }
  
  // Tasks
  async saveTasks(tasks, checklistId = null, templateId = null) {
    const tasksWithIds = tasks.map(task => ({
      ...task,
      checklistId,
      templateId
    }))
    
    return await db.tasks.bulkAdd(tasksWithIds)
  }
  
  async getTasksByChecklist(checklistId) {
    return await db.tasks
      .where('checklistId')
      .equals(checklistId)
      .toArray()
  }
  
  async getTasksByTemplate(templateId) {
    return await db.tasks
      .where('templateId')
      .equals(templateId)
      .toArray()
  }
  
  // Clients
  async saveClient(client) {
    const now = new Date().toISOString()
    const data = {
      ...client,
      createdAt: client.createdAt || now
    }
    
    if (client.id) {
      await db.clients.update(client.id, data)
      return client.id
    } else {
      return await db.clients.add(data)
    }
  }
  
  async getClient(id) {
    return await db.clients.get(id)
  }
  
  async getAllClients() {
    return await db.clients.orderBy('name').toArray()
  }
  
  async searchClients(query) {
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
  async saveSetting(key, value) {
    await db.settings.put({ key, value })
  }
  
  async getSetting(key) {
    const setting = await db.settings.get(key)
    return setting?.value
  }
  
  async getAllSettings() {
    const settings = await db.settings.toArray()
    return settings.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {})
  }
  
  // Sync Queue
  async addToSyncQueue(type, action, data) {
    await db.syncQueue.add({
      type,
      action,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    })
  }
  
  async getSyncQueue() {
    return await db.syncQueue
      .where('status')
      .equals('pending')
      .toArray()
  }
  
  async markSynced(id) {
    await db.syncQueue.update(id, { status: 'synced' })
  }
  
  async clearSyncQueue() {
    await db.syncQueue.where('status').equals('synced').delete()
  }
  
  // Export/Import
  async exportData() {
    const data = {
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
  
  async importData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      
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
      throw new Error('Failed to import data: ' + error.message)
    }
  }
  
  // Clear all data
  async clearAllData() {
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
  async getStatistics() {
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