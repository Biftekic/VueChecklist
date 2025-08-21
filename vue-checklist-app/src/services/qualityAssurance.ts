// Quality Assurance Service
export interface QualityStandard {
  id: string
  name: string
  description: string
  category: 'visual' | 'measurable' | 'procedural' | 'safety'
  criteria: QualityCriterion[]
  passThreshold: number // percentage
  weight: number // importance weight 1-10
  applicableRooms: string[]
  industry?: string
}

export interface QualityCriterion {
  id: string
  name: string
  description: string
  type: 'boolean' | 'scale' | 'measurement' | 'checklist'
  required: boolean
  weight: number
  acceptableLimits?: {
    min?: number
    max?: number
    target?: number
    unit?: string
  }
  checklistItems?: string[]
}

export interface QualityAssessment {
  id: string
  checklistId: string
  taskId: string
  assessorId: string
  assessorName: string
  standardId: string
  roomName: string
  taskName: string
  timestamp: string
  criteria: CriterionResult[]
  overallScore: number
  passed: boolean
  notes?: string
  photos?: string[]
  correctiveActions?: string[]
  reinspectionRequired: boolean
}

export interface CriterionResult {
  criterionId: string
  value: any
  score: number // 0-100
  passed: boolean
  notes?: string
  measuredValue?: number
  unit?: string
}

export interface QualityReport {
  id: string
  checklistId: string
  generatedAt: string
  assessor: string
  summary: QualitySummary
  assessments: QualityAssessment[]
  recommendations: string[]
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  certificationStatus: 'passed' | 'conditional' | 'failed'
}

export interface QualitySummary {
  totalTasks: number
  assessedTasks: number
  passedTasks: number
  failedTasks: number
  averageScore: number
  categoryBreakdown: CategoryScore[]
  criticalIssues: string[]
  timeToComplete: number
}

export interface CategoryScore {
  category: string
  score: number
  weight: number
  taskCount: number
}

export interface QualityTrend {
  date: string
  score: number
  assessmentCount: number
  passRate: number
}

export interface QualityDefect {
  id: string
  type: 'missing' | 'incomplete' | 'incorrect' | 'damaged' | 'contaminated'
  severity: 'critical' | 'major' | 'minor'
  description: string
  location: string
  photos?: string[]
  correctedBy?: string
  correctedAt?: string
  verifiedBy?: string
  verifiedAt?: string
  status: 'open' | 'corrected' | 'verified' | 'closed'
}

// Predefined quality standards for different industries
export const QUALITY_STANDARDS: Record<string, QualityStandard[]> = {
  residential: [
    {
      id: 'res-visual-001',
      name: 'Surface Cleanliness',
      description: 'Visual inspection of surface cleanliness',
      category: 'visual',
      criteria: [
        {
          id: 'crit-001',
          name: 'No visible dirt or debris',
          description: 'Surface should be free of visible dirt, dust, or debris',
          type: 'boolean',
          required: true,
          weight: 9
        },
        {
          id: 'crit-002',
          name: 'No stains or spots',
          description: 'No visible stains, water spots, or discoloration',
          type: 'boolean',
          required: true,
          weight: 8
        },
        {
          id: 'crit-003',
          name: 'Proper shine/finish',
          description: 'Appropriate level of shine for surface type',
          type: 'scale',
          required: false,
          weight: 6,
          acceptableLimits: { min: 7, max: 10, target: 9 }
        }
      ],
      passThreshold: 85,
      weight: 8,
      applicableRooms: ['All Rooms'],
      industry: 'residential'
    },
    {
      id: 'res-safety-001',
      name: 'Safety Compliance',
      description: 'Safety protocols and hazard management',
      category: 'safety',
      criteria: [
        {
          id: 'crit-004',
          name: 'Wet floor signs used',
          description: 'Appropriate warning signs placed during cleaning',
          type: 'boolean',
          required: true,
          weight: 10
        },
        {
          id: 'crit-005',
          name: 'Chemical safety followed',
          description: 'Proper chemical handling and storage',
          type: 'checklist',
          required: true,
          weight: 10,
          checklistItems: [
            'Chemicals properly labeled',
            'Safety data sheets available',
            'PPE used appropriately',
            'Ventilation adequate'
          ]
        }
      ],
      passThreshold: 95,
      weight: 10,
      applicableRooms: ['All Rooms'],
      industry: 'residential'
    }
  ],
  medical: [
    {
      id: 'med-sanitation-001',
      name: 'Medical Sanitation Standards',
      description: 'Hospital-grade sanitation requirements',
      category: 'measurable',
      criteria: [
        {
          id: 'crit-006',
          name: 'ATP reading compliance',
          description: 'ATP (adenosine triphosphate) reading within acceptable limits',
          type: 'measurement',
          required: true,
          weight: 10,
          acceptableLimits: { min: 0, max: 100, target: 50, unit: 'RLU' }
        },
        {
          id: 'crit-007',
          name: 'Disinfectant contact time',
          description: 'Proper dwell time for disinfectants',
          type: 'measurement',
          required: true,
          weight: 9,
          acceptableLimits: { min: 60, target: 60, unit: 'seconds' }
        },
        {
          id: 'crit-008',
          name: 'Surface disinfection complete',
          description: 'All required surfaces properly disinfected',
          type: 'checklist',
          required: true,
          weight: 10,
          checklistItems: [
            'Patient contact surfaces',
            'Medical equipment',
            'Door handles and controls',
            'Light switches',
            'Bed rails'
          ]
        }
      ],
      passThreshold: 98,
      weight: 10,
      applicableRooms: ['Patient Rooms', 'Operating Rooms', 'Examination Rooms'],
      industry: 'medical'
    }
  ],
  commercial: [
    {
      id: 'com-efficiency-001',
      name: 'Commercial Efficiency Standards',
      description: 'Time and quality efficiency for commercial spaces',
      category: 'procedural',
      criteria: [
        {
          id: 'crit-009',
          name: 'Task completion time',
          description: 'Task completed within allocated time',
          type: 'measurement',
          required: true,
          weight: 7,
          acceptableLimits: { max: 120, target: 100, unit: '% of allocated time' }
        },
        {
          id: 'crit-010',
          name: 'Procedure adherence',
          description: 'Standard operating procedures followed',
          type: 'checklist',
          required: true,
          weight: 8,
          checklistItems: [
            'Proper equipment used',
            'Correct chemical dilutions',
            'Safety protocols followed',
            'Documentation completed'
          ]
        }
      ],
      passThreshold: 80,
      weight: 7,
      applicableRooms: ['All Rooms'],
      industry: 'commercial'
    }
  ]
}

// Grade thresholds
const GRADE_THRESHOLDS = {
  A: 95,
  B: 85,
  C: 75,
  D: 65,
  F: 0
}

class QualityAssuranceService {
  private assessments: QualityAssessment[] = []
  private reports: QualityReport[] = []
  private defects: QualityDefect[] = []

  // Get applicable standards for a task
  getApplicableStandards(roomName: string, taskCategory?: string, industry?: string): QualityStandard[] {
    const industryStandards = industry ? QUALITY_STANDARDS[industry] || [] : 
      Object.values(QUALITY_STANDARDS).flat()

    return industryStandards.filter(standard =>
      standard.applicableRooms.includes('All Rooms') ||
      standard.applicableRooms.includes(roomName)
    )
  }

  // Create a new quality assessment
  async createAssessment(
    checklistId: string,
    taskId: string,
    standardId: string,
    assessorId: string,
    assessorName: string,
    roomName: string,
    taskName: string
  ): Promise<QualityAssessment> {
    const assessment: QualityAssessment = {
      id: `qa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      checklistId,
      taskId,
      assessorId,
      assessorName,
      standardId,
      roomName,
      taskName,
      timestamp: new Date().toISOString(),
      criteria: [],
      overallScore: 0,
      passed: false,
      reinspectionRequired: false
    }

    this.assessments.push(assessment)
    return assessment
  }

  // Evaluate a criterion
  evaluateCriterion(
    criterion: QualityCriterion,
    value: any,
    measuredValue?: number,
    unit?: string
  ): CriterionResult {
    let score = 0
    let passed = false

    switch (criterion.type) {
      case 'boolean':
        passed = Boolean(value)
        score = passed ? 100 : 0
        break

      case 'scale':
        const scaleValue = Number(value)
        if (criterion.acceptableLimits) {
          const { min = 0, max = 10, target } = criterion.acceptableLimits
          
          if (scaleValue < min) {
            score = 0
          } else if (scaleValue > max) {
            score = 0
          } else if (target && scaleValue === target) {
            score = 100
          } else {
            // Calculate score based on distance from target or range
            const range = max - min
            const normalizedValue = (scaleValue - min) / range
            score = Math.round(normalizedValue * 100)
          }
          
          passed = score >= 70 // 70% threshold for scale items
        }
        break

      case 'measurement':
        if (criterion.acceptableLimits && measuredValue !== undefined) {
          const { min, max, target } = criterion.acceptableLimits
          
          if (min !== undefined && measuredValue < min) {
            score = 0
            passed = false
          } else if (max !== undefined && measuredValue > max) {
            score = 0
            passed = false
          } else if (target && Math.abs(measuredValue - target) <= (target * 0.1)) {
            // Within 10% of target is perfect
            score = 100
            passed = true
          } else {
            // Calculate score based on how close to acceptable range
            score = 80 // Base score for being in range
            passed = true
          }
        }
        break

      case 'checklist':
        const checkedItems = Array.isArray(value) ? value : []
        const totalItems = criterion.checklistItems?.length || 1
        const checkedCount = checkedItems.filter(Boolean).length
        
        score = Math.round((checkedCount / totalItems) * 100)
        passed = score >= 80 // 80% of checklist items must pass
        break
    }

    return {
      criterionId: criterion.id,
      value,
      score,
      passed,
      measuredValue,
      unit
    }
  }

  // Complete an assessment
  async completeAssessment(
    assessmentId: string,
    criteriaResults: Array<{
      criterionId: string
      value: any
      notes?: string
      measuredValue?: number
      unit?: string
    }>,
    notes?: string,
    photos?: string[]
  ): Promise<QualityAssessment | null> {
    const assessment = this.assessments.find(a => a.id === assessmentId)
    if (!assessment) return null

    const standard = this.getStandardById(assessment.standardId)
    if (!standard) return null

    // Evaluate each criterion
    assessment.criteria = criteriaResults.map(result => {
      const criterion = standard.criteria.find(c => c.id === result.criterionId)
      if (!criterion) {
        throw new Error(`Criterion ${result.criterionId} not found`)
      }

      const evaluation = this.evaluateCriterion(
        criterion,
        result.value,
        result.measuredValue,
        result.unit
      )

      return {
        ...evaluation,
        notes: result.notes
      }
    })

    // Calculate overall score (weighted average)
    const totalWeight = standard.criteria.reduce((sum, c) => sum + c.weight, 0)
    const weightedScore = assessment.criteria.reduce((sum, result) => {
      const criterion = standard.criteria.find(c => c.id === result.criterionId)
      const weight = criterion?.weight || 1
      return sum + (result.score * weight)
    }, 0)

    assessment.overallScore = Math.round(weightedScore / totalWeight)
    assessment.passed = assessment.overallScore >= standard.passThreshold

    // Check if any required criteria failed
    const failedRequiredCriteria = assessment.criteria.some(result => {
      const criterion = standard.criteria.find(c => c.id === result.criterionId)
      return criterion?.required && !result.passed
    })

    if (failedRequiredCriteria) {
      assessment.passed = false
      assessment.reinspectionRequired = true
    }

    assessment.notes = notes
    assessment.photos = photos

    // Generate corrective actions if assessment failed
    if (!assessment.passed) {
      assessment.correctiveActions = this.generateCorrectiveActions(assessment, standard)
    }

    return assessment
  }

  // Generate corrective actions
  private generateCorrectiveActions(
    assessment: QualityAssessment,
    standard: QualityStandard
  ): string[] {
    const actions: string[] = []

    assessment.criteria.forEach(result => {
      if (!result.passed) {
        const criterion = standard.criteria.find(c => c.id === result.criterionId)
        if (criterion) {
          switch (criterion.type) {
            case 'boolean':
              actions.push(`Address ${criterion.name}: ${criterion.description}`)
              break
            case 'scale':
              actions.push(`Improve ${criterion.name} to meet acceptable standards`)
              break
            case 'measurement':
              actions.push(`Adjust procedure to meet ${criterion.name} requirements`)
              break
            case 'checklist':
              actions.push(`Complete all items for ${criterion.name}`)
              break
          }
        }
      }
    })

    return actions
  }

  // Get assessment by ID
  getAssessment(id: string): QualityAssessment | undefined {
    return this.assessments.find(a => a.id === id)
  }

  // Get assessments for a checklist
  getAssessmentsForChecklist(checklistId: string): QualityAssessment[] {
    return this.assessments.filter(a => a.checklistId === checklistId)
  }

  // Get standard by ID
  getStandardById(standardId: string): QualityStandard | undefined {
    return Object.values(QUALITY_STANDARDS)
      .flat()
      .find(s => s.id === standardId)
  }

  // Generate quality report
  async generateQualityReport(checklistId: string): Promise<QualityReport> {
    const assessments = this.getAssessmentsForChecklist(checklistId)
    
    if (assessments.length === 0) {
      throw new Error('No assessments found for this checklist')
    }

    const totalTasks = assessments.length
    const passedTasks = assessments.filter(a => a.passed).length
    const failedTasks = totalTasks - passedTasks
    const averageScore = assessments.reduce((sum, a) => sum + a.overallScore, 0) / totalTasks

    // Category breakdown
    const categoryMap = new Map<string, { totalScore: number; count: number; weight: number }>()
    
    assessments.forEach(assessment => {
      const standard = this.getStandardById(assessment.standardId)
      if (standard) {
        const existing = categoryMap.get(standard.category) || { totalScore: 0, count: 0, weight: 0 }
        existing.totalScore += assessment.overallScore
        existing.count += 1
        existing.weight = Math.max(existing.weight, standard.weight)
        categoryMap.set(standard.category, existing)
      }
    })

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      score: Math.round(data.totalScore / data.count),
      weight: data.weight,
      taskCount: data.count
    }))

    // Critical issues
    const criticalIssues = assessments
      .filter(a => !a.passed && a.reinspectionRequired)
      .map(a => `${a.roomName}: ${a.taskName}`)

    // Overall grade
    let overallGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F'
    for (const [grade, threshold] of Object.entries(GRADE_THRESHOLDS)) {
      if (averageScore >= threshold) {
        overallGrade = grade as 'A' | 'B' | 'C' | 'D' | 'F'
        break
      }
    }

    // Certification status
    let certificationStatus: 'passed' | 'conditional' | 'failed' = 'failed'
    if (averageScore >= 95 && failedTasks === 0) {
      certificationStatus = 'passed'
    } else if (averageScore >= 75 && criticalIssues.length === 0) {
      certificationStatus = 'conditional'
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(assessments, categoryBreakdown)

    const report: QualityReport = {
      id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      checklistId,
      generatedAt: new Date().toISOString(),
      assessor: assessments[0]?.assessorName || 'Unknown',
      summary: {
        totalTasks,
        assessedTasks: totalTasks,
        passedTasks,
        failedTasks,
        averageScore,
        categoryBreakdown,
        criticalIssues,
        timeToComplete: 0 // This would be calculated from checklist timing
      },
      assessments,
      recommendations,
      overallGrade,
      certificationStatus
    }

    this.reports.push(report)
    return report
  }

  // Generate recommendations
  private generateRecommendations(
    assessments: QualityAssessment[],
    categoryBreakdown: CategoryScore[]
  ): string[] {
    const recommendations: string[] = []

    // Category-specific recommendations
    categoryBreakdown.forEach(category => {
      if (category.score < 80) {
        switch (category.category) {
          case 'visual':
            recommendations.push('Focus on visual inspection training and better lighting during cleaning')
            break
          case 'measurable':
            recommendations.push('Implement regular calibration of measurement tools and monitoring equipment')
            break
          case 'procedural':
            recommendations.push('Review and update standard operating procedures, provide additional training')
            break
          case 'safety':
            recommendations.push('Enhance safety protocols and ensure proper PPE usage at all times')
            break
        }
      }
    })

    // Failed assessment recommendations
    const failedAssessments = assessments.filter(a => !a.passed)
    if (failedAssessments.length > 0) {
      recommendations.push(`Re-inspect ${failedAssessments.length} failed tasks after corrective actions`)
    }

    // Performance recommendations
    const averageScore = assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length
    if (averageScore < 85) {
      recommendations.push('Consider additional training for cleaning staff')
      recommendations.push('Review current cleaning products and equipment effectiveness')
    }

    return recommendations
  }

  // Track defects
  createDefect(
    type: QualityDefect['type'],
    severity: QualityDefect['severity'],
    description: string,
    location: string,
    photos?: string[]
  ): QualityDefect {
    const defect: QualityDefect = {
      id: `def-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      description,
      location,
      photos,
      status: 'open'
    }

    this.defects.push(defect)
    return defect
  }

  // Get quality trends
  getQualityTrends(days: number = 30): QualityTrend[] {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const trendsMap = new Map<string, { scores: number[]; count: number; passed: number }>()

    this.assessments.forEach(assessment => {
      const date = new Date(assessment.timestamp)
      if (date >= startDate && date <= endDate) {
        const dateKey = date.toISOString().split('T')[0]
        const existing = trendsMap.get(dateKey) || { scores: [], count: 0, passed: 0 }
        
        existing.scores.push(assessment.overallScore)
        existing.count++
        if (assessment.passed) existing.passed++
        
        trendsMap.set(dateKey, existing)
      }
    })

    return Array.from(trendsMap.entries()).map(([date, data]) => ({
      date,
      score: Math.round(data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length),
      assessmentCount: data.count,
      passRate: Math.round((data.passed / data.count) * 100)
    })).sort((a, b) => a.date.localeCompare(b.date))
  }

  // Get reports
  getReports(): QualityReport[] {
    return this.reports.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    )
  }

  // Get defects
  getDefects(status?: QualityDefect['status']): QualityDefect[] {
    if (status) {
      return this.defects.filter(d => d.status === status)
    }
    return this.defects
  }
}

// Export singleton instance
export const qualityAssuranceService = new QualityAssuranceService()

// Export types and constants
export { GRADE_THRESHOLDS }

// Export default
export default qualityAssuranceService