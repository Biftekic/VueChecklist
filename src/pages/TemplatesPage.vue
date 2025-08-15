<template>
  <MainLayout title="Select Template">
    <v-container class="pa-4">
      <h2 class="mb-4">Choose Industry Type</h2>
      
      <v-row>
        <v-col
          v-for="industry in industries"
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
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplatesStore } from '@/stores/templates'
import { useChecklistsStore } from '@/stores/checklists'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const templatesStore = useTemplatesStore()
const checklistsStore = useChecklistsStore()

const industries = ref([
  'office',
  'residential',
  'medical',
  'hospitality',
  'restaurant',
  'retail',
  'airbnb',
  'moveinout'
])

const selectIndustry = (industry) => {
  // Store selected industry in new checklist
  checklistsStore.updateNewChecklist({ industry })
  // Navigate to create page
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
    moveinout: 'Move In/Out'
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
</style>