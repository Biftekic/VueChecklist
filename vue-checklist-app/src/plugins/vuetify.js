import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

// Define custom theme colors based on our design system
const customTheme = {
  dark: false,
  colors: {
    primary: '#1976D2',
    'primary-light': '#42A5F5',
    'primary-dark': '#1565C0',
    accent: '#00BCD4',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    background: '#FAFAFA',
    surface: '#FFFFFF',
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

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
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