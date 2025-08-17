// Inventory Management Service
import { db } from './database'

// Supply categories
export const SupplyCategories = {
  CHEMICALS: 'Chemicals',
  TOOLS: 'Tools & Equipment',
  CONSUMABLES: 'Consumables',
  SAFETY: 'Safety Equipment',
  PAPER: 'Paper Products',
  OTHER: 'Other'
} as const

// Unit types
export const UnitTypes = {
  BOTTLE: 'bottle',
  GALLON: 'gallon',
  LITER: 'liter',
  OUNCE: 'ounce',
  POUND: 'pound',
  KILOGRAM: 'kilogram',
  PIECE: 'piece',
  PACK: 'pack',
  BOX: 'box',
  ROLL: 'roll',
  CASE: 'case'
} as const

// Equipment status
export const EquipmentStatus = {
  GOOD: 'good',
  FAIR: 'fair',
  NEEDS_REPAIR: 'needs_repair',
  IN_REPAIR: 'in_repair',
  RETIRED: 'retired'
} as const

export type SupplyCategory = typeof SupplyCategories[keyof typeof SupplyCategories]
export type UnitType = typeof UnitTypes[keyof typeof UnitTypes]
export type EquipmentStatusType = typeof EquipmentStatus[keyof typeof EquipmentStatus]

export interface Supply {
  id?: number
  name: string
  category: string
  unit: string
  costPerUnit: number
  usagePerTask?: number
  reorderPoint: number
  reorderQuantity: number
  hazardous?: boolean
  msds?: string
  currentStock: number
  lastRestocked: string
  type: 'supply'
  createdAt: string
  updatedAt: string
}

export interface Equipment {
  id?: number
  name: string
  category: string
  unit: string
  costPerUnit: number
  maintenanceInterval: number
  lifespan: number
  purchaseDate: string
  status: EquipmentStatusType
  lastMaintenance: string
  type: 'equipment'
  createdAt: string
  updatedAt: string
}

export interface UsageRecord {
  supplyId: number
  checklistId: string
  quantity: number
  date: string
  cost: number
}

export interface ReorderAlert {
  id?: number
  supplyId: number
  supplyName: string
  currentStock: number
  reorderPoint: number
  reorderQuantity: number
  estimatedCost: number
  status: 'pending' | 'completed'
  createdAt: string
  completedAt?: string
  actualCost?: number
  actualQuantity?: number
}

export interface MaintenanceAlert {
  id?: number
  equipmentId: number
  equipmentName: string
  type: string
  priority: 'high' | 'normal'
  description: string
  status: 'pending' | 'completed'
  createdAt: string
  completedAt?: string
  notes?: string
  cost?: number
}

export interface CostBreakdown {
  totalCost: number
  itemCount: number
  breakdown: UsageRecord[]
}

export interface MonthlyCosts {
  supplies: number
  reorders: number
  maintenance: number
  total: number
}

export interface DailyUsage {
  [day: string]: {
    quantity: number
    cost: number
  }
}

export interface TopSupply {
  supplyId: number
  name: string
  totalQuantity: number
  totalCost: number
  usageCount: number
}

export interface InventoryValue {
  supplies: number
  equipment: number
  total: number
}

export interface SupplyPrediction {
  supplyId: number
  name: string
  currentStock: number
  dailyAverage: number
  predictedUsage: number
  daysUntilEmpty: number
  needsReorder: boolean
}

export interface UsageItem {
  supplyId: number
  quantity?: number
}

// Common cleaning chemicals with default properties
export const CommonSupplies = {
  chemicals: [
    {
      name: 'All-Purpose Cleaner',
      category: 'Chemicals',
      unit: 'gallon',
      costPerUnit: 12.99,
      usagePerTask: 0.1,
      reorderPoint: 5,
      reorderQuantity: 10,
      hazardous: false,
      msds: 'https://example.com/msds/all-purpose'
    },
    {
      name: 'Glass Cleaner',
      category: 'Chemicals',
      unit: 'bottle',
      costPerUnit: 4.99,
      usagePerTask: 0.25,
      reorderPoint: 10,
      reorderQuantity: 24,
      hazardous: false
    },
    {
      name: 'Disinfectant',
      category: 'Chemicals',
      unit: 'gallon',
      costPerUnit: 24.99,
      usagePerTask: 0.15,
      reorderPoint: 8,
      reorderQuantity: 12,
      hazardous: true,
      msds: 'https://example.com/msds/disinfectant'
    },
    {
      name: 'Floor Cleaner',
      category: 'Chemicals',
      unit: 'gallon',
      costPerUnit: 18.99,
      usagePerTask: 0.2,
      reorderPoint: 6,
      reorderQuantity: 12,
      hazardous: false
    },
    {
      name: 'Bathroom Cleaner',
      category: 'Chemicals',
      unit: 'bottle',
      costPerUnit: 6.99,
      usagePerTask: 0.3,
      reorderPoint: 12,
      reorderQuantity: 24,
      hazardous: true
    },
    {
      name: 'Degreaser',
      category: 'Chemicals',
      unit: 'gallon',
      costPerUnit: 32.99,
      usagePerTask: 0.1,
      reorderPoint: 4,
      reorderQuantity: 8,
      hazardous: true
    }
  ],
  consumables: [
    {
      name: 'Microfiber Cloths',
      category: 'Consumables',
      unit: 'pack',
      costPerUnit: 14.99,
      usagePerTask: 0.1,
      reorderPoint: 5,
      reorderQuantity: 10
    },
    {
      name: 'Paper Towels',
      category: 'Paper Products',
      unit: 'case',
      costPerUnit: 45.99,
      usagePerTask: 0.05,
      reorderPoint: 3,
      reorderQuantity: 6
    },
    {
      name: 'Toilet Paper',
      category: 'Paper Products',
      unit: 'case',
      costPerUnit: 38.99,
      usagePerTask: 0.02,
      reorderPoint: 2,
      reorderQuantity: 4
    },
    {
      name: 'Trash Bags (Large)',
      category: 'Consumables',
      unit: 'box',
      costPerUnit: 24.99,
      usagePerTask: 0.2,
      reorderPoint: 5,
      reorderQuantity: 10
    },
    {
      name: 'Mop Heads',
      category: 'Consumables',
      unit: 'piece',
      costPerUnit: 8.99,
      usagePerTask: 0.05,
      reorderPoint: 10,
      reorderQuantity: 20
    },
    {
      name: 'Gloves (Disposable)',
      category: 'Safety Equipment',
      unit: 'box',
      costPerUnit: 12.99,
      usagePerTask: 0.5,
      reorderPoint: 10,
      reorderQuantity: 20
    }
  ],
  equipment: [
    {
      name: 'Vacuum Cleaner',
      category: 'Tools & Equipment',
      unit: 'piece',
      costPerUnit: 299.99,
      maintenanceInterval: 90, // days
      lifespan: 1095 // days (3 years)
    },
    {
      name: 'Floor Buffer',
      category: 'Tools & Equipment',
      unit: 'piece',
      costPerUnit: 899.99,
      maintenanceInterval: 60,
      lifespan: 1825 // 5 years
    },
    {
      name: 'Mop Bucket & Wringer',
      category: 'Tools & Equipment',
      unit: 'piece',
      costPerUnit: 89.99,
      maintenanceInterval: 180,
      lifespan: 730 // 2 years
    },
    {
      name: 'Cleaning Cart',
      category: 'Tools & Equipment',
      unit: 'piece',
      costPerUnit: 249.99,
      maintenanceInterval: 365,
      lifespan: 1825 // 5 years
    },
    {
      name: 'Ladder (6ft)',
      category: 'Tools & Equipment',
      unit: 'piece',
      costPerUnit: 149.99,
      maintenanceInterval: 365,
      lifespan: 3650 // 10 years
    }
  ]
}

// Inventory Management Class
class InventoryService {
  // Initialize inventory with common supplies
  async initializeInventory(): Promise<void> {
    const existingSupplies = await db.inventory.count()
    if (existingSupplies > 0) return
    
    const allSupplies = [
      ...CommonSupplies.chemicals,
      ...CommonSupplies.consumables
    ]
    
    for (const supply of allSupplies) {
      await this.addSupply({
        ...supply,
        currentStock: supply.reorderPoint * 2,
        lastRestocked: new Date().toISOString()
      })
    }
    
    for (const equipment of CommonSupplies.equipment) {
      await this.addEquipment({
        ...equipment,
        purchaseDate: new Date().toISOString(),
        status: EquipmentStatus.GOOD,
        lastMaintenance: new Date().toISOString()
      })
    }
  }
  
  // Supply Management
  async addSupply(supply: Omit<Supply, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Supply> {
    const now = new Date().toISOString()
    const newSupply: Omit<Supply, 'id'> = {
      ...supply,
      type: 'supply',
      createdAt: now,
      updatedAt: now
    }
    const id = await db.inventory.add(newSupply)
    return { ...newSupply, id }
  }
  
  async updateSupply(id: number, updates: Partial<Supply>): Promise<void> {
    await db.inventory.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }
  
  async getSupply(id: number): Promise<Supply | undefined> {
    return await db.inventory.get(id)
  }
  
  async getAllSupplies(): Promise<Supply[]> {
    return await db.inventory
      .where('type')
      .equals('supply')
      .toArray()
  }
  
  async getSuppliesByCategory(category: string): Promise<Supply[]> {
    return await db.inventory
      .where('category')
      .equals(category)
      .and(item => item.type === 'supply')
      .toArray()
  }
  
  // Equipment Management
  async addEquipment(equipment: Omit<Equipment, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Equipment> {
    const now = new Date().toISOString()
    const newEquipment: Omit<Equipment, 'id'> = {
      ...equipment,
      type: 'equipment',
      createdAt: now,
      updatedAt: now
    }
    const id = await db.equipment.add(newEquipment)
    return { ...newEquipment, id }
  }
  
  async updateEquipment(id: number, updates: Partial<Equipment>): Promise<void> {
    await db.equipment.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }
  
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return await db.equipment.get(id)
  }
  
  async getAllEquipment(): Promise<Equipment[]> {
    return await db.equipment.toArray()
  }
  
  async getEquipmentByStatus(status: EquipmentStatusType): Promise<Equipment[]> {
    return await db.equipment
      .where('status')
      .equals(status)
      .toArray()
  }
  
  // Usage Tracking
  async recordUsage(checklistId: string, items: UsageItem[]): Promise<UsageRecord[]> {
    const usageRecords: UsageRecord[] = []
    
    for (const item of items) {
      const supply = await this.getSupply(item.supplyId)
      if (!supply) continue
      
      const usage: UsageRecord = {
        supplyId: item.supplyId,
        checklistId,
        quantity: item.quantity || supply.usagePerTask || 0,
        date: new Date().toISOString(),
        cost: (item.quantity || supply.usagePerTask || 0) * supply.costPerUnit
      }
      
      usageRecords.push(usage)
      
      // Update current stock
      const newStock = supply.currentStock - usage.quantity
      await this.updateSupply(item.supplyId, {
        currentStock: newStock
      })
      
      // Check if reorder needed
      if (newStock <= supply.reorderPoint) {
        await this.createReorderAlert(supply)
      }
    }
    
    // Save usage records
    await db.usageHistory.bulkAdd(usageRecords)
    
    return usageRecords
  }
  
  // Reorder Management
  async createReorderAlert(supply: Supply): Promise<ReorderAlert | undefined> {
    const existingAlert = await db.reorderAlerts
      .where('supplyId')
      .equals(supply.id!)
      .and(alert => alert.status === 'pending')
      .first()
    
    if (existingAlert) return
    
    const alert: Omit<ReorderAlert, 'id'> = {
      supplyId: supply.id!,
      supplyName: supply.name,
      currentStock: supply.currentStock,
      reorderPoint: supply.reorderPoint,
      reorderQuantity: supply.reorderQuantity,
      estimatedCost: supply.reorderQuantity * supply.costPerUnit,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    const id = await db.reorderAlerts.add(alert)
    return { ...alert, id }
  }
  
  async getReorderAlerts(): Promise<ReorderAlert[]> {
    return await db.reorderAlerts
      .where('status')
      .equals('pending')
      .toArray()
  }
  
  async completeReorder(alertId: number, actualCost: number, quantity: number): Promise<boolean> {
    const alert = await db.reorderAlerts.get(alertId)
    if (!alert) return false
    
    // Update supply stock
    const supply = await this.getSupply(alert.supplyId)
    if (supply) {
      await this.updateSupply(alert.supplyId, {
        currentStock: supply.currentStock + quantity,
        lastRestocked: new Date().toISOString()
      })
    }
    
    // Mark alert as completed
    await db.reorderAlerts.update(alertId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      actualCost,
      actualQuantity: quantity
    })
    
    return true
  }
  
  // Equipment Maintenance
  async scheduleMaintenanceCheck(): Promise<MaintenanceAlert[]> {
    const equipment = await this.getAllEquipment()
    const maintenanceAlerts: MaintenanceAlert[] = []
    
    for (const item of equipment) {
      if (item.status === EquipmentStatus.RETIRED) continue
      
      const lastMaintenance = new Date(item.lastMaintenance || item.purchaseDate)
      const daysSince = Math.floor((new Date().getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysSince >= item.maintenanceInterval) {
        const alert = await this.createMaintenanceAlert(item)
        if (alert) maintenanceAlerts.push(alert)
      }
    }
    
    return maintenanceAlerts
  }
  
  async createMaintenanceAlert(equipment: Equipment): Promise<MaintenanceAlert | undefined> {
    const existingAlert = await db.maintenanceAlerts
      .where('equipmentId')
      .equals(equipment.id!)
      .and(alert => alert.status === 'pending')
      .first()
    
    if (existingAlert) return
    
    const alert: Omit<MaintenanceAlert, 'id'> = {
      equipmentId: equipment.id!,
      equipmentName: equipment.name,
      type: 'scheduled',
      priority: equipment.status === EquipmentStatus.NEEDS_REPAIR ? 'high' : 'normal',
      description: `Scheduled maintenance for ${equipment.name}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    const id = await db.maintenanceAlerts.add(alert)
    return { ...alert, id }
  }
  
  async getMaintenanceAlerts(): Promise<MaintenanceAlert[]> {
    return await db.maintenanceAlerts
      .where('status')
      .equals('pending')
      .toArray()
  }
  
  async completeMaintenance(alertId: number, notes: string, cost: number): Promise<boolean> {
    const alert = await db.maintenanceAlerts.get(alertId)
    if (!alert) return false
    
    // Update equipment
    await this.updateEquipment(alert.equipmentId, {
      lastMaintenance: new Date().toISOString(),
      status: EquipmentStatus.GOOD
    })
    
    // Complete alert
    await db.maintenanceAlerts.update(alertId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      notes,
      cost
    })
    
    // Log maintenance history
    await db.maintenanceHistory.add({
      equipmentId: alert.equipmentId,
      alertId,
      date: new Date().toISOString(),
      type: alert.type,
      notes,
      cost
    })
    
    return true
  }
  
  // Cost Calculations
  async calculateChecklistCost(checklistId: string): Promise<CostBreakdown> {
    const usage = await db.usageHistory
      .where('checklistId')
      .equals(checklistId)
      .toArray()
    
    const totalCost = usage.reduce((sum, record) => sum + record.cost, 0)
    
    return {
      totalCost,
      itemCount: usage.length,
      breakdown: usage
    }
  }
  
  async calculateMonthlyCosts(year: number, month: number): Promise<MonthlyCosts> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const usage = await db.usageHistory
      .where('date')
      .between(startDate.toISOString(), endDate.toISOString())
      .toArray()
    
    const reorders = await db.reorderAlerts
      .where('completedAt')
      .between(startDate.toISOString(), endDate.toISOString())
      .and(alert => alert.status === 'completed')
      .toArray()
    
    const maintenance = await db.maintenanceHistory
      .where('date')
      .between(startDate.toISOString(), endDate.toISOString())
      .toArray()
    
    const supplies = usage.reduce((sum, r) => sum + r.cost, 0)
    const reorderCosts = reorders.reduce((sum, r) => sum + (r.actualCost || 0), 0)
    const maintenanceCosts = maintenance.reduce((sum, r) => sum + (r.cost || 0), 0)
    
    return {
      supplies,
      reorders: reorderCosts,
      maintenance: maintenanceCosts,
      total: supplies + reorderCosts + maintenanceCosts
    }
  }
  
  // Analytics
  async getSupplyUsageTrends(supplyId: number, days: number = 30): Promise<DailyUsage> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const usage = await db.usageHistory
      .where('supplyId')
      .equals(supplyId)
      .and(record => {
        const date = new Date(record.date)
        return date >= startDate && date <= endDate
      })
      .toArray()
    
    // Group by day
    const dailyUsage: DailyUsage = {}
    usage.forEach(record => {
      const day = record.date.split('T')[0]
      if (!dailyUsage[day]) {
        dailyUsage[day] = { quantity: 0, cost: 0 }
      }
      dailyUsage[day].quantity += record.quantity
      dailyUsage[day].cost += record.cost
    })
    
    return dailyUsage
  }
  
  async getTopUsedSupplies(limit: number = 10): Promise<TopSupply[]> {
    const usage = await db.usageHistory.toArray()
    
    const supplyUsage: Record<number, TopSupply> = {}
    for (const record of usage) {
      if (!supplyUsage[record.supplyId]) {
        const supply = await this.getSupply(record.supplyId)
        supplyUsage[record.supplyId] = {
          supplyId: record.supplyId,
          name: supply?.name || 'Unknown',
          totalQuantity: 0,
          totalCost: 0,
          usageCount: 0
        }
      }
      supplyUsage[record.supplyId].totalQuantity += record.quantity
      supplyUsage[record.supplyId].totalCost += record.cost
      supplyUsage[record.supplyId].usageCount++
    }
    
    return Object.values(supplyUsage)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit)
  }
  
  async getLowStockAlerts(): Promise<Supply[]> {
    const supplies = await this.getAllSupplies()
    return supplies.filter(supply => 
      supply.currentStock <= supply.reorderPoint
    )
  }
  
  async getInventoryValue(): Promise<InventoryValue> {
    const supplies = await this.getAllSupplies()
    const equipment = await this.getAllEquipment()
    
    const supplyValue = supplies.reduce((sum, supply) => 
      sum + (supply.currentStock * supply.costPerUnit), 0
    )
    
    const equipmentValue = equipment.reduce((sum, item) => {
      if (item.status === EquipmentStatus.RETIRED) return sum
      // Depreciate equipment value based on age
      const age = Math.floor((new Date().getTime() - new Date(item.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
      const depreciationRate = age / item.lifespan
      const currentValue = item.costPerUnit * (1 - Math.min(depreciationRate, 0.9))
      return sum + currentValue
    }, 0)
    
    return {
      supplies: supplyValue,
      equipment: equipmentValue,
      total: supplyValue + equipmentValue
    }
  }
  
  // Supply prediction based on historical usage
  async predictSupplyNeeds(days: number = 30): Promise<SupplyPrediction[]> {
    const predictions: SupplyPrediction[] = []
    const supplies = await this.getAllSupplies()
    
    for (const supply of supplies) {
      const usage = await this.getSupplyUsageTrends(supply.id!, 30)
      const dailyAverage = Object.values(usage).reduce((sum, day) => 
        sum + day.quantity, 0
      ) / 30
      
      const predictedUsage = dailyAverage * days
      const daysUntilEmpty = supply.currentStock / dailyAverage
      
      predictions.push({
        supplyId: supply.id!,
        name: supply.name,
        currentStock: supply.currentStock,
        dailyAverage,
        predictedUsage,
        daysUntilEmpty: Math.floor(daysUntilEmpty),
        needsReorder: daysUntilEmpty < days
      })
    }
    
    return predictions.sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty)
  }
}

// Export singleton instance
export const inventoryService = new InventoryService()

// Export default
export default inventoryService