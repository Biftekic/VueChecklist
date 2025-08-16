// Quality Assurance Service
import { db } from './database'

// Inspection Templates
export const inspectionTemplates = {
  residential: {
    categories: [
      {
        name: 'General Cleanliness',
        icon: 'mdi-broom',
        weight: 0.4, // 40% of total score
        rooms: {
          'living-areas': {
            name: 'Living Areas',
            items: [
              { id: 'dust-surfaces', name: 'Dust-free surfaces', critical: true },
              { id: 'floor-clean', name: 'Floor cleanliness', critical: true },
              { id: 'windows-clean', name: 'Windows and mirrors', critical: false },
              { id: 'furniture-arranged', name: 'Furniture properly arranged', critical: false },
              { id: 'cobwebs-removed', name: 'Cobwebs removed', critical: false }
            ]
          },
          'kitchen': {
            name: 'Kitchen',
            items: [
              { id: 'countertops', name: 'Countertops sanitized', critical: true },
              { id: 'appliances', name: 'Appliances cleaned inside/out', critical: true },
              { id: 'sink-faucets', name: 'Sink and faucets shining', critical: true },
              { id: 'cabinets-clean', name: 'Cabinet fronts clean', critical: false },
              { id: 'floor-mopped', name: 'Floor thoroughly mopped', critical: true },
              { id: 'trash-empty', name: 'Trash emptied and liner replaced', critical: true }
            ]
          },
          'bathrooms': {
            name: 'Bathrooms',
            items: [
              { id: 'toilet-clean', name: 'Toilet thoroughly cleaned', critical: true },
              { id: 'shower-tub', name: 'Shower/tub no soap scum', critical: true },
              { id: 'sink-counter', name: 'Sink and counter clean', critical: true },
              { id: 'mirror-streak-free', name: 'Mirror streak-free', critical: false },
              { id: 'floor-sanitized', name: 'Floor cleaned and sanitized', critical: true },
              { id: 'supplies-stocked', name: 'Supplies restocked', critical: false }
            ]
          },
          'bedrooms': {
            name: 'Bedrooms',
            items: [
              { id: 'bed-made', name: 'Bed properly made', critical: false },
              { id: 'surfaces-dusted', name: 'All surfaces dusted', critical: true },
              { id: 'floor-vacuumed', name: 'Floor/carpet vacuumed', critical: true },
              { id: 'mirrors-clean', name: 'Mirrors clean', critical: false },
              { id: 'trash-removed', name: 'Trash removed', critical: true }
            ]
          }
        }
      },
      {
        name: 'Detailed Cleaning',
        icon: 'mdi-magnify',
        weight: 0.3, // 30% of total score
        rooms: {
          'detail-work': {
            name: 'Detail Work',
            items: [
              { id: 'baseboards', name: 'Baseboards clean', critical: false },
              { id: 'light-fixtures', name: 'Light fixtures dusted', critical: false },
              { id: 'switch-plates', name: 'Switch plates clean', critical: false },
              { id: 'door-frames', name: 'Door frames wiped', critical: false },
              { id: 'vents-clean', name: 'Air vents dust-free', critical: false },
              { id: 'window-sills', name: 'Window sills clean', critical: false }
            ]
          }
        }
      },
      {
        name: 'Organization',
        icon: 'mdi-folder-outline',
        weight: 0.15, // 15% of total score
        rooms: {
          'organization': {
            name: 'Organization',
            items: [
              { id: 'items-organized', name: 'Items properly organized', critical: false },
              { id: 'clutter-removed', name: 'Clutter removed', critical: false },
              { id: 'supplies-neat', name: 'Cleaning supplies organized', critical: false }
            ]
          }
        }
      },
      {
        name: 'Safety & Compliance',
        icon: 'mdi-shield-check',
        weight: 0.15, // 15% of total score
        rooms: {
          'safety': {
            name: 'Safety Check',
            items: [
              { id: 'no-hazards', name: 'No safety hazards present', critical: true },
              { id: 'chemicals-stored', name: 'Chemicals properly stored', critical: true },
              { id: 'equipment-secure', name: 'Equipment secured', critical: true },
              { id: 'ppe-used', name: 'PPE properly used', critical: true }
            ]
          }
        }
      }
    ]
  },
  commercial: {
    categories: [
      {
        name: 'Public Areas',
        icon: 'mdi-office-building',
        weight: 0.35,
        rooms: {
          'lobby': {
            name: 'Lobby/Reception',
            items: [
              { id: 'entrance-clean', name: 'Entrance spotless', critical: true },
              { id: 'floor-shiny', name: 'Floors clean and shiny', critical: true },
              { id: 'furniture-dusted', name: 'Furniture dusted', critical: true },
              { id: 'glass-streak-free', name: 'Glass doors/windows clean', critical: true },
              { id: 'signage-clean', name: 'Signage clean', critical: false }
            ]
          },
          'restrooms': {
            name: 'Restrooms',
            items: [
              { id: 'fixtures-sanitized', name: 'All fixtures sanitized', critical: true },
              { id: 'supplies-stocked', name: 'Supplies fully stocked', critical: true },
              { id: 'floors-dry', name: 'Floors clean and dry', critical: true },
              { id: 'odor-free', name: 'Odor-free', critical: true },
              { id: 'mirrors-clean', name: 'Mirrors streak-free', critical: false }
            ]
          }
        }
      },
      {
        name: 'Work Areas',
        icon: 'mdi-desk',
        weight: 0.35,
        rooms: {
          'offices': {
            name: 'Offices',
            items: [
              { id: 'desks-clean', name: 'Desks and surfaces clean', critical: true },
              { id: 'trash-empty', name: 'Trash bins emptied', critical: true },
              { id: 'floors-vacuumed', name: 'Floors vacuumed/mopped', critical: true },
              { id: 'electronics-dusted', name: 'Electronics carefully dusted', critical: false }
            ]
          },
          'break-room': {
            name: 'Break Room',
            items: [
              { id: 'tables-clean', name: 'Tables and chairs clean', critical: true },
              { id: 'appliances-clean', name: 'Appliances clean', critical: true },
              { id: 'sink-clean', name: 'Sink and counter clean', critical: true },
              { id: 'floor-clean', name: 'Floor clean', critical: true }
            ]
          }
        }
      },
      {
        name: 'Compliance',
        icon: 'mdi-clipboard-check',
        weight: 0.3,
        rooms: {
          'compliance': {
            name: 'Health & Safety',
            items: [
              { id: 'osha-compliance', name: 'OSHA standards met', critical: true },
              { id: 'msds-available', name: 'MSDS sheets available', critical: true },
              { id: 'ppe-compliance', name: 'PPE requirements met', critical: true },
              { id: 'documentation', name: 'Cleaning logs complete', critical: true }
            ]
          }
        }
      }
    ]
  },
  medical: {
    categories: [
      {
        name: 'Clinical Areas',
        icon: 'mdi-hospital',
        weight: 0.5,
        rooms: {
          'patient-rooms': {
            name: 'Patient Areas',
            items: [
              { id: 'high-touch-disinfected', name: 'High-touch surfaces disinfected', critical: true },
              { id: 'floor-sanitized', name: 'Floors properly sanitized', critical: true },
              { id: 'bed-rails-clean', name: 'Bed rails disinfected', critical: true },
              { id: 'bathroom-sanitized', name: 'Bathroom fully sanitized', critical: true },
              { id: 'biohazard-handled', name: 'Biohazard properly handled', critical: true }
            ]
          }
        }
      },
      {
        name: 'Infection Control',
        icon: 'mdi-biohazard',
        weight: 0.5,
        rooms: {
          'infection-control': {
            name: 'Infection Control',
            items: [
              { id: 'cdc-compliance', name: 'CDC guidelines followed', critical: true },
              { id: 'proper-chemicals', name: 'EPA-approved disinfectants used', critical: true },
              { id: 'contact-time', name: 'Proper contact time observed', critical: true },
              { id: 'cross-contamination', name: 'No cross-contamination risk', critical: true },
              { id: 'waste-disposal', name: 'Medical waste properly disposed', critical: true }
            ]
          }
        }
      }
    ]
  }
}

// Quality scoring algorithm
export function calculateQualityScore(inspection) {
  let totalScore = 0
  let totalWeight = 0
  
  inspection.categories.forEach(category => {
    let categoryScore = 0
    let categoryItems = 0
    let criticalFails = 0
    
    Object.values(category.rooms).forEach(room => {
      room.inspectionItems.forEach(item => {
        if (item.status === 'pass') {
          categoryScore += item.critical ? 2 : 1
        } else if (item.status === 'fail' && item.critical) {
          criticalFails++
        }
        if (item.status !== 'pending') {
          categoryItems += item.critical ? 2 : 1
        }
      })
    })
    
    // If any critical items fail, category score is heavily penalized
    if (criticalFails > 0) {
      categoryScore = categoryScore * 0.5
    }
    
    if (categoryItems > 0) {
      const categoryPercentage = (categoryScore / categoryItems) * 100
      totalScore += categoryPercentage * (category.weight || 0.25)
      totalWeight += category.weight || 0.25
    }
  })
  
  if (totalWeight === 0) return 0
  return Math.round(totalScore / totalWeight)
}

// Issue severity scoring
export function getIssueSeverityScore(severity) {
  const scores = {
    'Low': 5,
    'Medium': 10,
    'High': 20,
    'Critical': 50
  }
  return scores[severity] || 0
}

// Generate inspection report
export function generateInspectionReport(inspection) {
  const report = {
    checklistId: inspection.checklistId,
    inspectionDate: new Date().toISOString(),
    qualityScore: calculateQualityScore(inspection),
    categories: [],
    issues: [],
    photos: [],
    signOff: inspection.signOff,
    recommendations: []
  }
  
  // Process categories
  inspection.categories.forEach(category => {
    const categoryReport = {
      name: category.name,
      score: 0,
      passedItems: 0,
      failedItems: 0,
      pendingItems: 0,
      criticalFails: []
    }
    
    Object.values(category.rooms).forEach(room => {
      room.inspectionItems.forEach(item => {
        if (item.status === 'pass') {
          categoryReport.passedItems++
        } else if (item.status === 'fail') {
          categoryReport.failedItems++
          if (item.critical) {
            categoryReport.criticalFails.push({
              room: room.name,
              item: item.name
            })
          }
        } else {
          categoryReport.pendingItems++
        }
        
        // Collect issues
        if (item.issue) {
          report.issues.push({
            category: category.name,
            room: room.name,
            item: item.name,
            ...item.issue
          })
        }
        
        // Collect photos
        if (item.photos && item.photos.length > 0) {
          item.photos.forEach(photo => {
            report.photos.push({
              category: category.name,
              room: room.name,
              item: item.name,
              ...photo
            })
          })
        }
      })
    })
    
    // Calculate category score
    const total = categoryReport.passedItems + categoryReport.failedItems
    if (total > 0) {
      categoryReport.score = Math.round((categoryReport.passedItems / total) * 100)
    }
    
    report.categories.push(categoryReport)
  })
  
  // Generate recommendations
  if (report.qualityScore < 60) {
    report.recommendations.push('Immediate re-cleaning required for failed critical items')
    report.recommendations.push('Additional training recommended for cleaning staff')
  } else if (report.qualityScore < 75) {
    report.recommendations.push('Follow-up required on failed items')
    report.recommendations.push('Review cleaning procedures for problem areas')
  } else if (report.qualityScore < 90) {
    report.recommendations.push('Minor improvements needed in detail work')
  } else {
    report.recommendations.push('Excellent work! Maintain current standards')
  }
  
  // Add issue-specific recommendations
  const highSeverityIssues = report.issues.filter(i => i.severity === 'High' || i.severity === 'Critical')
  if (highSeverityIssues.length > 0) {
    report.recommendations.push(`Address ${highSeverityIssues.length} high-priority issues immediately`)
  }
  
  return report
}

// Save inspection to database
export async function saveInspection(inspection) {
  try {
    const report = generateInspectionReport(inspection)
    
    // Save to inspections table
    await db.inspections.add({
      ...report,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Update checklist status if quality score is high
    if (report.qualityScore >= 75) {
      await db.checklists.update(inspection.checklistId, {
        status: 'completed',
        completedAt: new Date(),
        qualityScore: report.qualityScore
      })
    }
    
    return report
  } catch (error) {
    console.error('Error saving inspection:', error)
    throw error
  }
}

// Get inspection history
export async function getInspectionHistory(checklistId) {
  try {
    const inspections = await db.inspections
      .where('checklistId')
      .equals(checklistId)
      .reverse()
      .sortBy('createdAt')
    
    return inspections
  } catch (error) {
    console.error('Error fetching inspection history:', error)
    return []
  }
}

// Compare inspections (before/after)
export function compareInspections(before, after) {
  const comparison = {
    scoreImprovement: after.qualityScore - before.qualityScore,
    issuesResolved: [],
    newIssues: [],
    persistentIssues: []
  }
  
  // Find resolved issues
  before.issues.forEach(beforeIssue => {
    const stillExists = after.issues.find(afterIssue => 
      afterIssue.item === beforeIssue.item && 
      afterIssue.room === beforeIssue.room
    )
    if (!stillExists) {
      comparison.issuesResolved.push(beforeIssue)
    } else {
      comparison.persistentIssues.push(beforeIssue)
    }
  })
  
  // Find new issues
  after.issues.forEach(afterIssue => {
    const existedBefore = before.issues.find(beforeIssue => 
      beforeIssue.item === afterIssue.item && 
      beforeIssue.room === afterIssue.room
    )
    if (!existedBefore) {
      comparison.newIssues.push(afterIssue)
    }
  })
  
  return comparison
}

// Export inspection templates by property type
export function getInspectionTemplate(propertyType) {
  const templates = {
    'residential': inspectionTemplates.residential,
    'commercial': inspectionTemplates.commercial,
    'medical': inspectionTemplates.medical,
    'apartment': inspectionTemplates.residential,
    'office': inspectionTemplates.commercial,
    'retail': inspectionTemplates.commercial,
    'healthcare': inspectionTemplates.medical
  }
  
  return templates[propertyType.toLowerCase()] || inspectionTemplates.residential
}

// Generate inspection checklist from template
export function generateInspectionChecklist(propertyType, selectedRooms = []) {
  const template = getInspectionTemplate(propertyType)
  const checklist = {
    categories: []
  }
  
  template.categories.forEach(categoryTemplate => {
    const category = {
      name: categoryTemplate.name,
      icon: categoryTemplate.icon,
      weight: categoryTemplate.weight,
      activeRoom: null,
      rooms: []
    }
    
    Object.entries(categoryTemplate.rooms).forEach(([roomId, roomTemplate]) => {
      // Filter by selected rooms if provided
      if (selectedRooms.length > 0 && !selectedRooms.includes(roomId)) {
        return
      }
      
      const room = {
        id: roomId,
        name: roomTemplate.name,
        inspectionItems: roomTemplate.items.map(item => ({
          ...item,
          status: 'pending',
          photos: [],
          issue: null
        }))
      }
      
      category.rooms.push(room)
    })
    
    if (category.rooms.length > 0) {
      category.activeRoom = category.rooms[0].id
      checklist.categories.push(category)
    }
  })
  
  return checklist
}

// Quality metrics and analytics
export async function getQualityMetrics(startDate, endDate) {
  try {
    const inspections = await db.inspections
      .where('createdAt')
      .between(startDate, endDate)
      .toArray()
    
    const metrics = {
      averageScore: 0,
      totalInspections: inspections.length,
      passRate: 0,
      commonIssues: {},
      trendData: []
    }
    
    if (inspections.length === 0) return metrics
    
    let totalScore = 0
    let passCount = 0
    
    inspections.forEach(inspection => {
      totalScore += inspection.qualityScore
      if (inspection.qualityScore >= 75) {
        passCount++
      }
      
      // Track common issues
      inspection.issues.forEach(issue => {
        const key = `${issue.category}-${issue.item}`
        metrics.commonIssues[key] = (metrics.commonIssues[key] || 0) + 1
      })
    })
    
    metrics.averageScore = Math.round(totalScore / inspections.length)
    metrics.passRate = Math.round((passCount / inspections.length) * 100)
    
    // Sort common issues
    metrics.commonIssues = Object.entries(metrics.commonIssues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([issue, count]) => ({ issue, count }))
    
    return metrics
  } catch (error) {
    console.error('Error calculating quality metrics:', error)
    return null
  }
}