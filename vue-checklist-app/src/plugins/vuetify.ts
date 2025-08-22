import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure MDI CSS is loaded
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Define custom theme colors based on our design system
const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#1976D2',
    'primary-light': '#42A5F5',
    'primary-dark': '#1565C0',
    secondary: '#424242',
    accent: '#00BCD4',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    'on-background': '#212121',
    'on-surface': '#212121',
    'text-primary': '#212121',
    'text-secondary': '#757575',
    divider: '#E0E0E0',
    
    // Industry colors
    office: '#2196F3',
    residential: '#4CAF50',
    medical: '#F44336',
    hospitality: '#9C27B0',
    restaurant: '#FF9800',
    retail: '#00BCD4',
    airbnb: '#FF5252'
  }
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#42A5F5',
    'primary-light': '#80D8FF',
    'primary-dark': '#0D47A1',
    secondary: '#BDBDBD',
    accent: '#4DD0E1',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#42A5F5',
    background: '#121212',
    surface: '#1E1E1E',
    'on-background': '#FFFFFF',
    'on-surface': '#FFFFFF',
    'text-primary': '#FFFFFF',
    'text-secondary': '#AAAAAA',
    divider: '#333333',
    
    // Industry colors (adjusted for dark theme)
    office: '#64B5F6',
    residential: '#81C784',
    medical: '#E57373',
    hospitality: '#BA68C8',
    restaurant: '#FFB74D',
    retail: '#4DD0E1',
    airbnb: '#FF8A80'
  }
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi: {
        component: components.VIcon,
      },
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme
    },
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 2,
      darken: 2
    }
  },
  defaults: {
    VBtn: {
      rounded: 'xl',
      elevation: 2
    },
    VCard: {
      rounded: 'lg',
      elevation: 1
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable'
    }
  }
})