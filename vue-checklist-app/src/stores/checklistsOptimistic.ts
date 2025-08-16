import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Checklist, 
  ChecklistsState, 
  ClientInfo, 
  PropertyDetails, 
  Room, 
  Task 
} from '@/types'
import { dbOperations } from '@/services/database'
import { useErrorHandling } from '@/composables/useErrorHandling'
import { useAppStore } from './app'

interface OptimisticUpdate {
  id: string
  type: 'create' | 'update' | 'delete'
  previousState?: Checklist
  newState?: Checklist
  timestamp: number
}

export const useChecklistsOptimisticStore = defineStore('checklistsOptimistic', () => {
  // State
  const state = ref<ChecklistsState>({
    byId: {},
    allIds: [],
    active: null,
    loading: false,
    error: null,
    filter: {
      status: undefined,
      clientName: undefined,
      dateRange: undefined
    },
    sort: {
      field: 'createdAt',
      order: 'desc'
    }
  })

  // Optimistic updates tracking
  const pendingUpdates = ref<Map<string, OptimisticUpdate>>(new Map())
  const failedUpdates = ref<Map<string, OptimisticUpdate>>(new Map())
  
  // Error handling
  const { executeWithErrorHandling, handleDatabaseError } = useErrorHandling({
    component: 'ChecklistsStore',
    retryable: true,
    recoverable: true
  })

  const appStore = useAppStore()

  // Getters
  const all = computed(() => 
    state.value.allIds.map(id => state.value.byId[id]).filter(Boolean)
  )

  const active = computed(() => 
    state.value.active ? state.value.byId[state.value.active] : null
  )

  const hasPendingUpdates = computed(() => pendingUpdates.value.size > 0)
  const hasFailedUpdates = computed(() => failedUpdates.value.size > 0)

  // Optimistic update helpers
  function createOptimisticId(): string {
    return `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function trackOptimisticUpdate(update: OptimisticUpdate): void {
    pendingUpdates.value.set(update.id, update)
  }

  function resolveOptimisticUpdate(id: string): void {
    pendingUpdates.value.delete(id)
    failedUpdates.value.delete(id)
  }

  function failOptimisticUpdate(id: string, error: Error): void {
    const update = pendingUpdates.value.get(id)
    if (update) {
      pendingUpdates.value.delete(id)
      failedUpdates.value.set(id, update)
      
      // Rollback the optimistic update
      rollbackUpdate(update)
      
      // Show error notification
      appStore.showNotification({
        message: `Failed to ${update.type} checklist. Click to retry.`,
        type: 'error',
        duration: 5000,
        action: {
          label: 'Retry',
          handler: () => retryFailedUpdate(id)
        }
      })
    }
  }

  function rollbackUpdate(update: OptimisticUpdate): void {
    switch (update.type) {
      case 'create':
        // Remove the optimistically created item
        delete state.value.byId[update.id]
        state.value.allIds = state.value.allIds.filter(id => id !== update.id)
        break
        
      case 'update':
        // Restore previous state
        if (update.previousState) {
          state.value.byId[update.id] = update.previousState
        }
        break
        
      case 'delete':
        // Restore deleted item
        if (update.previousState) {
          state.value.byId[update.id] = update.previousState
          if (!state.value.allIds.includes(update.id)) {
            state.value.allIds.push(update.id)
          }
        }
        break
    }
  }

  async function retryFailedUpdate(id: string): Promise<void> {
    const update = failedUpdates.value.get(id)
    if (!update) return
    
    failedUpdates.value.delete(id)
    
    switch (update.type) {
      case 'create':
        if (update.newState) {
          await createChecklist(update.newState)
        }
        break
        
      case 'update':
        if (update.newState) {
          await updateChecklist(update.id, update.newState)
        }
        break
        
      case 'delete':
        await deleteChecklist(update.id)
        break
    }
  }

  // Actions with optimistic updates
  async function createChecklist(checklist: Omit<Checklist, 'id'>): Promise<string | undefined> {
    // Generate optimistic ID
    const optimisticId = createOptimisticId()
    const optimisticChecklist: Checklist = {
      ...checklist,
      id: optimisticId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: checklist.status || 'draft',
      completionPercentage: 0
    } as Checklist
    
    // Optimistically add to store
    state.value.byId[optimisticId] = optimisticChecklist
    state.value.allIds.push(optimisticId)
    
    // Track the optimistic update
    trackOptimisticUpdate({
      id: optimisticId,
      type: 'create',
      newState: optimisticChecklist,
      timestamp: Date.now()
    })
    
    // Show immediate feedback
    appStore.showNotification({
      message: 'Creating checklist...',
      type: 'info',
      duration: 2000
    })
    
    try {
      // Persist to database
      const actualId = await dbOperations.createChecklist(checklist)
      
      if (actualId) {
        // Replace optimistic ID with actual ID
        const actualChecklist = { ...optimisticChecklist, id: actualId }
        delete state.value.byId[optimisticId]
        state.value.byId[actualId] = actualChecklist
        
        const index = state.value.allIds.indexOf(optimisticId)
        if (index !== -1) {
          state.value.allIds[index] = actualId
        }
        
        // Resolve the optimistic update
        resolveOptimisticUpdate(optimisticId)
        
        // Show success notification
        appStore.showNotification({
          message: 'Checklist created successfully',
          type: 'success',
          duration: 3000
        })
        
        return actualId
      }
    } catch (error) {
      failOptimisticUpdate(optimisticId, error as Error)
      handleDatabaseError(error as Error, 'create', checklist)
    }
    
    return undefined
  }

  async function updateChecklist(
    id: string, 
    updates: Partial<Checklist>
  ): Promise<boolean> {
    // Store previous state for rollback
    const previousState = { ...state.value.byId[id] }
    
    if (!previousState) {
      console.error('Checklist not found:', id)
      return false
    }
    
    // Optimistically update
    const updatedChecklist = {
      ...previousState,
      ...updates,
      updatedAt: new Date()
    }
    state.value.byId[id] = updatedChecklist
    
    // Track the optimistic update
    trackOptimisticUpdate({
      id,
      type: 'update',
      previousState,
      newState: updatedChecklist,
      timestamp: Date.now()
    })
    
    // Show immediate feedback
    appStore.showNotification({
      message: 'Updating checklist...',
      type: 'info',
      duration: 1000
    })
    
    try {
      // Persist to database
      await dbOperations.updateChecklist(id, updates)
      
      // Resolve the optimistic update
      resolveOptimisticUpdate(id)
      
      // Show success notification
      appStore.showNotification({
        message: 'Checklist updated',
        type: 'success',
        duration: 2000
      })
      
      return true
    } catch (error) {
      failOptimisticUpdate(id, error as Error)
      handleDatabaseError(error as Error, 'update', { id, updates })
      return false
    }
  }

  async function deleteChecklist(id: string): Promise<boolean> {
    // Store previous state for rollback
    const previousState = state.value.byId[id]
    
    if (!previousState) {
      console.error('Checklist not found:', id)
      return false
    }
    
    // Optimistically delete
    delete state.value.byId[id]
    state.value.allIds = state.value.allIds.filter(itemId => itemId !== id)
    
    // Track the optimistic update
    trackOptimisticUpdate({
      id,
      type: 'delete',
      previousState,
      timestamp: Date.now()
    })
    
    // Show immediate feedback
    appStore.showNotification({
      message: 'Deleting checklist...',
      type: 'info',
      duration: 1000
    })
    
    try {
      // Delete from database
      await dbOperations.deleteChecklist(id)
      
      // Resolve the optimistic update
      resolveOptimisticUpdate(id)
      
      // Show success notification
      appStore.showNotification({
        message: 'Checklist deleted',
        type: 'success',
        duration: 2000
      })
      
      return true
    } catch (error) {
      failOptimisticUpdate(id, error as Error)
      handleDatabaseError(error as Error, 'delete', { id })
      return false
    }
  }

  async function updateTaskStatus(
    checklistId: string,
    taskId: string,
    completed: boolean
  ): Promise<boolean> {
    const checklist = state.value.byId[checklistId]
    if (!checklist) return false
    
    // Store previous state
    const previousTasks = [...checklist.tasks]
    
    // Optimistically update task
    const taskIndex = checklist.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return false
    
    checklist.tasks[taskIndex] = {
      ...checklist.tasks[taskIndex],
      completed,
      completedAt: completed ? new Date() : undefined
    }
    
    // Update completion percentage
    const completedTasks = checklist.tasks.filter(t => t.completed).length
    checklist.completionPercentage = (completedTasks / checklist.tasks.length) * 100
    
    // Update checklist status
    if (checklist.completionPercentage === 100) {
      checklist.status = 'completed'
    } else if (checklist.completionPercentage > 0) {
      checklist.status = 'active'
    }
    
    // Track update
    trackOptimisticUpdate({
      id: `${checklistId}-task-${taskId}`,
      type: 'update',
      previousState: { ...checklist, tasks: previousTasks },
      newState: { ...checklist },
      timestamp: Date.now()
    })
    
    try {
      // Persist to database
      await dbOperations.updateChecklist(checklistId, {
        tasks: checklist.tasks,
        completionPercentage: checklist.completionPercentage,
        status: checklist.status
      })
      
      resolveOptimisticUpdate(`${checklistId}-task-${taskId}`)
      
      // Announce to screen readers
      const message = completed 
        ? 'Task marked as completed' 
        : 'Task marked as incomplete'
      announceToScreenReader(message)
      
      return true
    } catch (error) {
      // Rollback
      checklist.tasks = previousTasks
      failOptimisticUpdate(`${checklistId}-task-${taskId}`, error as Error)
      return false
    }
  }

  async function batchUpdateTasks(
    checklistId: string,
    taskUpdates: Array<{ id: string; completed: boolean }>
  ): Promise<boolean> {
    const checklist = state.value.byId[checklistId]
    if (!checklist) return false
    
    // Store previous state
    const previousState = { ...checklist, tasks: [...checklist.tasks] }
    
    // Optimistically update all tasks
    taskUpdates.forEach(update => {
      const taskIndex = checklist.tasks.findIndex(t => t.id === update.id)
      if (taskIndex !== -1) {
        checklist.tasks[taskIndex] = {
          ...checklist.tasks[taskIndex],
          completed: update.completed,
          completedAt: update.completed ? new Date() : undefined
        }
      }
    })
    
    // Update completion percentage
    const completedTasks = checklist.tasks.filter(t => t.completed).length
    checklist.completionPercentage = (completedTasks / checklist.tasks.length) * 100
    
    // Track batch update
    trackOptimisticUpdate({
      id: `${checklistId}-batch-${Date.now()}`,
      type: 'update',
      previousState,
      newState: { ...checklist },
      timestamp: Date.now()
    })
    
    try {
      // Persist to database
      await dbOperations.updateChecklist(checklistId, {
        tasks: checklist.tasks,
        completionPercentage: checklist.completionPercentage
      })
      
      resolveOptimisticUpdate(`${checklistId}-batch-${Date.now()}`)
      
      appStore.showNotification({
        message: `Updated ${taskUpdates.length} tasks`,
        type: 'success',
        duration: 2000
      })
      
      return true
    } catch (error) {
      // Rollback
      state.value.byId[checklistId] = previousState
      failOptimisticUpdate(`${checklistId}-batch-${Date.now()}`, error as Error)
      return false
    }
  }

  // Sync pending updates when coming back online
  async function syncPendingUpdates(): Promise<void> {
    if (pendingUpdates.value.size === 0) return
    
    appStore.showNotification({
      message: `Syncing ${pendingUpdates.value.size} pending updates...`,
      type: 'info',
      duration: 3000
    })
    
    const updates = Array.from(pendingUpdates.value.values())
    
    for (const update of updates) {
      try {
        switch (update.type) {
          case 'create':
            if (update.newState) {
              await dbOperations.createChecklist(update.newState)
            }
            break
            
          case 'update':
            if (update.newState) {
              await dbOperations.updateChecklist(update.id, update.newState)
            }
            break
            
          case 'delete':
            await dbOperations.deleteChecklist(update.id)
            break
        }
        
        resolveOptimisticUpdate(update.id)
      } catch (error) {
        console.error('Failed to sync update:', error)
        failOptimisticUpdate(update.id, error as Error)
      }
    }
    
    const syncedCount = updates.length - failedUpdates.value.size
    
    if (syncedCount > 0) {
      appStore.showNotification({
        message: `Successfully synced ${syncedCount} updates`,
        type: 'success',
        duration: 3000
      })
    }
    
    if (failedUpdates.value.size > 0) {
      appStore.showNotification({
        message: `${failedUpdates.value.size} updates failed to sync`,
        type: 'error',
        duration: 5000
      })
    }
  }

  // Helper function for screen reader announcements
  function announceToScreenReader(message: string): void {
    const announcement = document.getElementById('app-announcements')
    if (announcement) {
      announcement.textContent = message
      setTimeout(() => {
        announcement.textContent = ''
      }, 1000)
    }
  }

  // Watch for online status changes
  window.addEventListener('online', () => {
    syncPendingUpdates()
  })

  return {
    // State
    state,
    
    // Getters
    all,
    active,
    hasPendingUpdates,
    hasFailedUpdates,
    
    // Actions with optimistic updates
    createChecklist,
    updateChecklist,
    deleteChecklist,
    updateTaskStatus,
    batchUpdateTasks,
    syncPendingUpdates,
    retryFailedUpdate
  }
})