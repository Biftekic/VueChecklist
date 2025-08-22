<template>
  <v-card v-if="clientInfo" flat class="mb-2">
    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon class="mr-2">mdi-account</v-icon>
        <span class="text-subtitle-1 font-weight-medium">Client Information</span>
      </div>
      
      <v-row dense>
        <v-col v-if="clientInfo.name" cols="12" sm="6">
          <div class="text-caption text-medium-emphasis">Name</div>
          <div class="text-body-2">{{ clientInfo.name }}</div>
        </v-col>
        
        <v-col v-if="clientInfo.frequency" cols="12" sm="6">
          <div class="text-caption text-medium-emphasis">Frequency</div>
          <div class="text-body-2">{{ clientInfo.frequency }}</div>
        </v-col>
        
        <v-col v-if="clientInfo.email" cols="12" sm="6">
          <div class="text-caption text-medium-emphasis">Email</div>
          <div class="text-body-2">
            <a :href="`mailto:${clientInfo.email}`" class="text-decoration-none">
              {{ clientInfo.email }}
            </a>
          </div>
        </v-col>
        
        <v-col v-if="clientInfo.phone" cols="12" sm="6">
          <div class="text-caption text-medium-emphasis">Phone</div>
          <div class="text-body-2">
            <a :href="`tel:${clientInfo.phone}`" class="text-decoration-none">
              {{ clientInfo.phone }}
            </a>
          </div>
        </v-col>
        
        <v-col v-if="clientInfo.address" cols="12">
          <div class="text-caption text-medium-emphasis">Address</div>
          <div class="text-body-2">{{ clientInfo.address }}</div>
        </v-col>
        
        <v-col v-if="clientInfo.notes" cols="12">
          <div class="text-caption text-medium-emphasis">Notes</div>
          <div class="text-body-2">{{ clientInfo.notes }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { ClientInfo } from '@/stores/checklistStore'

defineProps<{
  clientInfo: ClientInfo | null
}>()
</script>