<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :icon="themeIcon"
        :color="iconColor"
        variant="text"
        :size="size"
      />
    </template>
    
    <v-list density="compact">
      <v-list-item
        v-for="mode in themeModes"
        :key="mode.value"
        @click="setTheme(mode.value)"
        :active="themeMode === mode.value"
      >
        <template v-slot:prepend>
          <v-icon :icon="mode.icon" />
        </template>
        <v-list-item-title>{{ mode.label }}</v-list-item-title>
      </v-list-item>
      
      <v-divider v-if="showColorPicker" class="my-2" />
      
      <v-list-item v-if="showColorPicker">
        <v-list-item-title class="text-caption mb-2">
          Accent Color
        </v-list-item-title>
        <div class="d-flex gap-2 flex-wrap">
          <v-btn
            v-for="color in presetColors"
            :key="color"
            :color="color"
            size="x-small"
            icon
            variant="flat"
            @click="setColor('primary', color)"
          >
            <v-icon
              v-if="customColors.primary === color"
              size="small"
            >
              mdi-check
            </v-icon>
          </v-btn>
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme, type ThemeMode } from '@/composables/useTheme'

interface Props {
  size?: string
  showColorPicker?: boolean
  iconColor?: string
}

withDefaults(defineProps<Props>(), {
  size: 'default',
  showColorPicker: false,
  iconColor: undefined
})

const { themeMode, isDark, customColors, setTheme, setColor } = useTheme()

const themeModes = [
  { value: 'light' as ThemeMode, label: 'Light', icon: 'mdi-white-balance-sunny' },
  { value: 'dark' as ThemeMode, label: 'Dark', icon: 'mdi-weather-night' },
  { value: 'auto' as ThemeMode, label: 'System', icon: 'mdi-theme-light-dark' }
]

const presetColors = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#F44336', // Red
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#795548', // Brown
  '#607D8B'  // Blue Grey
]

const themeIcon = computed(() => {
  switch (themeMode.value) {
    case 'light':
      return 'mdi-white-balance-sunny'
    case 'dark':
      return 'mdi-weather-night'
    case 'auto':
      return 'mdi-theme-light-dark'
    default:
      return 'mdi-theme-light-dark'
  }
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>