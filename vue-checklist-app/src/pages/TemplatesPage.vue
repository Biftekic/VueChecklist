<template>
  <MainLayout title="Select Template">
    <v-container class="pa-4">
      <!-- Search Bar -->
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search templates..."
        variant="outlined"
        density="compact"
        clearable
        class="mb-4"
        hide-details
      />

      <h2 class="mb-4">Choose Industry Type</h2>
      
      <v-row>
        <v-col
          v-for="industry in filteredIndustries"
          :key="industry"
          cols="6"
          sm="4"
          md="3"
        >
          <v-card
            @click="selectIndustry(industry)"
            class="pa-4 text-center industry-card"
            :color="getIndustryColor(industry)"
            elevation="2"
            rounded="xl"
            height="120"
          >
            <v-icon
              size="48"
              color="white"
              class="mb-2"
            >
              {{ getIndustryIcon(industry) }}
            </v-icon>
            <v-card-title class="text-body-2 text-white text-capitalize">
              {{ formatIndustryName(industry) }}
            </v-card-title>
          </v-card>
        </v-col>

        <!-- Custom Template Card -->
        <v-col cols="6" sm="4" md="3">
          <v-card
            @click="createCustom"
            class="pa-4 text-center industry-card custom-card"
            variant="outlined"
            height="120"
          >
            <v-icon
              size="48"
              color="grey"
              class="mb-2"
            >
              mdi-plus-circle-outline
            </v-icon>
            <v-card-title class="text-body-2 text-grey">
              Custom
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card
        v-if="filteredIndustries.length === 0 && searchQuery"
        flat
        class="pa-8 text-center mt-8"
        color="grey-lighten-4"
      >
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-magnify
        </v-icon>
        <h3 class="text-h6 mb-2">No matching templates</h3>
        <p class="text-body-2 text-medium-emphasis">
          Try adjusting your search
        </p>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplatesStore } from '@/stores/templates'
import { useChecklistsStore } from '@/stores/checklists'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const templatesStore = useTemplatesStore()
const checklistsStore = useChecklistsStore()

const searchQuery = ref('')

const industries = ref([
  'office',
  'residential',
  'medical',
  'hospitality',
  'restaurant',
  'retail',
  'airbnb',
  'moveinout',
  'postconstruction',
  'education',
  'gym',
  'bank',
  'warehouse',
  'salon',
  'church',
  'daycare',
  'spa'
])

const filteredIndustries = computed(() => {
  if (!searchQuery.value) return industries.value
  
  const query = searchQuery.value.toLowerCase()
  return industries.value.filter(industry => {
    const name = formatIndustryName(industry).toLowerCase()
    return name.includes(query)
  })
})

const selectIndustry = (industry) => {
  // Store selected industry in new checklist
  checklistsStore.updateNewChecklist({ industry })
  // Navigate to create page with template
  router.push(`/create?template=${industry}`)
}

const createCustom = () => {
  // Navigate to create page without template
  router.push('/create')
}

const getIndustryColor = (industry) => {
  return templatesStore.getIndustryColor(industry)
}

const getIndustryIcon = (industry) => {
  return templatesStore.getIndustryIcon(industry)
}

const formatIndustryName = (industry) => {
  const names = {
    office: 'Office',
    residential: 'Residential',
    medical: 'Medical',
    hospitality: 'Hospitality',
    restaurant: 'Restaurant',
    retail: 'Retail',
    airbnb: 'Airbnb',
    moveinout: 'Move In/Out',
    postconstruction: 'Post-Construction',
    education: 'School',
    gym: 'Gym/Fitness',
    bank: 'Bank',
    warehouse: 'Warehouse',
    salon: 'Salon/Spa',
    church: 'Church',
    daycare: 'Daycare',
    spa: 'Spa/Wellness'
  }
  return names[industry] || industry
}
</script>

<style scoped>
.industry-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.industry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.industry-card:active {
  transform: scale(0.95);
}

.custom-card {
  border: 2px dashed #ccc;
  background: transparent;
}

.custom-card:hover {
  border-color: var(--v-primary-base);
  background: rgba(var(--v-primary-base-rgb), 0.05);
}
</style>