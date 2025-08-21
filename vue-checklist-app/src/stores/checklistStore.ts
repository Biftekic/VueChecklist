import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { databaseService } from '@/services/database'
import { useAppStore } from './app'
import { logger } from '@/services/logger'

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
  
  const updatePropertyDetails = (details: Partial<CurrentChecklist>) => {
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
  
  const updateSelectedTasks = (tasks: Task[]) => {
    // Similar to setSelectedTasks but used for updating existing tasks
    const multiplier = getTimeMultiplier()
    currentChecklist.value.selectedTasks = tasks.map((task: Task) => ({
      ...task,
      adjustedTime: task.adjustedTime || Math.round(task.estimatedTime * multiplier)
    }))
  }
  
  const updateClientInfo = (info: ClientInfo) => {
    currentChecklist.value.clientInfo = info
  }
  
  const updateChecklistName = (name: string) => {
    currentChecklist.value.name = name
  }
  
  // Helper methods for tracking customizations
  const getModifiedTasks = () => {
    // Track tasks that have been modified from their original state
    // For now, return empty array as we're not tracking modifications yet
    return []
  }
  
  const getCustomTasks = () => {
    // Track tasks that were added as custom tasks
    // For now, return empty array as we're not tracking custom tasks yet
    return []
  }
  
  const getRemovedTasks = () => {
    // Track tasks that were removed from the original template
    // For now, return empty array as we're not tracking removed tasks yet
    return []
  }
  
  const loadClientPreferences = async (clientId: string) => {
    try {
      const preferences = await databaseService.getClientPreferences(clientId)
      if (preferences) {
        // Apply preferences to current checklist
        if (preferences.customizations) {
          // Apply customizations here
          logger.debug('Client preferences loaded:', preferences)
        }
        return preferences
      }
    } catch (error) {
      logger.error('Error loading client preferences:', error)
    }
    return null
  }
  
  const saveChecklist = async (): Promise<string> => {
    try {
      // Extract customizations by comparing with original template
      const customizations = {
        modifiedTasks: getModifiedTasks(),
        addedTasks: getCustomTasks(),
        removedTasks: getRemovedTasks()
      }
      
      // Generate a default name if not set
      const checklistName = currentChecklist.value.name || 
        (currentChecklist.value.clientInfo?.name ? 
          `${currentChecklist.value.clientInfo.name} - ${new Date().toLocaleDateString()}` : 
          `Checklist - ${new Date().toLocaleDateString()}`)
      
      // Create a clean checklist data object without Vue reactive properties
      const checklistData = {
        name: checklistName,
        clientName: currentChecklist.value.clientInfo?.name,
        clientId: undefined, // Don't use clientInfo.id as it doesn't exist yet
        industry: currentChecklist.value.industry,
        propertySize: currentChecklist.value.propertySize,
        numberOfFloors: currentChecklist.value.numberOfFloors,
        difficulty: currentChecklist.value.difficulty,
        expectations: currentChecklist.value.expectations,
        challenges: currentChecklist.value.challenges,
        frequency: currentChecklist.value.clientInfo?.frequency,
        templateUsed: currentChecklist.value.industry,
        customizations,
        // Don't include selectedRooms and selectedTasks here - they'll be saved separately
        status: 'active'
      }
      
      logger.debug('Saving checklist data:', checklistData)
      
      // Debug: Log the exact structure being saved
      logger.debug('Debug - Selected rooms:', currentChecklist.value.selectedRooms)
      logger.debug('Debug - Selected tasks:', currentChecklist.value.selectedTasks)
      logger.debug('Debug - Client info:', currentChecklist.value.clientInfo)
      
      try {
        // Clean the data to ensure it's serializable
        const cleanData = JSON.parse(JSON.stringify(checklistData))
        logger.debug('Cleaned data for save:', cleanData)
        
        const id = await databaseService.saveChecklist(cleanData)
        logger.debug('Checklist saved with ID:', id)
        
        // Save tasks
        if (currentChecklist.value.selectedTasks?.length > 0) {
          // Clean tasks data to remove Vue reactive properties
          const cleanTasks = JSON.parse(JSON.stringify(currentChecklist.value.selectedTasks))
          await databaseService.saveTasks(cleanTasks, id)
          logger.debug('Tasks saved for checklist:', id)
        }
        
        // Save client if new
        if (currentChecklist.value.clientInfo?.name) {
          // Extract only the fields that the client record expects
          const clientData = {
            name: currentChecklist.value.clientInfo.name,
            email: currentChecklist.value.clientInfo.email,
            phone: currentChecklist.value.clientInfo.phone,
            address: currentChecklist.value.clientInfo.address
          }
          const clientId = await databaseService.saveClient(clientData)
          logger.debug('Client saved with ID:', clientId)
          
          // Save client preferences for future use
          if (clientId && customizations) {
            await databaseService.saveClientPreferences(clientId, {
              customizations,
              templateUsed: currentChecklist.value.industry,
              industry: currentChecklist.value.industry,
              frequency: currentChecklist.value.clientInfo?.frequency
            })
          }
        }
        
        // Reload checklists
        await loadChecklists()
        
        // Clear current checklist
        resetCurrentChecklist()
        
        return id
      } catch (innerError) {
        logger.error('Detailed error during save:', innerError)
        throw innerError
      }
    } catch (error) {
      logger.error('Error saving checklist:', error)
      throw error
    }
  }
  
  const saveAsTemplate = async (name: string): Promise<string> => {
    try {
      const templateData = {
        name,
        industry: currentChecklist.value.industry || '',
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
      logger.error('Error saving template:', error)
      throw error
    }
  }
  
  const loadChecklists = async () => {
    isLoading.value = true
    try {
      const data = await databaseService.getAllChecklists()
      logger.debug('Loaded from database:', data)
      // Transform ChecklistRecord to Checklist
      checklists.value = data.map(record => ({
        id: record.id || '',
        name: record.name || null,
        industry: record.industry || null,
        propertySize: null,
        numberOfFloors: null,
        difficulty: 'Average' as const,
        expectations: 'Reasonable' as const,
        challenges: 'Moderate' as const,
        selectedRooms: [],
        selectedTasks: [],
        clientInfo: record.clientName ? { name: record.clientName } : null,
        createdAt: record.createdAt ? new Date(record.createdAt) : new Date(),
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : undefined,
        status: (record.status as 'active' | 'completed' | 'archived') || 'active',
        clientName: record.clientName,
        frequency: record.frequency,
        qualityScore: record.qualityScore
      }))
      logger.debug('Store checklists after load:', checklists.value)
    } catch (error) {
      logger.error('Error loading checklists:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const loadChecklist = async (id: string): Promise<Checklist | undefined> => {
    try {
      const record = await databaseService.getChecklist(id)
      if (record) {
        // Load tasks for the checklist
        const taskRecords = await databaseService.getTasksByChecklistId(id)
        const tasks: Task[] = taskRecords.map(tr => ({
          id: tr.id || '',
          roomId: tr.room,
          name: tr.name,
          description: '',
          estimatedTime: tr.estimatedTime || 0,
          completed: false,
          chemicals: tr.chemicals || [],
          tools: tr.tools || []
        }))
        
        // Transform ChecklistRecord to Checklist
        const checklist: Checklist = {
          id: record.id || id,
          name: record.name || null,
          industry: record.industry || null,
          propertySize: null,
          numberOfFloors: null,
          difficulty: 'Average' as const,
          expectations: 'Reasonable' as const,
          challenges: 'Moderate' as const,
          selectedRooms: [],
          selectedTasks: tasks,
          clientInfo: record.clientName ? { name: record.clientName } : null,
          createdAt: record.createdAt ? new Date(record.createdAt) : new Date(),
          updatedAt: record.updatedAt ? new Date(record.updatedAt) : undefined,
          status: (record.status as 'active' | 'completed' | 'archived') || 'active',
          clientName: record.clientName,
          frequency: record.frequency,
          qualityScore: record.qualityScore
        }
        return checklist
      }
      return undefined
    } catch (error) {
      logger.error('Error loading checklist:', error)
      throw error
    }
  }
  
  const deleteChecklist = async (id: string) => {
    try {
      await databaseService.deleteChecklist(id)
      await loadChecklists()
    } catch (error) {
      logger.error('Error deleting checklist:', error)
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
      logger.error('Error updating task status:', error)
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
  
  // Don't auto-initialize - let components call loadChecklists when needed
  // This prevents errors during app initialization
  // loadChecklists()
  
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
    updatePropertyDetails,
    setSelectedRooms,
    setSelectedTasks,
    updateSelectedTasks,
    updateClientInfo,
    updateChecklistName,
    loadClientPreferences,
    saveChecklist,
    saveAsTemplate,
    loadChecklists,
    loadChecklist,
    deleteChecklist,
    updateTaskStatus,
    resetCurrentChecklist
  }
})