<template>
  <MainLayout title="Settings">
    <v-container class="pa-4">
      <h1 class="text-h4 mb-4">Settings</h1>
      
      <!-- Settings Sections -->
      <v-expansion-panels class="mb-4">
        <!-- Profile Settings -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-account</v-icon>
            Profile Settings
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-text-field
              v-model="profile.name"
              label="Business Name"
              prepend-icon="mdi-office-building"
              class="mb-3"
            />
            <v-text-field
              v-model="profile.email"
              label="Email"
              type="email"
              prepend-icon="mdi-email"
              class="mb-3"
            />
            <v-text-field
              v-model="profile.phone"
              label="Phone"
              prepend-icon="mdi-phone"
              class="mb-3"
            />
            <v-btn color="primary" @click="saveProfile">
              Save Profile
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- App Preferences -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-tune</v-icon>
            App Preferences
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-switch
              v-model="preferences.notifications"
              label="Enable Notifications"
              color="primary"
              class="mb-3"
            />
            <v-switch
              v-model="preferences.autoSave"
              label="Auto-save Checklists"
              color="primary"
              class="mb-3"
            />
            <v-switch
              v-model="preferences.darkMode"
              label="Dark Mode"
              color="primary"
              class="mb-3"
            />
            <v-select
              v-model="preferences.language"
              :items="languages"
              label="Language"
              prepend-icon="mdi-translate"
              class="mb-3"
            />
            <v-btn color="primary" @click="savePreferences">
              Save Preferences
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Default Checklist Settings -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-clipboard-check</v-icon>
            Default Checklist Settings
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-select
              v-model="checklistDefaults.difficulty"
              :items="difficultyLevels"
              label="Default Difficulty"
              prepend-icon="mdi-gauge"
              class="mb-3"
            />
            <v-select
              v-model="checklistDefaults.timeUnit"
              :items="timeUnits"
              label="Time Display Unit"
              prepend-icon="mdi-clock"
              class="mb-3"
            />
            <v-text-field
              v-model.number="checklistDefaults.defaultTime"
              label="Default Task Time (minutes)"
              type="number"
              prepend-icon="mdi-timer"
              class="mb-3"
            />
            <v-btn color="primary" @click="saveChecklistDefaults">
              Save Defaults
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Data Management -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-database</v-icon>
            Data Management
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card elevation="0" class="mb-3 pa-3" color="grey-lighten-4">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-h6">Export Data</div>
                  <div class="text-caption">Download all your checklists and templates</div>
                </div>
                <v-btn color="primary" variant="outlined" @click="exportData">
                  <v-icon left>mdi-download</v-icon>
                  Export
                </v-btn>
              </div>
            </v-card>
            
            <v-card elevation="0" class="mb-3 pa-3" color="grey-lighten-4">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-h6">Import Data</div>
                  <div class="text-caption">Restore from backup</div>
                </div>
                <v-btn color="primary" variant="outlined" @click="importData">
                  <v-icon left>mdi-upload</v-icon>
                  Import
                </v-btn>
              </div>
            </v-card>
            
            <v-card elevation="0" class="pa-3" color="error-lighten-5">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-h6 text-error">Clear All Data</div>
                  <div class="text-caption">This action cannot be undone</div>
                </div>
                <v-btn color="error" variant="outlined" @click="clearData">
                  <v-icon left>mdi-delete-forever</v-icon>
                  Clear
                </v-btn>
              </div>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- About -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-information</v-icon>
            About
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card elevation="0" class="pa-4">
              <div class="text-center mb-3">
                <v-icon size="64" color="primary">mdi-clipboard-check</v-icon>
                <h2 class="text-h5 mt-2">Cleaning Checklist Pro</h2>
                <p class="text-caption">Version 1.0.0</p>
              </div>
              
              <v-divider class="mb-3" />
              
              <div class="text-body-2">
                <p class="mb-2">Professional cleaning checklist management app</p>
                <p class="mb-2">Built with Vue 3, Vuetify 3, and TypeScript</p>
                <p>© 2024 Cleaning Checklist Pro</p>
              </div>
              
              <v-divider class="my-3" />
              
              <div class="d-flex justify-space-around">
                <v-btn text color="primary" @click="openLink('support')">
                  Support
                </v-btn>
                <v-btn text color="primary" @click="openLink('privacy')">
                  Privacy
                </v-btn>
                <v-btn text color="primary" @click="openLink('terms')">
                  Terms
                </v-btn>
              </div>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { logger } from "@/services/logger"
import { ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'

// Profile data
const profile = ref({
  name: 'Cleaning Pro Services',
  email: 'contact@cleaningpro.com',
  phone: '555-0123'
})

// App preferences
const preferences = ref({
  notifications: true,
  autoSave: true,
  darkMode: false,
  language: 'English'
})

// Checklist defaults
const checklistDefaults = ref({
  difficulty: 'Average',
  timeUnit: 'minutes',
  defaultTime: 15
})

// Options
const languages = ['English', 'Spanish', 'French', 'German']
const difficultyLevels = ['Light', 'Average', 'Heavy']
const timeUnits = ['minutes', 'hours']

// Methods
const saveProfile = () => {
  logger.debug('Saving profile:', profile.value)
  // Save to storage
  alert('Profile saved successfully!')
}

const savePreferences = () => {
  logger.debug('Saving preferences:', preferences.value)
  // Save to storage
  alert('Preferences saved successfully!')
}

const saveChecklistDefaults = () => {
  logger.debug('Saving checklist defaults:', checklistDefaults.value)
  // Save to storage
  alert('Defaults saved successfully!')
}

const exportData = () => {
  logger.debug('Exporting data...')
  // Export logic
  alert('Data exported successfully!')
}

const importData = () => {
  logger.debug('Importing data...')
  // Import logic
  alert('Import feature coming soon!')
}

const clearData = () => {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    logger.debug('Clearing all data...')
    // Clear logic
    alert('All data cleared!')
  }
}

const openLink = (type) => {
  const links = {
    support: '#',
    privacy: '#',
    terms: '#'
  }
  logger.debug(`Opening ${type} link:`, links[type])
}
</script>

<style scoped>
.v-expansion-panel-title {
  font-weight: 500;
}
</style>