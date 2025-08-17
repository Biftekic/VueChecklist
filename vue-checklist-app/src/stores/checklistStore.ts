import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { databaseService } from '@/services/database'
import { useAppStore } from './app'

// Types
export interface ClientInfo {
  name: string
  frequency?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
}

export interface Room {
  id: string
  name: string
  category?: string
  floor?: number
  selected?: boolean
}

export interface Task {
  id: string
  roomId?: string
  name: string
  description?: string
  estimatedTime: number
  adjustedTime?: number
  completed?: boolean
  category?: string
  priority?: 'low' | 'medium' | 'high'
  frequency?: string
  supplies?: string[]
  instructions?: string[]
  quality?: {
    checkItems?: string[]
    standards?: string[]
  }
}

export interface CurrentChecklist {
  industry: string | null
  propertySize: number | null
  numberOfFloors: number | null
  difficulty: 'Light' | 'Average' | 'Heavy'
  expectations: 'Very Reasonable' | 'Reasonable' | 'Demanding' | 'Very Demanding'
  challenges: 'Very Easy' | 'Easy' | 'Moderate' | 'Hard' | 'Very Hard'
  selectedRooms: Room[]
  selectedTasks: Task[]
  clientInfo: ClientInfo | null
  name: string | null
}

export interface Checklist extends CurrentChecklist {
  id: string
  createdAt: Date
  updatedAt?: Date
  status: 'active' | 'completed' | 'archived'
  clientName?: string
  frequency?: string
  completedTasks?: number
  totalTasks?: number
  estimatedDuration?: number
}

export const useChecklistStore = defineStore('checklist', () => {
  // State
  const checklists: Ref<Checklist[]> = ref([])
  const currentChecklist: Ref<CurrentChecklist> = ref({
    industry: null,
    propertySize: null,
    numberOfFloors: null,
    difficulty: 'Average',
    expectations: 'Reasonable',
    challenges: 'Moderate',
    selectedRooms: [],
    selectedTasks: [],
    clientInfo: null,
    name: null
  })
  const isLoading = ref(false)
  
  // Getters
  const totalChecklists: ComputedRef<number> = computed(() => checklists.value.length)
  const activeChecklists: ComputedRef<Checklist[]> = computed(() => 
    checklists.value.filter(c => c.status === 'active')
  )
  
  // Time multiplier calculation
  const getTimeMultiplier = (): number => {
    const difficultyMultipliers: Record<string, number> = {
      'Light': 0.8,
      'Average': 1.0,
      'Heavy': 1.3
    }
    
    const expectationsMultipliers: Record<string, number> = {
      'Very Reasonable': 0.9,
      'Reasonable': 1.0,
      'Demanding': 1.2,
      'Very Demanding': 1.4
    }
    
    const challengesMultipliers: Record<string, number> = {
      'Very Easy': 0.8,
      'Easy': 0.9,
      'Moderate': 1.0,
      'Hard': 1.15,
      'Very Hard': 1.3
    }
    
    const difficultyMult = difficultyMultipliers[currentChecklist.value.difficulty] || 1.0
    const expectationsMult = expectationsMultipliers[currentChecklist.value.expectations] || 1.0
    const challengesMult = challengesMultipliers[currentChecklist.value.challenges] || 1.0
    
    return difficultyMult * expectationsMult * challengesMult
  }
  
  // Actions
  const setIndustry = (industry: string) => {
    currentChecklist.value.industry = industry
  }
  
  const setPropertyDetails = (details: Partial<CurrentChecklist>) => {
    currentChecklist.value = {
      ...currentChecklist.value,
      ...details
    }
  }
  
  const setSelectedRooms = (rooms: Room[]) => {
    currentChecklist.value.selectedRooms = rooms
  }
  
  const setSelectedTasks = (tasks: Task[]) => {
    const multiplier = getTimeMultiplier()
    currentChecklist.value.selectedTasks = tasks.map((task: Task) => ({
      ...task,
      adjustedTime: Math.round(task.estimatedTime * multiplier)
    }))
  }
  
  const updateClientInfo = (info: ClientInfo) => {
    currentChecklist.value.clientInfo = info
  }
  
  const updateChecklistName = (name: string) => {
    currentChecklist.value.name = name
  }
  
  const saveChecklist = async (): Promise<string> => {
    try {
      const checklistData = {
        ...currentChecklist.value,
        clientName: currentChecklist.value.clientInfo?.name,
        frequency: currentChecklist.value.clientInfo?.frequency
      }
      
      const id = await databaseService.saveChecklist(checklistData)
      
      // Save tasks
      if (currentChecklist.value.selectedTasks?.length > 0) {
        await databaseService.saveTasks(currentChecklist.value.selectedTasks, id)
      }
      
      // Save client if new
      if (currentChecklist.value.clientInfo?.name) {
        await databaseService.saveClient(currentChecklist.value.clientInfo)
      }
      
      // Reload checklists
      await loadChecklists()
      
      // Clear current checklist
      resetCurrentChecklist()
      
      return id
    } catch (error) {
      console.error('Error saving checklist:', error)
      throw error
    }
  }
  
  const saveAsTemplate = async (name: string): Promise<string> => {
    try {
      const templateData = {
        name,
        industry: currentChecklist.value.industry,
        rooms: currentChecklist.value.selectedRooms,
        tasks: currentChecklist.value.selectedTasks
      }
      
      const id = await databaseService.saveTemplate(templateData)
      
      // Save tasks
      if (currentChecklist.value.selectedTasks?.length > 0) {
        await databaseService.saveTasks(currentChecklist.value.selectedTasks, null, id)
      }
      
      return id
    } catch (error) {
      console.error('Error saving template:', error)
      throw error
    }
  }
  
  const loadChecklists = async () => {
    isLoading.value = true
    try {
      const data = await databaseService.getAllChecklists()
      checklists.value = data
    } catch (error) {
      console.error('Error loading checklists:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const loadChecklist = async (id: string): Promise<Checklist | undefined> => {
    try {
      const checklist = await databaseService.getChecklist(id)
      if (checklist) {
        // Load tasks for the checklist
        const tasks = await databaseService.getTasksByChecklistId(id)
        checklist.selectedTasks = tasks
      }
      return checklist
    } catch (error) {
      console.error('Error loading checklist:', error)
      throw error
    }
  }
  
  const deleteChecklist = async (id: string) => {
    try {
      await databaseService.deleteChecklist(id)
      await loadChecklists()
    } catch (error) {
      console.error('Error deleting checklist:', error)
      throw error
    }
  }
  
  const updateTaskStatus = async (checklistId: string, taskId: string, completed: boolean) => {
    try {
      await databaseService.updateTaskStatus(taskId, completed)
      
      // Update local state
      const checklist = checklists.value.find(c => c.id === checklistId)
      if (checklist) {
        const task = checklist.selectedTasks?.find(t => t.id === taskId)
        if (task) {
          task.completed = completed
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      throw error
    }
  }
  
  const resetCurrentChecklist = () => {
    currentChecklist.value = {
      industry: null,
      propertySize: null,
      numberOfFloors: null,
      difficulty: 'Average',
      expectations: 'Reasonable',
      challenges: 'Moderate',
      selectedRooms: [],
      selectedTasks: [],
      clientInfo: null,
      name: null
    }
  }
  
  // Initialize on store creation
  loadChecklists()
  
  return {
    // State
    checklists,
    currentChecklist,
    isLoading,
    
    // Getters
    totalChecklists,
    activeChecklists,
    getTimeMultiplier,
    
    // Actions
    setIndustry,
    setPropertyDetails,
    setSelectedRooms,
    setSelectedTasks,
    updateClientInfo,
    updateChecklistName,
    saveChecklist,
    saveAsTemplate,
    loadChecklists,
    loadChecklist,
    deleteChecklist,
    updateTaskStatus,
    resetCurrentChecklist
  }
})