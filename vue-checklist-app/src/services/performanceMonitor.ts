/**
 * Performance Monitoring Service
 * Tracks Core Web Vitals and application-specific metrics
 */

import { ref } from 'vue'

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null  // Largest Contentful Paint
  fid: number | null  // First Input Delay
  cls: number | null  // Cumulative Layout Shift
  fcp: number | null  // First Contentful Paint
  ttfb: number | null // Time to First Byte
  inp: number | null  // Interaction to Next Paint
  
  // Custom Metrics
  routeChangeTime: number | null
  apiResponseTime: number | null
  renderTime: number | null
  memoryUsage: number | null
  bundleLoadTime: number | null
}

export interface PerformanceMark {
  name: string
  startTime: number
  duration?: number
  metadata?: any
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics = ref<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
    routeChangeTime: null,
    apiResponseTime: null,
    renderTime: null,
    memoryUsage: null,
    bundleLoadTime: null
  })
  
  private marks = new Map<string, PerformanceMark>()
  private observer: PerformanceObserver | null = null
  private reportQueue: PerformanceMetrics[] = []
  private reportInterval: number | null = null

  private constructor() {
    this.initializeObservers()
    this.startReporting()
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Initialize performance observers for Core Web Vitals
   */
  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // Observe Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.value.lcp = lastEntry.renderTime || lastEntry.loadTime
        this.logMetric('LCP', this.metrics.value.lcp)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP observer not supported')
    }

    // Observe First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const firstEntry = entries[0] as any
        this.metrics.value.fid = firstEntry.processingStart - firstEntry.startTime
        this.logMetric('FID', this.metrics.value.fid)
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('FID observer not supported')
    }

    // Observe Cumulative Layout Shift
    try {
      let clsValue = 0
      let clsEntries: any[] = []

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            clsEntries.push(entry)
          }
        }
        this.metrics.value.cls = clsValue
        this.logMetric('CLS', this.metrics.value.cls)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS observer not supported')
    }

    // Observe First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.metrics.value.fcp = fcpEntry.startTime
          this.logMetric('FCP', this.metrics.value.fcp)
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch (e) {
      console.warn('FCP observer not supported')
    }

    // Observe Interaction to Next Paint (INP)
    try {
      let inpValue = 0
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (entry.interactionId) {
            inpValue = Math.max(inpValue, entry.duration)
            this.metrics.value.inp = inpValue
          }
        }
      })
      inpObserver.observe({ entryTypes: ['event'] })
    } catch (e) {
      console.warn('INP observer not supported')
    }

    // Calculate Time to First Byte
    if (window.performance && window.performance.timing) {
      const navigationTiming = window.performance.timing
      this.metrics.value.ttfb = navigationTiming.responseStart - navigationTiming.navigationStart
      this.logMetric('TTFB', this.metrics.value.ttfb)
    }

    // Monitor memory usage
    this.monitorMemoryUsage()
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        this.metrics.value.memoryUsage = memory.usedJSHeapSize / 1048576 // Convert to MB
      }, 10000) // Check every 10 seconds
    }
  }

  /**
   * Log metric for debugging
   */
  private logMetric(name: string, value: number | null): void {
    if (value !== null && import.meta.env.DEV) {
      const rating = this.getMetricRating(name, value)
      const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${rating})`)
    }
  }

  /**
   * Get metric rating based on thresholds
   */
  private getMetricRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
      INP: { good: 200, poor: 500 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Mark the start of a performance measurement
   */
  mark(name: string, metadata?: any): void {
    this.marks.set(name, {
      name,
      startTime: performance.now(),
      metadata
    })
  }

  /**
   * Measure the time between a mark and now
   */
  measure(name: string): number | null {
    const mark = this.marks.get(name)
    if (!mark) return null

    const duration = performance.now() - mark.startTime
    mark.duration = duration
    
    // Log measurement
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  /**
   * Track route change performance
   */
  trackRouteChange(from: string, to: string): void {
    const markName = `route-change-${Date.now()}`
    this.mark(markName, { from, to })
    
    // Measure after next frame
    requestAnimationFrame(() => {
      const duration = this.measure(markName)
      if (duration) {
        this.metrics.value.routeChangeTime = duration
      }
    })
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint: string): () => void {
    const markName = `api-${endpoint}-${Date.now()}`
    this.mark(markName, { endpoint })
    
    return () => {
      const duration = this.measure(markName)
      if (duration) {
        this.metrics.value.apiResponseTime = duration
        
        // Track slow API calls
        if (duration > 1000) {
          console.warn(`Slow API call to ${endpoint}: ${duration.toFixed(2)}ms`)
        }
      }
    }
  }

  /**
   * Track component render performance
   */
  trackComponentRender(componentName: string): () => void {
    const markName = `render-${componentName}-${Date.now()}`
    this.mark(markName, { component: componentName })
    
    return () => {
      const duration = this.measure(markName)
      if (duration) {
        this.metrics.value.renderTime = duration
        
        // Track slow renders
        if (duration > 16.67) { // More than one frame (60fps)
          console.warn(`Slow render in ${componentName}: ${duration.toFixed(2)}ms`)
        }
      }
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics.value }
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    const weights = {
      lcp: 0.25,
      fid: 0.25,
      cls: 0.25,
      fcp: 0.15,
      ttfb: 0.1
    }

    let totalScore = 0
    let totalWeight = 0

    // Calculate scores for each metric
    if (this.metrics.value.lcp !== null) {
      const lcpScore = this.calculateMetricScore(this.metrics.value.lcp, 2500, 4000)
      totalScore += lcpScore * weights.lcp
      totalWeight += weights.lcp
    }

    if (this.metrics.value.fid !== null) {
      const fidScore = this.calculateMetricScore(this.metrics.value.fid, 100, 300)
      totalScore += fidScore * weights.fid
      totalWeight += weights.fid
    }

    if (this.metrics.value.cls !== null) {
      const clsScore = this.calculateMetricScore(this.metrics.value.cls, 0.1, 0.25)
      totalScore += clsScore * weights.cls
      totalWeight += weights.cls
    }

    if (this.metrics.value.fcp !== null) {
      const fcpScore = this.calculateMetricScore(this.metrics.value.fcp, 1800, 3000)
      totalScore += fcpScore * weights.fcp
      totalWeight += weights.fcp
    }

    if (this.metrics.value.ttfb !== null) {
      const ttfbScore = this.calculateMetricScore(this.metrics.value.ttfb, 800, 1800)
      totalScore += ttfbScore * weights.ttfb
      totalWeight += weights.ttfb
    }

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
  }

  /**
   * Calculate score for a single metric
   */
  private calculateMetricScore(value: number, goodThreshold: number, poorThreshold: number): number {
    if (value <= goodThreshold) return 1
    if (value >= poorThreshold) return 0
    
    // Linear interpolation between good and poor
    return 1 - ((value - goodThreshold) / (poorThreshold - goodThreshold))
  }

  /**
   * Start reporting metrics
   */
  private startReporting(): void {
    // Report metrics every 30 seconds in production
    if (import.meta.env.PROD) {
      this.reportInterval = window.setInterval(() => {
        this.reportMetrics()
      }, 30000)
    }
  }

  /**
   * Report metrics to analytics service
   */
  private reportMetrics(): void {
    const metrics = this.getMetrics()
    const score = this.getPerformanceScore()
    
    // Add to report queue
    this.reportQueue.push(metrics)
    
    // In production, send to analytics service
    if (import.meta.env.PROD) {
      this.sendToAnalytics({
        metrics,
        score,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }
    
    // Keep only last 10 reports
    if (this.reportQueue.length > 10) {
      this.reportQueue.shift()
    }
  }

  /**
   * Send metrics to analytics service
   */
  private async sendToAnalytics(data: any): Promise<void> {
    try {
      // This would be replaced with actual analytics service
      console.log('Performance metrics:', data)
      
      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'performance', {
          event_category: 'Web Vitals',
          event_label: 'Core Web Vitals',
          value: data.score,
          custom_map: {
            lcp: data.metrics.lcp,
            fid: data.metrics.fid,
            cls: data.metrics.cls
          }
        })
      }
    } catch (error) {
      console.error('Failed to send performance metrics:', error)
    }
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = []
    
    if (this.metrics.value.lcp && this.metrics.value.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint: Consider lazy loading images and optimizing server response time')
    }
    
    if (this.metrics.value.fid && this.metrics.value.fid > 100) {
      recommendations.push('Improve First Input Delay: Break up long tasks and optimize JavaScript execution')
    }
    
    if (this.metrics.value.cls && this.metrics.value.cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift: Add size attributes to images and avoid inserting content above existing content')
    }
    
    if (this.metrics.value.ttfb && this.metrics.value.ttfb > 800) {
      recommendations.push('Optimize Time to First Byte: Consider using a CDN and optimizing server processing time')
    }
    
    if (this.metrics.value.memoryUsage && this.metrics.value.memoryUsage > 100) {
      recommendations.push('High memory usage detected: Consider optimizing data structures and removing memory leaks')
    }
    
    return recommendations
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
    }
    
    if (this.reportInterval) {
      clearInterval(this.reportInterval)
    }
    
    this.marks.clear()
    this.reportQueue = []
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// Export composable for use in components
export function usePerformanceMonitor() {
  return {
    trackRouteChange: performanceMonitor.trackRouteChange.bind(performanceMonitor),
    trackApiCall: performanceMonitor.trackApiCall.bind(performanceMonitor),
    trackComponentRender: performanceMonitor.trackComponentRender.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getPerformanceScore: performanceMonitor.getPerformanceScore.bind(performanceMonitor),
    getRecommendations: performanceMonitor.getRecommendations.bind(performanceMonitor)
  }
}