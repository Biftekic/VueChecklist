/**
 * Navigation types for the application
 */

export interface NavigationItem {
  title: string
  path: string
  icon: string
  color?: string
  description?: string
}

export interface ActionCard {
  id: string
  title: string
  description: string
  icon: string
  color: string
  path: string
  badge?: number | string
}

export interface QuickStat {
  label: string
  value: number | string
  color?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
}