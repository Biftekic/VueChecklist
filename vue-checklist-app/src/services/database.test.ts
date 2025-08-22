import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { databaseService } from './database'
import type { Checklist, Task, Template } from '@/types/checklist'

// Mock Dexie for testing
vi.mock('dexie', () => {
  const Dexie = vi.fn()
  Dexie.prototype.version = vi.fn().mockReturnThis()
  Dexie.prototype.stores = vi.fn().mockReturnThis()
  Dexie.prototype.open = vi.fn().mockResolvedValue(undefined)
  Dexie.prototype.table = vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([]),
    get: vi.fn(),
    add: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    where: vi.fn().mockReturnValue({
      equals: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([])
      })
    })
  })
  return { default: Dexie }
})

describe('DatabaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Checklist Operations', () => {
    it('should save a new checklist', async () => {
      const checklist: Checklist = {
        id: 'test-123',
        templateId: 'template-1',
        clientInfo: {
          name: 'Test Client',
          address: '123 Test St',
          phone: '555-1234',
          email: 'test@example.com',
          startDate: new Date().toISOString(),
          frequency: 'weekly',
          notes: 'Test notes'
        },
        status: 'pending',
        progress: 0,
        completedTasks: 0,
        totalTasks: 5,
        rooms: [],
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastCompletedDate: null,
          completionTime: null,
          assignee: null,
          notes: null,
          isDeleted: false
        }
      }

      const result = await databaseService.saveChecklist(checklist)
      expect(result).toBe(checklist.id)
    })

    it('should retrieve all checklists', async () => {
      const checklists = await databaseService.getAllChecklists()
      expect(Array.isArray(checklists)).toBe(true)
    })

    it('should get a checklist by ID', async () => {
      const checklistId = 'test-123'
      const mockChecklist = { id: checklistId, status: 'pending' }
      
      vi.spyOn(databaseService['db'].checklists, 'get').mockResolvedValue(mockChecklist)
      
      const result = await databaseService.getChecklistById(checklistId)
      expect(result).toEqual(mockChecklist)
    })

    it('should update a checklist', async () => {
      const checklist: Checklist = {
        id: 'test-123',
        templateId: 'template-1',
        clientInfo: {
          name: 'Updated Client',
          address: '456 Updated St',
          phone: '555-5678',
          email: 'updated@example.com',
          startDate: new Date().toISOString(),
          frequency: 'monthly',
          notes: 'Updated notes'
        },
        status: 'in-progress',
        progress: 50,
        completedTasks: 2,
        totalTasks: 4,
        rooms: [],
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastCompletedDate: null,
          completionTime: null,
          assignee: null,
          notes: null,
          isDeleted: false
        }
      }

      const result = await databaseService.updateChecklist(checklist)
      expect(result).toBe(checklist.id)
    })

    it('should delete a checklist', async () => {
      const checklistId = 'test-123'
      await databaseService.deleteChecklist(checklistId)
      
      expect(databaseService['db'].checklists.delete).toHaveBeenCalledWith(checklistId)
    })
  })

  describe('Task Operations', () => {
    it('should save a task', async () => {
      const task: Task = {
        id: 'task-1',
        checklistId: 'checklist-1',
        roomId: 'room-1',
        roomName: 'Living Room',
        name: 'Vacuum carpet',
        description: 'Vacuum all carpeted areas',
        completed: false,
        verificationRequired: false,
        priority: 'medium',
        estimatedDuration: 15,
        order: 1,
        notes: '',
        isUniversal: false
      }

      const result = await databaseService.saveTask(task)
      expect(result).toBe(task.id)
    })

    it('should get tasks by checklist ID', async () => {
      const checklistId = 'checklist-1'
      const mockTasks = [
        { id: 'task-1', checklistId, name: 'Task 1' },
        { id: 'task-2', checklistId, name: 'Task 2' }
      ]

      vi.spyOn(databaseService['db'].tasks.where('checklistId'), 'equals')
        .mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockTasks)
        } as any)

      const tasks = await databaseService.getTasksByChecklistId(checklistId)
      expect(tasks).toEqual(mockTasks)
    })

    it('should update a task', async () => {
      const task: Task = {
        id: 'task-1',
        checklistId: 'checklist-1',
        roomId: 'room-1',
        roomName: 'Living Room',
        name: 'Updated task',
        description: 'Updated description',
        completed: true,
        verificationRequired: false,
        priority: 'high',
        estimatedDuration: 20,
        order: 1,
        notes: 'Updated notes',
        isUniversal: false
      }

      const result = await databaseService.updateTask(task)
      expect(result).toBe(task.id)
    })

    it('should delete a task', async () => {
      const taskId = 'task-1'
      await databaseService.deleteTask(taskId)
      
      expect(databaseService['db'].tasks.delete).toHaveBeenCalledWith(taskId)
    })
  })

  describe('Template Operations', () => {
    it('should save a template', async () => {
      const template: Template = {
        id: 'template-1',
        name: 'Test Template',
        description: 'A test template',
        category: 'residential',
        rooms: [],
        estimatedDuration: 120,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          lastUsedDate: null,
          tags: ['test'],
          author: 'Test Author',
          version: '1.0.0',
          isActive: true
        }
      }

      const result = await databaseService.saveTemplate(template)
      expect(result).toBe(template.id)
    })

    it('should get all templates', async () => {
      const templates = await databaseService.getAllTemplates()
      expect(Array.isArray(templates)).toBe(true)
    })

    it('should get a template by ID', async () => {
      const templateId = 'template-1'
      const mockTemplate = { id: templateId, name: 'Test Template' }
      
      vi.spyOn(databaseService['db'].templates, 'get').mockResolvedValue(mockTemplate)
      
      const result = await databaseService.getTemplateById(templateId)
      expect(result).toEqual(mockTemplate)
    })

    it('should update a template', async () => {
      const template: Template = {
        id: 'template-1',
        name: 'Updated Template',
        description: 'An updated template',
        category: 'commercial',
        rooms: [],
        estimatedDuration: 180,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 5,
          lastUsedDate: new Date().toISOString(),
          tags: ['updated', 'test'],
          author: 'Updated Author',
          version: '2.0.0',
          isActive: true
        }
      }

      const result = await databaseService.updateTemplate(template)
      expect(result).toBe(template.id)
    })

    it('should delete a template', async () => {
      const templateId = 'template-1'
      await databaseService.deleteTemplate(templateId)
      
      expect(databaseService['db'].templates.delete).toHaveBeenCalledWith(templateId)
    })
  })

  describe('Error Handling', () => {
    it('should handle errors when saving a checklist', async () => {
      const checklist = { id: 'test-123' } as Checklist
      vi.spyOn(databaseService['db'].checklists, 'put').mockRejectedValue(new Error('Database error'))

      await expect(databaseService.saveChecklist(checklist)).rejects.toThrow('Database error')
    })

    it('should handle errors when getting tasks', async () => {
      vi.spyOn(databaseService['db'].tasks.where('checklistId'), 'equals')
        .mockReturnValue({
          toArray: vi.fn().mockRejectedValue(new Error('Query error'))
        } as any)

      await expect(databaseService.getTasksByChecklistId('checklist-1')).rejects.toThrow('Query error')
    })
  })
})