<template>
  <MainLayout title="Templates">
    <v-container class="pa-4">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h4">Templates</h1>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="createTemplate"
        >
          Create Template
        </v-btn>
      </div>

      <!-- Template Categories -->
      <v-chip-group
        v-model="selectedCategory"
        class="mb-4"
        selected-class="primary"
      >
        <v-chip
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </v-chip>
      </v-chip-group>

      <!-- Templates Grid -->
      <v-row>
        <v-col
          v-for="template in filteredTemplates"
          :key="template.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="template-card"
            elevation="2"
            @click="useTemplate(template.id)"
          >
            <v-card-title>
              <v-icon left class="mr-2" :color="template.color">
                {{ template.icon }}
              </v-icon>
              {{ template.name }}
            </v-card-title>
            
            <v-card-subtitle>
              {{ template.category }}
            </v-card-subtitle>

            <v-card-text>
              <p class="text-body-2">{{ template.description }}</p>
              
              <div class="mt-3">
                <v-chip size="small" class="mr-1">
                  <v-icon size="small" left>mdi-door</v-icon>
                  {{ template.rooms }} rooms
                </v-chip>
                <v-chip size="small">
                  <v-icon size="small" left>mdi-clock-outline</v-icon>
                  {{ template.estimatedTime }} min
                </v-chip>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click.stop="useTemplate(template.id)"
              >
                Use Template
              </v-btn>
              <v-spacer />
              <v-btn
                icon
                @click.stop="editTemplate(template.id)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                @click.stop="deleteTemplate(template.id)"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card
        v-if="filteredTemplates.length === 0"
        class="pa-8 text-center"
        elevation="0"
        color="grey-lighten-4"
      >
        <v-icon size="64" color="grey">
          mdi-file-document-outline
        </v-icon>
        <v-card-title class="text-grey">
          No templates found
        </v-card-title>
        <v-card-subtitle>
          {{ selectedCategory ? `No templates in ${selectedCategory} category` : 'Create your first template to reuse later' }}
        </v-card-subtitle>
        <v-btn
          color="primary"
          class="mt-4"
          @click="createTemplate"
        >
          Create Template
        </v-btn>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()

// State
const selectedCategory = ref('All')

// Sample templates
const templates = ref([
  {
    id: '1',
    name: 'Standard House Cleaning',
    category: 'Residential',
    description: 'Complete house cleaning checklist for regular maintenance',
    icon: 'mdi-home',
    color: 'primary',
    rooms: 8,
    estimatedTime: 120
  },
  {
    id: '2',
    name: 'Deep Clean - Kitchen',
    category: 'Deep Clean',
    description: 'Thorough kitchen deep cleaning including appliances',
    icon: 'mdi-silverware-fork-knife',
    color: 'orange',
    rooms: 1,
    estimatedTime: 90
  },
  {
    id: '3',
    name: 'Office Cleaning',
    category: 'Commercial',
    description: 'Standard office cleaning procedures',
    icon: 'mdi-office-building',
    color: 'blue',
    rooms: 5,
    estimatedTime: 60
  },
  {
    id: '4',
    name: 'Move-In/Move-Out',
    category: 'Special',
    description: 'Complete cleaning for property turnover',
    icon: 'mdi-truck',
    color: 'green',
    rooms: 10,
    estimatedTime: 240
  },
  {
    id: '5',
    name: 'Bathroom Deep Clean',
    category: 'Deep Clean',
    description: 'Intensive bathroom sanitization and cleaning',
    icon: 'mdi-shower',
    color: 'cyan',
    rooms: 1,
    estimatedTime: 45
  },
  {
    id: '6',
    name: 'Quick Daily Clean',
    category: 'Residential',
    description: 'Fast daily maintenance cleaning routine',
    icon: 'mdi-lightning-bolt',
    color: 'yellow-darken-3',
    rooms: 4,
    estimatedTime: 30
  }
])

const categories = computed(() => {
  const cats = ['All', ...new Set(templates.value.map(t => t.category))]
  return cats
})

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'All' || !selectedCategory.value) {
    return templates.value
  }
  return templates.value.filter(t => t.category === selectedCategory.value)
})

// Methods
const useTemplate = (id) => {
  router.push(`/create?template=${id}`)
}

const createTemplate = () => {
  router.push('/create?saveAsTemplate=true')
}

const editTemplate = (id) => {
  router.push(`/template/${id}/edit`)
}

const deleteTemplate = (id) => {
  if (confirm('Are you sure you want to delete this template?')) {
    templates.value = templates.value.filter(t => t.id !== id)
  }
}
</script>

<style scoped>
.template-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.template-card:hover {
  transform: translateY(-2px);
}
</style>