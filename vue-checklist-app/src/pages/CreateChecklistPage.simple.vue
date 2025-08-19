<template>
  <MainLayout title="Create Checklist" :show-back-button="true">
    <v-container class="pa-4">
      <!-- Progress Indicator -->
      <v-card class="mb-4 elevation-2">
        <v-card-text>
          <v-progress-linear
            model-value="33"
            color="primary"
            height="8"
            rounded
          ></v-progress-linear>
          <div class="text-center mt-2 text-caption">Step 1 of 3</div>
        </v-card-text>
      </v-card>

      <!-- Main Form Card -->
      <v-card class="elevation-4 form-card">
        <v-card-title class="text-h5 font-weight-bold">
          <v-icon class="mr-2">mdi-clipboard-plus</v-icon>
          New Cleaning Checklist
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form">
            <!-- Property Name -->
            <v-text-field
              v-model="propertyName"
              label="Property Name"
              placeholder="e.g., Beach House Villa"
              prepend-icon="mdi-home"
              variant="outlined"
              class="mb-4"
              required
            ></v-text-field>

            <!-- Address -->
            <v-text-field
              v-model="address"
              label="Property Address"
              placeholder="123 Main St, City, State"
              prepend-icon="mdi-map-marker"
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <!-- Property Type -->
            <v-select
              v-model="propertyType"
              :items="propertyTypes"
              label="Property Type"
              prepend-icon="mdi-home-variant"
              variant="outlined"
              class="mb-4"
            ></v-select>

            <!-- Cleaning Type -->
            <v-select
              v-model="cleaningType"
              :items="cleaningTypes"
              label="Cleaning Type"
              prepend-icon="mdi-broom"
              variant="outlined"
              class="mb-4"
            ></v-select>

            <!-- Date and Time -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="date"
                  label="Date"
                  type="date"
                  prepend-icon="mdi-calendar"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="time"
                  label="Time"
                  type="time"
                  prepend-icon="mdi-clock"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Notes -->
            <v-textarea
              v-model="notes"
              label="Additional Notes"
              placeholder="Any special instructions or requirements..."
              prepend-icon="mdi-note-text"
              variant="outlined"
              rows="3"
              class="mb-4"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            variant="text"
            @click="goBack"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            @click="createChecklist"
            prepend-icon="mdi-check"
          >
            Create Checklist
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Quick Templates -->
      <v-card class="mt-6 elevation-2 templates-card">
        <v-card-title class="text-h6">
          <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
          Quick Templates
        </v-card-title>
        <v-card-text>
          <v-chip-group>
            <v-chip
              v-for="template in templates"
              :key="template"
              @click="selectTemplate(template)"
              variant="outlined"
              color="primary"
            >
              {{ template }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()

// Form data
const propertyName = ref('')
const address = ref('')
const propertyType = ref('')
const cleaningType = ref('')
const date = ref('')
const time = ref('')
const notes = ref('')

// Options
const propertyTypes = [
  'House',
  'Apartment',
  'Condo',
  'Villa',
  'Office',
  'Commercial Space'
]

const cleaningTypes = [
  'Standard Cleaning',
  'Deep Cleaning',
  'Move-in/Move-out',
  'Post-Construction',
  'Regular Maintenance'
]

const templates = [
  'Airbnb Turnover',
  'Office Cleaning',
  'Deep Clean',
  'Quick Clean'
]

const goBack = () => {
  router.push('/')
}

const createChecklist = () => {
  // TODO: Implement actual checklist creation with store
  // Currently navigates to checklists page as placeholder
  
  // Navigate to checklists page after creation
  router.push('/checklists')
}

const selectTemplate = (template: string) => {
  // Pre-fill form based on template selection
  cleaningType.value = template === 'Deep Clean' ? 'Deep Cleaning' : 'Standard Cleaning'
}

// Simplified create checklist page
</script>

<style scoped>
.form-card {
  border-radius: 12px;
}

.templates-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}
</style>