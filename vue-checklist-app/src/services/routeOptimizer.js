/**
 * Route Optimizer Service
 * Optimizes cleaning routes based on room layout, task dependencies, and resource constraints
 */

export class RouteOptimizer {
  constructor() {
    // Room adjacency matrix for common layouts
    this.roomAdjacency = {
      'Entry': ['Living Room', 'Kitchen', 'Hallway'],
      'Living Room': ['Entry', 'Kitchen', 'Hallway', 'Dining Room'],
      'Kitchen': ['Entry', 'Living Room', 'Dining Room', 'Pantry'],
      'Dining Room': ['Kitchen', 'Living Room'],
      'Hallway': ['Entry', 'Living Room', 'Bedroom', 'Bathroom', 'Office'],
      'Master Bedroom': ['Master Bathroom', 'Hallway', 'Walk-in Closet'],
      'Bedroom': ['Hallway', 'Bathroom'],
      'Bathroom': ['Hallway', 'Bedroom'],
      'Master Bathroom': ['Master Bedroom'],
      'Office': ['Hallway'],
      'Laundry Room': ['Kitchen', 'Hallway'],
      'Garage': ['Entry', 'Laundry Room'],
      'Basement': ['Entry'],
      'Attic': ['Hallway']
    }

    // Floor assignments for multi-level optimization
    this.floorAssignments = {
      'Basement': -1,
      'Garage': 0,
      'Entry': 0,
      'Living Room': 0,
      'Kitchen': 0,
      'Dining Room': 0,
      'Pantry': 0,
      'Laundry Room': 0,
      'Hallway': 0,
      'Office': 0,
      'Bedroom': 1,
      'Master Bedroom': 1,
      'Bathroom': 1,
      'Master Bathroom': 1,
      'Walk-in Closet': 1,
      'Attic': 2
    }

    // Chemical compatibility matrix
    this.chemicalGroups = {
      'bleach': ['disinfectant', 'sanitizer'],
      'ammonia': ['glass-cleaner', 'degreaser'],
      'acid': ['toilet-bowl-cleaner', 'lime-remover'],
      'neutral': ['all-purpose', 'floor-cleaner', 'wood-polish']
    }

    // Task priority weights
    this.taskPriorities = {
      'DAILY': 4,
      'WEEKLY': 3,
      'MONTHLY': 2,
      'QUARTERLY': 1
    }
  }

  /**
   * Main optimization function
   * @param {Array} tasks - Array of tasks with room assignments
   * @param {Object} options - Optimization options
   * @returns {Object} Optimized route with sequence and metrics
   */
  optimizeRoute(tasks, options = {}) {
    const {
      startRoom = 'Entry',
      optimizeBy = 'distance', // 'distance', 'chemicals', 'time', 'balanced'
      groupByFloor = true,
      minimizeChemicalSwitches = true,
      prioritizeHighFrequency = true
    } = options

    // Group tasks by room
    const tasksByRoom = this.groupTasksByRoom(tasks)
    
    // Calculate room sequence based on optimization strategy
    let roomSequence = []
    switch (optimizeBy) {
      case 'chemicals':
        roomSequence = this.optimizeByChemicals(tasksByRoom, startRoom)
        break
      case 'time':
        roomSequence = this.optimizeByTime(tasksByRoom, startRoom)
        break
      case 'balanced':
        roomSequence = this.balancedOptimization(tasksByRoom, startRoom, groupByFloor)
        break
      default:
        roomSequence = this.optimizeByDistance(tasksByRoom, startRoom, groupByFloor)
    }

    // Optimize task order within each room
    const optimizedTasks = this.optimizeTasksWithinRooms(
      roomSequence, 
      tasksByRoom, 
      minimizeChemicalSwitches,
      prioritizeHighFrequency
    )

    // Calculate metrics
    const metrics = this.calculateMetrics(optimizedTasks, roomSequence)

    return {
      sequence: roomSequence,
      tasks: optimizedTasks,
      metrics,
      summary: this.generateSummary(metrics, optimizedTasks)
    }
  }

  /**
   * Group tasks by room
   */
  groupTasksByRoom(tasks) {
    const grouped = {}
    tasks.forEach(task => {
      const room = task.room || 'Unassigned'
      if (!grouped[room]) {
        grouped[room] = []
      }
      grouped[room].push(task)
    })
    return grouped
  }

  /**
   * Optimize route by minimizing travel distance
   */
  optimizeByDistance(tasksByRoom, startRoom, groupByFloor = true) {
    const rooms = Object.keys(tasksByRoom)
    
    if (groupByFloor) {
      // Group rooms by floor
      const roomsByFloor = this.groupRoomsByFloor(rooms)
      let sequence = []
      
      // Process floors in order (basement to attic)
      const floors = Object.keys(roomsByFloor).sort((a, b) => a - b)
      
      floors.forEach(floor => {
        const floorRooms = roomsByFloor[floor]
        const floorSequence = this.findShortestPath(floorRooms, 
          sequence.length > 0 ? sequence[sequence.length - 1] : startRoom)
        sequence = sequence.concat(floorSequence)
      })
      
      return sequence
    } else {
      return this.findShortestPath(rooms, startRoom)
    }
  }

  /**
   * Find shortest path through rooms using nearest neighbor algorithm
   */
  findShortestPath(rooms, startRoom) {
    const sequence = []
    const unvisited = new Set(rooms)
    let currentRoom = rooms.includes(startRoom) ? startRoom : rooms[0]
    
    while (unvisited.size > 0) {
      if (unvisited.has(currentRoom)) {
        sequence.push(currentRoom)
        unvisited.delete(currentRoom)
      }
      
      if (unvisited.size === 0) break
      
      // Find nearest unvisited room
      let nearestRoom = null
      let minDistance = Infinity
      
      unvisited.forEach(room => {
        const distance = this.getRoomDistance(currentRoom, room)
        if (distance < minDistance) {
          minDistance = distance
          nearestRoom = room
        }
      })
      
      currentRoom = nearestRoom
    }
    
    return sequence
  }

  /**
   * Calculate distance between rooms
   */
  getRoomDistance(room1, room2) {
    // If rooms are adjacent, distance is 1
    if (this.roomAdjacency[room1]?.includes(room2)) {
      return 1
    }
    
    // If on different floors, add floor difference
    const floor1 = this.floorAssignments[room1] || 0
    const floor2 = this.floorAssignments[room2] || 0
    const floorDiff = Math.abs(floor1 - floor2)
    
    // Basic heuristic: non-adjacent rooms have distance 2, plus floor difference
    return 2 + floorDiff * 2
  }

  /**
   * Group rooms by floor
   */
  groupRoomsByFloor(rooms) {
    const grouped = {}
    rooms.forEach(room => {
      const floor = this.floorAssignments[room] || 0
      if (!grouped[floor]) {
        grouped[floor] = []
      }
      grouped[floor].push(room)
    })
    return grouped
  }

  /**
   * Optimize by minimizing chemical switches
   */
  optimizeByChemicals(tasksByRoom, startRoom) {
    const rooms = Object.keys(tasksByRoom)
    const roomChemicals = {}
    
    // Determine primary chemicals for each room
    rooms.forEach(room => {
      const chemicals = new Set()
      tasksByRoom[room].forEach(task => {
        if (task.chemicals) {
          task.chemicals.forEach(chem => chemicals.add(chem.toLowerCase()))
        }
      })
      roomChemicals[room] = Array.from(chemicals)
    })
    
    // Group rooms by chemical similarity
    const sequence = []
    const unvisited = new Set(rooms)
    let currentRoom = rooms.includes(startRoom) ? startRoom : rooms[0]
    
    while (unvisited.size > 0) {
      if (unvisited.has(currentRoom)) {
        sequence.push(currentRoom)
        unvisited.delete(currentRoom)
      }
      
      if (unvisited.size === 0) break
      
      // Find room with most similar chemicals
      let bestRoom = null
      let maxSimilarity = -1
      
      unvisited.forEach(room => {
        const similarity = this.calculateChemicalSimilarity(
          roomChemicals[currentRoom] || [],
          roomChemicals[room] || []
        )
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity
          bestRoom = room
        }
      })
      
      currentRoom = bestRoom
    }
    
    return sequence
  }

  /**
   * Calculate chemical similarity between rooms
   */
  calculateChemicalSimilarity(chemicals1, chemicals2) {
    if (chemicals1.length === 0 || chemicals2.length === 0) return 0
    
    const set1 = new Set(chemicals1)
    const set2 = new Set(chemicals2)
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  /**
   * Optimize by time efficiency
   */
  optimizeByTime(tasksByRoom, startRoom) {
    const rooms = Object.keys(tasksByRoom)
    const roomTimes = {}
    
    // Calculate total time for each room
    rooms.forEach(room => {
      const totalTime = tasksByRoom[room].reduce((sum, task) => 
        sum + (task.estimatedTime || 0), 0)
      roomTimes[room] = totalTime
    })
    
    // Sort rooms by time (longest first for better load balancing)
    return rooms.sort((a, b) => roomTimes[b] - roomTimes[a])
  }

  /**
   * Balanced optimization considering multiple factors
   */
  balancedOptimization(tasksByRoom, startRoom, groupByFloor) {
    const distanceSequence = this.optimizeByDistance(tasksByRoom, startRoom, groupByFloor)
    const chemicalSequence = this.optimizeByChemicals(tasksByRoom, startRoom)
    
    // Score each sequence
    const distanceScore = this.scoreSequence(distanceSequence, tasksByRoom, 'distance')
    const chemicalScore = this.scoreSequence(chemicalSequence, tasksByRoom, 'chemical')
    
    // Return the better sequence
    return distanceScore <= chemicalScore ? distanceSequence : chemicalSequence
  }

  /**
   * Score a sequence based on criteria
   */
  scoreSequence(sequence, tasksByRoom, criteria) {
    let score = 0
    
    for (let i = 1; i < sequence.length; i++) {
      const prevRoom = sequence[i - 1]
      const currentRoom = sequence[i]
      
      if (criteria === 'distance') {
        score += this.getRoomDistance(prevRoom, currentRoom)
      } else if (criteria === 'chemical') {
        const prevChemicals = this.getRoomChemicals(tasksByRoom[prevRoom])
        const currentChemicals = this.getRoomChemicals(tasksByRoom[currentRoom])
        score += (1 - this.calculateChemicalSimilarity(prevChemicals, currentChemicals)) * 10
      }
    }
    
    return score
  }

  /**
   * Get chemicals used in a room
   */
  getRoomChemicals(tasks) {
    const chemicals = new Set()
    tasks.forEach(task => {
      if (task.chemicals) {
        task.chemicals.forEach(chem => chemicals.add(chem.toLowerCase()))
      }
    })
    return Array.from(chemicals)
  }

  /**
   * Optimize task order within each room
   */
  optimizeTasksWithinRooms(roomSequence, tasksByRoom, minimizeChemicalSwitches, prioritizeHighFrequency) {
    const optimizedTasks = []
    
    roomSequence.forEach(room => {
      let roomTasks = [...(tasksByRoom[room] || [])]
      
      // Sort by priority if requested
      if (prioritizeHighFrequency) {
        roomTasks.sort((a, b) => {
          const priorityA = this.taskPriorities[a.frequency] || 0
          const priorityB = this.taskPriorities[b.frequency] || 0
          return priorityB - priorityA
        })
      }
      
      // Group by chemical if requested
      if (minimizeChemicalSwitches) {
        roomTasks = this.groupTasksByChemical(roomTasks)
      }
      
      optimizedTasks.push({
        room,
        tasks: roomTasks,
        totalTime: roomTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0)
      })
    })
    
    return optimizedTasks
  }

  /**
   * Group tasks by chemical to minimize switches
   */
  groupTasksByChemical(tasks) {
    const chemicalGroups = {}
    const noChemicalTasks = []
    
    tasks.forEach(task => {
      if (task.chemicals && task.chemicals.length > 0) {
        const primaryChemical = task.chemicals[0].toLowerCase()
        if (!chemicalGroups[primaryChemical]) {
          chemicalGroups[primaryChemical] = []
        }
        chemicalGroups[primaryChemical].push(task)
      } else {
        noChemicalTasks.push(task)
      }
    })
    
    // Flatten groups
    const grouped = []
    Object.values(chemicalGroups).forEach(group => {
      grouped.push(...group)
    })
    grouped.push(...noChemicalTasks)
    
    return grouped
  }

  /**
   * Calculate route metrics
   */
  calculateMetrics(optimizedTasks, roomSequence) {
    let totalDistance = 0
    let chemicalSwitches = 0
    let floorChanges = 0
    let totalTime = 0
    let lastChemical = null
    let lastFloor = null
    
    // Calculate distance
    for (let i = 1; i < roomSequence.length; i++) {
      totalDistance += this.getRoomDistance(roomSequence[i - 1], roomSequence[i])
    }
    
    // Calculate other metrics
    optimizedTasks.forEach((roomData, index) => {
      const room = roomData.room
      const floor = this.floorAssignments[room] || 0
      
      // Floor changes
      if (lastFloor !== null && lastFloor !== floor) {
        floorChanges++
      }
      lastFloor = floor
      
      // Chemical switches and time
      roomData.tasks.forEach(task => {
        totalTime += task.estimatedTime || 0
        
        if (task.chemicals && task.chemicals.length > 0) {
          const chemical = task.chemicals[0].toLowerCase()
          if (lastChemical && lastChemical !== chemical) {
            chemicalSwitches++
          }
          lastChemical = chemical
        }
      })
    })
    
    return {
      totalDistance,
      chemicalSwitches,
      floorChanges,
      totalTime,
      roomCount: roomSequence.length,
      taskCount: optimizedTasks.reduce((sum, room) => sum + room.tasks.length, 0),
      efficiency: this.calculateEfficiency(totalDistance, chemicalSwitches, floorChanges)
    }
  }

  /**
   * Calculate overall efficiency score
   */
  calculateEfficiency(distance, chemicalSwitches, floorChanges) {
    // Lower scores are better
    const baseScore = 100
    const distancePenalty = distance * 2
    const chemicalPenalty = chemicalSwitches * 3
    const floorPenalty = floorChanges * 5
    
    const score = Math.max(0, baseScore - distancePenalty - chemicalPenalty - floorPenalty)
    return Math.round(score)
  }

  /**
   * Generate human-readable summary
   */
  generateSummary(metrics, optimizedTasks) {
    const hours = Math.floor(metrics.totalTime / 60)
    const minutes = metrics.totalTime % 60
    const timeStr = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
    
    return {
      description: `Optimized route through ${metrics.roomCount} rooms with ${metrics.taskCount} tasks`,
      estimatedTime: timeStr,
      efficiency: `${metrics.efficiency}% efficiency score`,
      highlights: [
        `${metrics.chemicalSwitches} chemical switches`,
        `${metrics.floorChanges} floor changes`,
        `${Math.round(metrics.totalDistance)} unit travel distance`
      ],
      recommendations: this.generateRecommendations(metrics, optimizedTasks)
    }
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(metrics, optimizedTasks) {
    const recommendations = []
    
    if (metrics.chemicalSwitches > 10) {
      recommendations.push('Consider batching tasks by chemical type to reduce switches')
    }
    
    if (metrics.floorChanges > 3) {
      recommendations.push('Complete all tasks on one floor before moving to the next')
    }
    
    if (metrics.efficiency < 50) {
      recommendations.push('Route efficiency is low - consider reorganizing task sequence')
    }
    
    if (metrics.totalTime > 240) {
      recommendations.push('Consider splitting into multiple cleaning sessions')
    }
    
    return recommendations
  }

  /**
   * Export route as shareable format
   */
  exportRoute(optimizedRoute) {
    return {
      version: '1.0',
      created: new Date().toISOString(),
      sequence: optimizedRoute.sequence,
      metrics: optimizedRoute.metrics,
      tasks: optimizedRoute.tasks.map(room => ({
        room: room.room,
        taskCount: room.tasks.length,
        time: room.totalTime,
        taskIds: room.tasks.map(t => t.id)
      }))
    }
  }
}

// Export singleton instance
export const routeOptimizer = new RouteOptimizer()