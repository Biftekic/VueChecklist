import { ref, computed, watch, onMounted } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'
import { useLocalStorage } from './useLocalStorage'

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  error: string
  warning: string
  info: string
  success: string
}

export function useTheme() {
  const vuetifyTheme = useVuetifyTheme()
  
  // Store theme preference in localStorage
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>('theme-mode', 'auto')
  const [customColors, setCustomColors] = useLocalStorage<Partial<ThemeColors>>('theme-colors', {})
  
  // System preference detection
  const prefersDark = ref(false)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  // Computed current theme
  const currentTheme = computed(() => {
    if (themeMode.value === 'auto') {
      return prefersDark.value ? 'dark' : 'light'
    }
    return themeMode.value
  })
  
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // Update Vuetify theme
  const updateVuetifyTheme = () => {
    vuetifyTheme.global.name.value = currentTheme.value
    
    // Apply custom colors if any
    if (Object.keys(customColors.value).length > 0) {
      const theme = vuetifyTheme.themes.value[currentTheme.value]
      Object.assign(theme.colors, customColors.value)
    }
  }
  
  // Toggle theme
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }
  
  // Set specific theme
  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode)
  }
  
  // Set custom color
  const setColor = (colorName: keyof ThemeColors, colorValue: string) => {
    const newColors = { ...customColors.value, [colorName]: colorValue }
    setCustomColors(newColors)
    updateVuetifyTheme()
  }
  
  // Reset to default colors
  const resetColors = () => {
    setCustomColors({})
    updateVuetifyTheme()
  }
  
  // Handle system preference changes
  const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
    prefersDark.value = e.matches
  }
  
  // Watch for theme changes
  watch([themeMode, prefersDark], () => {
    updateVuetifyTheme()
    
    // Update document class for CSS variables
    document.documentElement.classList.toggle('dark-theme', isDark.value)
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark.value ? '#121212' : '#ffffff')
    }
  })
  
  // Initialize
  onMounted(() => {
    // Set initial system preference
    prefersDark.value = mediaQuery.matches
    
    // Listen for system preference changes
    mediaQuery.addEventListener('change', handleMediaQueryChange)
    
    // Apply initial theme
    updateVuetifyTheme()
    document.documentElement.classList.toggle('dark-theme', isDark.value)
  })
  
  return {
    themeMode: computed(() => themeMode.value),
    currentTheme,
    isDark,
    customColors: computed(() => customColors.value),
    toggleTheme,
    setTheme,
    setColor,
    resetColors
  }
}

// CSS variables for theme-aware styling
export const themeVariables = {
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f5f5f5',
    '--text-primary': '#212121',
    '--text-secondary': '#757575',
    '--border-color': '#e0e0e0',
    '--shadow-color': 'rgba(0, 0, 0, 0.1)',
    '--overlay-color': 'rgba(0, 0, 0, 0.5)'
  },
  dark: {
    '--bg-primary': '#121212',
    '--bg-secondary': '#1e1e1e',
    '--text-primary': '#ffffff',
    '--text-secondary': '#aaaaaa',
    '--border-color': '#333333',
    '--shadow-color': 'rgba(0, 0, 0, 0.3)',
    '--overlay-color': 'rgba(0, 0, 0, 0.7)'
  }
}

// Helper to apply theme variables to root
export function applyThemeVariables(theme: 'light' | 'dark') {
  const root = document.documentElement
  const variables = themeVariables[theme]
  
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}