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
              <v-btn color="primary" to="/create" block class="mb-2">
                Create New Checklist
              </v-btn>
              <v-btn color="secondary" to="/checklists" block class="mb-2">
                View All Checklists
              </v-btn>
              <v-btn to="/templates" block>
                Browse Templates
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
console.log('HomePage.vue loaded - simplified version without MainLayout')
</script>