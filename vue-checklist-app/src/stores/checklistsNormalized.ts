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
import { useLoading } from '@/composables/useLoading'

export const useChecklistsStore = defineStore('checklistsNormalized', () => {
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

  // Loading composable
  const { isLoading, withLoading } = useLoading()

  // Getters
  const all = computed(() => 
    state.value.allIds.map(id => state.value.byId[id]).filter(Boolean)
  )

  const active = computed(() => 
    state.value.active ? state.value.byId[state.value.active] : null
  )

  const filtered = computed(() => {
    let result = all.value

    // Apply status filter
    if (state.value.filter.status) {
      result = result.filter(c => c.status === state.value.filter.status)
    }

    // Apply client name filter
    if (state.value.filter.clientName) {
      const searchTerm = state.value.filter.clientName.toLowerCase()
      result = result.filter(c => 
        c.client.name.toLowerCase().includes(searchTerm)
      )
    }

    // Apply date range filter
    if (state.value.filter.dateRange) {
      const { start, end } = state.value.filter.dateRange
      result = result.filter(c => {
        const created = new Date(c.createdAt)
        return created >= start && created <= end
      })
    }

    // Apply sorting
    const sorted = [...result].sort((a, b) => {
      const field = state.value.sort.field
      const aVal = a[field]
      const bVal = b[field]
      
      if (aVal < bVal) return state.value.sort.order === 'asc' ? -1 : 1
      if (aVal > bVal) return state.value.sort.order === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  })

  const getById = (id: string): Checklist | undefined => {
    return state.value.byId[id]
  }

  const statistics = computed(() => ({
    total: state.value.allIds.length,
    completed: all.value.filter(c => c.status === 'completed').length,
    active: all.value.filter(c => c.status === 'active').length,
    draft: all.value.filter(c => c.status === 'draft').length,
    averageCompletionRate: all.value.reduce((acc, c) => 
      acc + c.completionPercentage, 0
    ) / (all.value.length || 1)
  }))

  // Actions
  async function fetchChecklists() {
    return withLoading(async () => {
      try {
        state.value.error = null
        const data = await dbOperations.getAllChecklists()
        
        // Normalize the data
        const byId: Record<string, Checklist> = {}
        const allIds: string[] = []
        
        data.forEach((checklist: Checklist) => {
          byId[checklist.id] = checklist
          allIds.push(checklist.id)
        })
        
        state.value.byId = byId
        state.value.allIds = allIds
      } catch (error) {
        state.value.error = error as Error
        throw error
      }
    }, 'Loading checklists...')
  }

  async function addChecklist(checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>) {
    return withLoading(async () => {
      try {
        const newChecklist: Checklist = {
          ...checklist,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: checklist.status || 'draft',
          completionPercentage: 0
        }
        
        // Optimistic update
        state.value.byId[newChecklist.id] = newChecklist
        state.value.allIds.push(newChecklist.id)
        
        // Persist to database
        await dbOperations.addChecklist(newChecklist)
        
        return newChecklist
      } catch (error) {
        // Rollback on error
        delete state.value.byId[newChecklist.id]
        state.value.allIds = state.value.allIds.filter(id => id !== newChecklist.id)
        state.value.error = error as Error
        throw error
      }
    }, 'Creating checklist...')
  }

  async function updateChecklist(id: string, updates: Partial<Checklist>) {
    const previousState = state.value.byId[id]
    
    if (!previousState) {
      throw new Error(`Checklist with id ${id} not found`)
    }
    
    return withLoading(async () => {
      try {
        // Optimistic update
        const updatedChecklist = {
          ...previousState,
          ...updates,
          updatedAt: new Date()
        }
        state.value.byId[id] = updatedChecklist
        
        // Persist to database
        await dbOperations.updateChecklist(id, updatedChecklist)
        
        return updatedChecklist
      } catch (error) {
        // Rollback on error
        state.value.byId[id] = previousState
        state.value.error = error as Error
        throw error
      }
    }, 'Updating checklist...')
  }

  async function deleteChecklist(id: string) {
    const previousState = state.value.byId[id]
    const previousIndex = state.value.allIds.indexOf(id)
    
    if (!previousState) {
      throw new Error(`Checklist with id ${id} not found`)
    }
    
    return withLoading(async () => {
      try {
        // Optimistic update
        delete state.value.byId[id]
        state.value.allIds = state.value.allIds.filter(i => i !== id)
        
        // Clear active if it was deleted
        if (state.value.active === id) {
          state.value.active = null
        }
        
        // Persist to database
        await dbOperations.deleteChecklist(id)
      } catch (error) {
        // Rollback on error
        state.value.byId[id] = previousState
        state.value.allIds.splice(previousIndex, 0, id)
        state.value.error = error as Error
        throw error
      }
    }, 'Deleting checklist...')
  }

  function setActive(id: string | null) {
    state.value.active = id
  }

  function setFilter(filter: Partial<ChecklistsState['filter']>) {
    state.value.filter = {
      ...state.value.filter,
      ...filter
    }
  }

  function setSort(field: keyof Checklist, order: 'asc' | 'desc' = 'asc') {
    state.value.sort = { field, order }
  }

  function clearError() {
    state.value.error = null
  }

  // Task-specific actions
  async function updateTask(checklistId: string, taskId: string, updates: Partial<Task>) {
    const checklist = state.value.byId[checklistId]
    if (!checklist) {
      throw new Error(`Checklist with id ${checklistId} not found`)
    }
    
    const taskIndex = checklist.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error(`Task with id ${taskId} not found`)
    }
    
    const updatedTasks = [...checklist.tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      ...updates
    }
    
    // Calculate new completion percentage
    const completedTasks = updatedTasks.filter(t => t.completed).length
    const completionPercentage = (completedTasks / updatedTasks.length) * 100
    
    return updateChecklist(checklistId, {
      tasks: updatedTasks,
      completionPercentage
    })
  }

  async function bulkUpdateTasks(checklistId: string, taskIds: string[], updates: Partial<Task>) {
    const checklist = state.value.byId[checklistId]
    if (!checklist) {
      throw new Error(`Checklist with id ${checklistId} not found`)
    }
    
    const updatedTasks = checklist.tasks.map(task => {
      if (taskIds.includes(task.id)) {
        return { ...task, ...updates }
      }
      return task
    })
    
    // Calculate new completion percentage
    const completedTasks = updatedTasks.filter(t => t.completed).length
    const completionPercentage = (completedTasks / updatedTasks.length) * 100
    
    return updateChecklist(checklistId, {
      tasks: updatedTasks,
      completionPercentage
    })
  }

  // Initialize store
  async function init() {
    await fetchChecklists()
  }

  return {
    // State
    state,
    isLoading,
    
    // Getters
    all,
    active,
    filtered,
    statistics,
    getById,
    
    // Actions
    init,
    fetchChecklists,
    addChecklist,
    updateChecklist,
    deleteChecklist,
    setActive,
    setFilter,
    setSort,
    clearError,
    updateTask,
    bulkUpdateTasks
  }
})