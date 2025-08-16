import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useChecklistsOptimisticStore } from '../checklistsOptimistic'
import { dbOperations } from '@/services/database'

// Mock database operations
vi.mock('@/services/database', () => ({
  dbOperations: {
    createChecklist: vi.fn(),
    updateChecklist: vi.fn(),
    deleteChecklist: vi.fn(),
    getAllChecklists: vi.fn()
  }
}))

describe('Checklists Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('optimistic updates', () => {
    it('should optimistically add a checklist', async () => {
      const store = useChecklistsOptimisticStore()
      const newChecklist = {
        name: 'Test Checklist',
        client: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '555-1234',
          email: 'john@example.com',
          frequency: 'weekly' as const
        },
        tasks: [],
        status: 'draft' as const,
        completionPercentage: 0
      }

      // Mock successful database operation
      vi.mocked(dbOperations.createChecklist).mockResolvedValue('actual-id')

      // Create checklist
      const result = await store.createChecklist(newChecklist)

      // Should have optimistically added the checklist
      expect(store.all.length).toBe(1)
      expect(result).toBe('actual-id')
    })

    it('should rollback on failed creation', async () => {
      const store = useChecklistsOptimisticStore()
      const newChecklist = {
        name: 'Test Checklist',
        client: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '555-1234',
          email: 'john@example.com',
          frequency: 'weekly' as const
        },
        tasks: [],
        status: 'draft' as const,
        completionPercentage: 0
      }

      // Mock failed database operation
      vi.mocked(dbOperations.createChecklist).mockRejectedValue(new Error('Database error'))

      // Create checklist
      await store.createChecklist(newChecklist)

      // Wait for rollback
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should have rolled back
      expect(store.all.length).toBe(0)
      expect(store.hasFailedUpdates).toBe(true)
    })

    it('should optimistically update a checklist', async () => {
      const store = useChecklistsOptimisticStore()
      
      // Add initial checklist
      store.state.byId['test-id'] = {
        id: 'test-id',
        name: 'Original Name',
        client: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '555-1234',
          email: 'john@example.com',
          frequency: 'weekly'
        },
        tasks: [],
        status: 'draft',
        completionPercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      store.state.allIds.push('test-id')

      // Mock successful update
      vi.mocked(dbOperations.updateChecklist).mockResolvedValue(true)

      // Update checklist
      await store.updateChecklist('test-id', { name: 'Updated Name' })

      // Should have optimistically updated
      expect(store.state.byId['test-id'].name).toBe('Updated Name')
    })

    it('should handle task status updates', async () => {
      const store = useChecklistsOptimisticStore()
      
      // Add checklist with tasks
      store.state.byId['test-id'] = {
        id: 'test-id',
        name: 'Test Checklist',
        client: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '555-1234',
          email: 'john@example.com',
          frequency: 'weekly'
        },
        tasks: [
          { id: 'task-1', name: 'Task 1', completed: false },
          { id: 'task-2', name: 'Task 2', completed: false }
        ],
        status: 'active',
        completionPercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      store.state.allIds.push('test-id')

      // Mock successful update
      vi.mocked(dbOperations.updateChecklist).mockResolvedValue(true)

      // Update task status
      await store.updateTaskStatus('test-id', 'task-1', true)

      // Should have updated task and completion percentage
      expect(store.state.byId['test-id'].tasks[0].completed).toBe(true)
      expect(store.state.byId['test-id'].completionPercentage).toBe(50)
    })

    it('should batch update multiple tasks', async () => {
      const store = useChecklistsOptimisticStore()
      
      // Add checklist with tasks
      store.state.byId['test-id'] = {
        id: 'test-id',
        name: 'Test Checklist',
        client: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '555-1234',
          email: 'john@example.com',
          frequency: 'weekly'
        },
        tasks: [
          { id: 'task-1', name: 'Task 1', completed: false },
          { id: 'task-2', name: 'Task 2', completed: false },
          { id: 'task-3', name: 'Task 3', completed: false }
        ],
        status: 'active',
        completionPercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      store.state.allIds.push('test-id')

      // Mock successful update
      vi.mocked(dbOperations.updateChecklist).mockResolvedValue(true)

      // Batch update tasks
      await store.batchUpdateTasks('test-id', [
        { id: 'task-1', completed: true },
        { id: 'task-2', completed: true }
      ])

      // Should have updated multiple tasks
      expect(store.state.byId['test-id'].tasks[0].completed).toBe(true)
      expect(store.state.byId['test-id'].tasks[1].completed).toBe(true)
      expect(store.state.byId['test-id'].tasks[2].completed).toBe(false)
      expect(store.state.byId['test-id'].completionPercentage).toBeCloseTo(66.67, 1)
    })
  })

  describe('filtering and sorting', () => {
    beforeEach(() => {
      const store = useChecklistsOptimisticStore()
      
      // Add test data
      store.state.byId = {
        'id-1': {
          id: 'id-1',
          name: 'Checklist A',
          client: { name: 'Alice', address: '', phone: '', email: '', frequency: 'weekly' },
          tasks: [],
          status: 'completed',
          completionPercentage: 100,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        'id-2': {
          id: 'id-2',
          name: 'Checklist B',
          client: { name: 'Bob', address: '', phone: '', email: '', frequency: 'monthly' },
          tasks: [],
          status: 'active',
          completionPercentage: 50,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02')
        },
        'id-3': {
          id: 'id-3',
          name: 'Checklist C',
          client: { name: 'Charlie', address: '', phone: '', email: '', frequency: 'daily' },
          tasks: [],
          status: 'draft',
          completionPercentage: 0,
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03')
        }
      }
      store.state.allIds = ['id-1', 'id-2', 'id-3']
    })

    it('should return all checklists', () => {
      const store = useChecklistsOptimisticStore()
      expect(store.all.length).toBe(3)
    })

    it('should get checklist by ID', () => {
      const store = useChecklistsOptimisticStore()
      const checklist = store.state.byId['id-1']
      expect(checklist?.name).toBe('Checklist A')
    })

    it('should track pending updates', () => {
      const store = useChecklistsOptimisticStore()
      expect(store.hasPendingUpdates).toBe(false)
      
      // Add a pending update manually for testing
      // In real usage, this would be done through optimistic operations
      expect(store.hasFailedUpdates).toBe(false)
    })
  })
})