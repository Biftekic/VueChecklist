// Route Optimization Service for Cleaning Tasks
export interface Location {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  type: 'residential' | 'commercial' | 'medical' | 'industrial'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  timeWindows?: TimeWindow[]
  estimatedDuration: number // minutes
  notes?: string
  contact?: {
    name: string
    phone: string
    email: string
  }
  accessRequirements?: string[]
  specialInstructions?: string
}

export interface TimeWindow {
  start: string // HH:MM format
  end: string   // HH:MM format
  type: 'preferred' | 'required' | 'unavailable'
}

export interface Vehicle {
  id: string
  name: string
  capacity: number // number of locations that can be handled
  startLocation: Location
  endLocation?: Location // if different from start
  availableHours: {
    start: string // HH:MM
    end: string   // HH:MM
  }
  speedKmh: number
  costPerKm: number
  breaks?: {
    duration: number // minutes
    afterHours: number // hours worked before break needed
  }
}

export interface RouteSolution {
  id: string
  vehicle: Vehicle
  locations: RouteStop[]
  totalDistance: number // km
  totalTime: number     // minutes
  totalCost: number
  efficiency: number    // score 0-100
  startTime: string
  endTime: string
  breaks: BreakStop[]
  violations: RouteViolation[]
}

export interface RouteStop {
  location: Location
  arrivalTime: string
  departureTime: string
  order: number
  travelFromPrevious: number // minutes
  distanceFromPrevious: number // km
  waitTime?: number // if early for time window
}

export interface BreakStop {
  time: string
  duration: number
  reason: string
}

export interface RouteViolation {
  type: 'time_window' | 'capacity' | 'duration' | 'access'
  severity: 'minor' | 'major' | 'critical'
  location: string
  description: string
  suggestedFix?: string
}

export interface OptimizationOptions {
  algorithm: 'nearest_neighbor' | 'genetic' | 'simulated_annealing' | 'cluster_first'
  prioritizeTimeWindows: boolean
  allowViolations: boolean
  maxIterations?: number
  includeBreaks: boolean
  considerTraffic: boolean
  balanceWorkload: boolean
}

export interface OptimizationResult {
  solutions: RouteSolution[]
  summary: {
    totalLocations: number
    totalDistance: number
    totalTime: number
    totalCost: number
    averageEfficiency: number
    unassignedLocations: Location[]
  }
  computationTime: number
  algorithm: string
}

export interface TrafficData {
  fromLat: number
  fromLng: number
  toLat: number
  toLng: number
  duration: number // minutes
  distance: number // km
  timestamp: string
}

export interface ClusterGroup {
  id: string
  locations: Location[]
  center: {
    lat: number
    lng: number
  }
  radius: number // km
  estimatedDuration: number
}

// Distance calculation utilities
class DistanceCalculator {
  // Haversine formula for calculating distance between two points
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // Estimate travel time based on distance and average speed
  static estimateTravelTime(distance: number, speedKmh: number): number {
    return Math.round((distance / speedKmh) * 60) // minutes
  }
}

// Time utilities
class TimeUtils {
  static timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  static addMinutes(timeStr: string, minutes: number): string {
    const totalMinutes = this.timeToMinutes(timeStr) + minutes
    return this.minutesToTime(totalMinutes)
  }

  static isTimeInWindow(time: string, window: TimeWindow): boolean {
    const timeMinutes = this.timeToMinutes(time)
    const startMinutes = this.timeToMinutes(window.start)
    const endMinutes = this.timeToMinutes(window.end)
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes
  }
}

// Main Route Optimizer Service
class RouteOptimizerService {
  private trafficCache = new Map<string, TrafficData>()
  private distanceCache = new Map<string, number>()

  // Get distance between two locations (with caching)
  getDistance(from: Location, to: Location): number {
    const key = `${from.id}-${to.id}`
    
    if (this.distanceCache.has(key)) {
      return this.distanceCache.get(key)!
    }

    const distance = DistanceCalculator.calculateDistance(
      from.coordinates.lat,
      from.coordinates.lng,
      to.coordinates.lat,
      to.coordinates.lng
    )

    this.distanceCache.set(key, distance)
    return distance
  }

  // Get travel time between locations
  getTravelTime(from: Location, to: Location, vehicle: Vehicle, considerTraffic = false): number {
    const distance = this.getDistance(from, to)
    
    if (considerTraffic) {
      // In a real implementation, this would call a traffic API
      const trafficMultiplier = this.getTrafficMultiplier(from, to)
      return Math.round(DistanceCalculator.estimateTravelTime(distance, vehicle.speedKmh) * trafficMultiplier)
    }
    
    return DistanceCalculator.estimateTravelTime(distance, vehicle.speedKmh)
  }

  // Mock traffic multiplier (would use real traffic data in production)
  private getTrafficMultiplier(from: Location, to: Location): number {
    // Simulate traffic conditions based on time and location type
    const hour = new Date().getHours()
    
    if (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19) {
      // Rush hour
      return 1.3
    } else if (hour >= 10 && hour <= 16) {
      // Midday
      return 1.1
    }
    
    return 1.0 // Off-peak
  }

  // Cluster locations geographically
  clusterLocations(locations: Location[], maxClusterSize = 8): ClusterGroup[] {
    if (locations.length <= maxClusterSize) {
      return [{
        id: 'cluster-1',
        locations,
        center: this.calculateCenter(locations),
        radius: this.calculateRadius(locations),
        estimatedDuration: locations.reduce((sum, loc) => sum + loc.estimatedDuration, 0)
      }]
    }

    // Simple k-means clustering
    const numClusters = Math.ceil(locations.length / maxClusterSize)
    const clusters: ClusterGroup[] = []

    // Initialize clusters with random centers
    for (let i = 0; i < numClusters; i++) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      clusters.push({
        id: `cluster-${i + 1}`,
        locations: [],
        center: { ...randomLocation.coordinates },
        radius: 0,
        estimatedDuration: 0
      })
    }

    // Assign locations to nearest cluster center
    locations.forEach(location => {
      let nearestCluster = clusters[0]
      let minDistance = DistanceCalculator.calculateDistance(
        location.coordinates.lat,
        location.coordinates.lng,
        nearestCluster.center.lat,
        nearestCluster.center.lng
      )

      clusters.forEach(cluster => {
        const distance = DistanceCalculator.calculateDistance(
          location.coordinates.lat,
          location.coordinates.lng,
          cluster.center.lat,
          cluster.center.lng
        )
        
        if (distance < minDistance) {
          minDistance = distance
          nearestCluster = cluster
        }
      })

      nearestCluster.locations.push(location)
    })

    // Update cluster centers and calculate radius
    clusters.forEach(cluster => {
      if (cluster.locations.length > 0) {
        cluster.center = this.calculateCenter(cluster.locations)
        cluster.radius = this.calculateRadius(cluster.locations)
        cluster.estimatedDuration = cluster.locations.reduce((sum, loc) => sum + loc.estimatedDuration, 0)
      }
    })

    return clusters.filter(cluster => cluster.locations.length > 0)
  }

  private calculateCenter(locations: Location[]): { lat: number; lng: number } {
    const totalLat = locations.reduce((sum, loc) => sum + loc.coordinates.lat, 0)
    const totalLng = locations.reduce((sum, loc) => sum + loc.coordinates.lng, 0)
    
    return {
      lat: totalLat / locations.length,
      lng: totalLng / locations.length
    }
  }

  private calculateRadius(locations: Location[]): number {
    if (locations.length <= 1) return 0
    
    const center = this.calculateCenter(locations)
    const distances = locations.map(loc => 
      DistanceCalculator.calculateDistance(
        center.lat,
        center.lng,
        loc.coordinates.lat,
        loc.coordinates.lng
      )
    )
    
    return Math.max(...distances)
  }

  // Nearest Neighbor algorithm
  private solveNearestNeighbor(locations: Location[], vehicle: Vehicle, options: OptimizationOptions): RouteSolution {
    const unvisited = [...locations]
    const route: Location[] = []
    let currentLocation = vehicle.startLocation

    while (unvisited.length > 0) {
      let nearestLocation = unvisited[0]
      let minDistance = this.getDistance(currentLocation, nearestLocation)

      // Find nearest unvisited location
      unvisited.forEach(location => {
        const distance = this.getDistance(currentLocation, location)
        if (distance < minDistance) {
          minDistance = distance
          nearestLocation = location
        }
      })

      route.push(nearestLocation)
      unvisited.splice(unvisited.indexOf(nearestLocation), 1)
      currentLocation = nearestLocation
    }

    return this.buildRouteSolution(route, vehicle, options)
  }

  // Genetic Algorithm for route optimization
  private solveGenetic(locations: Location[], vehicle: Vehicle, options: OptimizationOptions): RouteSolution {
    const populationSize = 50
    const generations = options.maxIterations || 100
    const mutationRate = 0.1

    // Initialize population with random routes
    let population: Location[][] = []
    for (let i = 0; i < populationSize; i++) {
      const route = [...locations]
      // Shuffle array
      for (let j = route.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1))
        ;[route[j], route[k]] = [route[k], route[j]]
      }
      population.push(route)
    }

    // Evolution loop
    for (let gen = 0; gen < generations; gen++) {
      // Evaluate fitness (lower total distance is better)
      const fitness = population.map(route => {
        const solution = this.buildRouteSolution(route, vehicle, options)
        return 1 / (solution.totalDistance + 1) // Inverse fitness
      })

      // Selection and reproduction
      const newPopulation: Location[][] = []
      
      for (let i = 0; i < populationSize; i++) {
        // Tournament selection
        const parent1 = this.tournamentSelection(population, fitness)
        const parent2 = this.tournamentSelection(population, fitness)
        
        // Crossover
        let child = this.crossover(parent1, parent2)
        
        // Mutation
        if (Math.random() < mutationRate) {
          child = this.mutate(child)
        }
        
        newPopulation.push(child)
      }
      
      population = newPopulation
    }

    // Return best solution
    const finalFitness = population.map(route => {
      const solution = this.buildRouteSolution(route, vehicle, options)
      return solution.totalDistance
    })
    
    const bestIndex = finalFitness.indexOf(Math.min(...finalFitness))
    return this.buildRouteSolution(population[bestIndex], vehicle, options)
  }

  private tournamentSelection(population: Location[][], fitness: number[]): Location[] {
    const tournamentSize = 3
    let best = Math.floor(Math.random() * population.length)
    
    for (let i = 1; i < tournamentSize; i++) {
      const challenger = Math.floor(Math.random() * population.length)
      if (fitness[challenger] > fitness[best]) {
        best = challenger
      }
    }
    
    return [...population[best]]
  }

  private crossover(parent1: Location[], parent2: Location[]): Location[] {
    // Order crossover (OX)
    const start = Math.floor(Math.random() * parent1.length)
    const end = Math.floor(Math.random() * (parent1.length - start)) + start
    
    const child = new Array(parent1.length)
    
    // Copy segment from parent1
    for (let i = start; i <= end; i++) {
      child[i] = parent1[i]
    }
    
    // Fill remaining positions from parent2
    let childIndex = 0
    for (let i = 0; i < parent2.length; i++) {
      if (!child.includes(parent2[i])) {
        while (child[childIndex] !== undefined) {
          childIndex++
        }
        child[childIndex] = parent2[i]
      }
    }
    
    return child
  }

  private mutate(route: Location[]): Location[] {
    const mutated = [...route]
    
    // Swap mutation
    const i = Math.floor(Math.random() * mutated.length)
    const j = Math.floor(Math.random() * mutated.length)
    
    ;[mutated[i], mutated[j]] = [mutated[j], mutated[i]]
    
    return mutated
  }

  // Build complete route solution with timing
  private buildRouteSolution(route: Location[], vehicle: Vehicle, options: OptimizationOptions): RouteSolution {
    const stops: RouteStop[] = []
    const violations: RouteViolation[] = []
    const breaks: BreakStop[] = []
    
    let currentTime = TimeUtils.timeToMinutes(vehicle.availableHours.start)
    let currentLocation = vehicle.startLocation
    let totalDistance = 0
    let totalCost = 0
    let workingHours = 0

    route.forEach((location, index) => {
      const travelTime = this.getTravelTime(currentLocation, location, vehicle, options.considerTraffic)
      const distance = this.getDistance(currentLocation, location)
      
      currentTime += travelTime
      totalDistance += distance
      totalCost += distance * vehicle.costPerKm
      
      // Check for required break
      if (options.includeBreaks && vehicle.breaks && workingHours >= vehicle.breaks.afterHours * 60) {
        breaks.push({
          time: TimeUtils.minutesToTime(currentTime),
          duration: vehicle.breaks.duration,
          reason: 'Required break'
        })
        currentTime += vehicle.breaks.duration
        workingHours = 0
      }

      // Check time windows
      let waitTime = 0
      const arrivalTimeStr = TimeUtils.minutesToTime(currentTime)
      
      if (location.timeWindows && location.timeWindows.length > 0) {
        const requiredWindows = location.timeWindows.filter(w => w.type === 'required')
        const preferredWindows = location.timeWindows.filter(w => w.type === 'preferred')
        
        // Check if arrival is within any required window
        const inRequiredWindow = requiredWindows.some(window => 
          TimeUtils.isTimeInWindow(arrivalTimeStr, window)
        )
        
        if (requiredWindows.length > 0 && !inRequiredWindow) {
          // Find earliest available required window
          const earliestWindow = requiredWindows
            .map(w => TimeUtils.timeToMinutes(w.start))
            .filter(start => start > currentTime)
            .sort((a, b) => a - b)[0]
          
          if (earliestWindow) {
            waitTime = earliestWindow - currentTime
            currentTime = earliestWindow
            violations.push({
              type: 'time_window',
              severity: 'major',
              location: location.name,
              description: `Arrived outside required time window, had to wait ${waitTime} minutes`,
              suggestedFix: 'Reschedule or adjust route order'
            })
          } else {
            violations.push({
              type: 'time_window',
              severity: 'critical',
              location: location.name,
              description: 'Cannot meet required time window constraints',
              suggestedFix: 'Assign to different day or vehicle'
            })
          }
        }
      }

      stops.push({
        location,
        arrivalTime: TimeUtils.minutesToTime(currentTime),
        departureTime: TimeUtils.minutesToTime(currentTime + location.estimatedDuration),
        order: index + 1,
        travelFromPrevious: travelTime,
        distanceFromPrevious: distance,
        waitTime: waitTime > 0 ? waitTime : undefined
      })

      currentTime += location.estimatedDuration
      workingHours += travelTime + location.estimatedDuration + waitTime
      currentLocation = location
    })

    // Return to base if different end location
    if (vehicle.endLocation && vehicle.endLocation !== vehicle.startLocation) {
      const returnTime = this.getTravelTime(currentLocation, vehicle.endLocation, vehicle)
      const returnDistance = this.getDistance(currentLocation, vehicle.endLocation)
      currentTime += returnTime
      totalDistance += returnDistance
      totalCost += returnDistance * vehicle.costPerKm
    }

    const totalTime = currentTime - TimeUtils.timeToMinutes(vehicle.availableHours.start)
    
    // Calculate efficiency score
    const efficiency = this.calculateEfficiencyScore(stops, violations, totalTime, vehicle)

    return {
      id: `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vehicle,
      locations: stops,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime,
      totalCost: Math.round(totalCost * 100) / 100,
      efficiency,
      startTime: vehicle.availableHours.start,
      endTime: TimeUtils.minutesToTime(currentTime),
      breaks,
      violations
    }
  }

  private calculateEfficiencyScore(
    stops: RouteStop[],
    violations: RouteViolation[],
    totalTime: number,
    vehicle: Vehicle
  ): number {
    let score = 100

    // Penalize violations
    violations.forEach(violation => {
      switch (violation.severity) {
        case 'minor':
          score -= 5
          break
        case 'major':
          score -= 15
          break
        case 'critical':
          score -= 30
          break
      }
    })

    // Penalize excessive travel time vs work time
    const workTime = stops.reduce((sum, stop) => sum + stop.location.estimatedDuration, 0)
    const travelTime = totalTime - workTime
    const travelRatio = travelTime / totalTime
    
    if (travelRatio > 0.3) {
      score -= (travelRatio - 0.3) * 100
    }

    // Bonus for utilizing full capacity
    const utilizationRatio = stops.length / vehicle.capacity
    if (utilizationRatio > 0.8) {
      score += 10
    }

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  // Main optimization method
  async optimizeRoutes(
    locations: Location[],
    vehicles: Vehicle[],
    options: OptimizationOptions = {
      algorithm: 'nearest_neighbor',
      prioritizeTimeWindows: true,
      allowViolations: false,
      includeBreaks: true,
      considerTraffic: false,
      balanceWorkload: true
    }
  ): Promise<OptimizationResult> {
    const startTime = Date.now()
    const solutions: RouteSolution[] = []
    let unassignedLocations: Location[] = []

    if (options.algorithm === 'cluster_first') {
      // Cluster locations first, then solve each cluster
      const clusters = this.clusterLocations(locations, vehicles[0]?.capacity || 8)
      
      for (let i = 0; i < Math.min(clusters.length, vehicles.length); i++) {
        const cluster = clusters[i]
        const vehicle = vehicles[i]
        
        let solution: RouteSolution
        const algo = options.algorithm === 'cluster_first' ? 'nearest_neighbor' : options.algorithm
        switch (algo as 'nearest_neighbor' | 'genetic' | 'simulated_annealing') {
          case 'genetic':
            solution = this.solveGenetic(cluster.locations, vehicle, options)
            break
          default:
            solution = this.solveNearestNeighbor(cluster.locations, vehicle, options)
        }
        
        solutions.push(solution)
      }
      
      // Collect unassigned locations from clusters that don't have vehicles
      if (clusters.length > vehicles.length) {
        unassignedLocations = clusters.slice(vehicles.length)
          .flatMap(cluster => cluster.locations)
      }
    } else {
      // Assign all locations to first vehicle (single vehicle optimization)
      const vehicle = vehicles[0]
      if (!vehicle) {
        throw new Error('No vehicles provided')
      }

      let solution: RouteSolution
      switch (options.algorithm) {
        case 'genetic':
          solution = this.solveGenetic(locations, vehicle, options)
          break
        case 'simulated_annealing':
          solution = this.solveSimulatedAnnealing(locations, vehicle, options)
          break
        default:
          solution = this.solveNearestNeighbor(locations, vehicle, options)
      }
      
      solutions.push(solution)
    }

    const computationTime = Date.now() - startTime
    
    const summary = {
      totalLocations: locations.length,
      totalDistance: solutions.reduce((sum, s) => sum + s.totalDistance, 0),
      totalTime: solutions.reduce((sum, s) => sum + s.totalTime, 0),
      totalCost: solutions.reduce((sum, s) => sum + s.totalCost, 0),
      averageEfficiency: solutions.reduce((sum, s) => sum + s.efficiency, 0) / solutions.length,
      unassignedLocations
    }

    return {
      solutions,
      summary,
      computationTime,
      algorithm: options.algorithm
    }
  }

  // Simulated Annealing algorithm
  private solveSimulatedAnnealing(locations: Location[], vehicle: Vehicle, options: OptimizationOptions): RouteSolution {
    let currentRoute = [...locations]
    let bestRoute = [...currentRoute]
    
    // Shuffle initial route
    for (let i = currentRoute.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[currentRoute[i], currentRoute[j]] = [currentRoute[j], currentRoute[i]]
    }
    
    let currentSolution = this.buildRouteSolution(currentRoute, vehicle, options)
    let bestSolution = { ...currentSolution }
    
    const maxIterations = options.maxIterations || 1000
    let temperature = 1000
    const coolingRate = 0.995
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Generate neighbor solution (2-opt swap)
      const newRoute = [...currentRoute]
      const i = Math.floor(Math.random() * newRoute.length)
      const j = Math.floor(Math.random() * newRoute.length)
      
      if (i !== j) {
        [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]]
      }
      
      const newSolution = this.buildRouteSolution(newRoute, vehicle, options)
      
      // Calculate cost difference
      const deltaE = newSolution.totalDistance - currentSolution.totalDistance
      
      // Accept or reject new solution
      if (deltaE < 0 || Math.random() < Math.exp(-deltaE / temperature)) {
        currentRoute = newRoute
        currentSolution = newSolution
        
        if (newSolution.totalDistance < bestSolution.totalDistance) {
          bestRoute = [...newRoute]
          bestSolution = { ...newSolution }
        }
      }
      
      // Cool down
      temperature *= coolingRate
    }
    
    return bestSolution
  }

  // Export route to various formats
  exportRoute(solution: RouteSolution, format: 'json' | 'csv' | 'gpx' = 'json'): string {
    switch (format) {
      case 'csv':
        return this.exportToCSV(solution)
      case 'gpx':
        return this.exportToGPX(solution)
      default:
        return JSON.stringify(solution, null, 2)
    }
  }

  private exportToCSV(solution: RouteSolution): string {
    const headers = ['Order', 'Location', 'Address', 'Arrival Time', 'Departure Time', 'Duration', 'Distance From Previous']
    const rows = solution.locations.map(stop => [
      stop.order,
      stop.location.name,
      stop.location.address,
      stop.arrivalTime,
      stop.departureTime,
      stop.location.estimatedDuration,
      stop.distanceFromPrevious
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  private exportToGPX(solution: RouteSolution): string {
    const waypoints = solution.locations.map(stop => 
      `  <wpt lat="${stop.location.coordinates.lat}" lon="${stop.location.coordinates.lng}">
    <name>${stop.location.name}</name>
    <desc>${stop.location.address}</desc>
  </wpt>`
    ).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="VueChecklist Route Optimizer">
  <metadata>
    <name>Cleaning Route - ${solution.vehicle.name}</name>
    <desc>Optimized cleaning route with ${solution.locations.length} stops</desc>
  </metadata>
${waypoints}
</gpx>`
  }
}

// Export singleton instance
export const routeOptimizerService = new RouteOptimizerService()

// Export utilities
export { DistanceCalculator, TimeUtils }

// Export default
export default routeOptimizerService