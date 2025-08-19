<template>
  <MainLayout title="Cleaning Checklist Pro">
    <v-container class="pa-4">
      <!-- Welcome Card -->
      <v-card class="mb-6 elevation-4 welcome-card">
        <v-card-text class="text-center pa-8">
          <v-icon size="80" color="primary" class="mb-4">
            mdi-home-heart
          </v-icon>
          <h1 class="text-h4 font-weight-bold mb-2">Welcome Back!</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Professional cleaning management made simple
          </p>
        </v-card-text>
      </v-card>

      <!-- Quick Actions -->
      <v-row>
        <v-col cols="12" sm="6">
          <v-card 
            class="action-card elevation-3" 
            @click="navigateTo('/create')"
            hover
          >
            <v-card-text class="text-center pa-6">
              <v-icon size="48" color="success" class="mb-3">
                mdi-plus-circle
              </v-icon>
              <h3 class="text-h6 font-weight-medium">Create New Checklist</h3>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Start a new cleaning project
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card 
            class="action-card elevation-3" 
            @click="navigateTo('/checklists')"
            hover
          >
            <v-card-text class="text-center pa-6">
              <v-icon size="48" color="info" class="mb-3">
                mdi-format-list-checks
              </v-icon>
              <h3 class="text-h6 font-weight-medium">View Checklists</h3>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Browse existing checklists
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card 
            class="action-card elevation-3" 
            @click="navigateTo('/templates')"
            hover
          >
            <v-card-text class="text-center pa-6">
              <v-icon size="48" color="warning" class="mb-3">
                mdi-file-document-multiple
              </v-icon>
              <h3 class="text-h6 font-weight-medium">Templates</h3>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Use pre-built templates
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card 
            class="action-card elevation-3" 
            @click="navigateTo('/inventory')"
            hover
          >
            <v-card-text class="text-center pa-6">
              <v-icon size="48" color="purple" class="mb-3">
                mdi-package-variant
              </v-icon>
              <h3 class="text-h6 font-weight-medium">Inventory</h3>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Manage supplies & equipment
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Stats Section -->
      <v-card class="mt-6 elevation-3 stats-card">
        <v-card-title class="text-h6">
          <v-icon class="mr-2">mdi-chart-box</v-icon>
          Quick Stats
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="text-center">
                <div class="text-h4 font-weight-bold text-primary">0</div>
                <div class="text-caption">Active Checklists</div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-center">
                <div class="text-h4 font-weight-bold text-success">0</div>
                <div class="text-caption">Completed Today</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}

console.log('HomePageSimple loaded - no stores')
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-card .v-icon {
  color: white !important;
}

.action-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

.stats-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>