<template>
  <div class="home-page pa-4">
    <v-container>
      <h1 class="text-h3 mb-4">Cleaning Checklist Pro</h1>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Welcome Back!</v-card-title>
            <v-card-text>
              Manage your cleaning checklists efficiently
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Quick Actions</v-card-title>
            <v-card-text>
              <v-btn color="primary" @click="navigateTo('/create')" block class="mb-2">
                Create New Checklist
              </v-btn>
              <v-btn color="secondary" @click="navigateTo('/checklists')" block class="mb-2">
                View All Checklists
              </v-btn>
              <v-btn @click="navigateTo('/templates')" block>
                Browse Templates
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>Navigation Menu</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item @click="navigateTo('/checklists')">
                  <v-list-item-title>📋 My Checklists</v-list-item-title>
                </v-list-item>
                <v-list-item @click="navigateTo('/templates')">
                  <v-list-item-title>📄 Templates</v-list-item-title>
                </v-list-item>
                <v-list-item @click="navigateTo('/create')">
                  <v-list-item-title>➕ Create New</v-list-item-title>
                </v-list-item>
                <v-list-item @click="navigateTo('/inventory')">
                  <v-list-item-title>📦 Inventory</v-list-item-title>
                </v-list-item>
                <v-list-item @click="navigateTo('/settings')">
                  <v-list-item-title>⚙️ Settings</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  console.log('Navigating to:', path)
  router.push(path)
}

console.log('HomePage.vue loaded - with working navigation')
</script>