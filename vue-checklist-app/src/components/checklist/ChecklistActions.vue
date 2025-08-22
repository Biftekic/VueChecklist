<template>
  <v-speed-dial
    v-model="fab"
    location="bottom end"
    transition="slide-y-reverse-transition"
    :style="{ position: 'fixed', bottom: '16px', right: '16px' }"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        icon
        size="large"
      >
        <v-icon>{{ fab ? 'mdi-close' : 'mdi-dots-vertical' }}</v-icon>
      </v-btn>
    </template>
    
    <v-btn
      key="edit"
      color="secondary"
      icon="mdi-pencil"
      size="small"
      @click="$emit('edit')"
    />
    
    <v-btn
      key="share"
      color="info"
      icon="mdi-share-variant"
      size="small"
      @click="$emit('share')"
    />
    
    <v-btn
      key="export"
      color="success"
      icon="mdi-download"
      size="small"
      @click="$emit('export')"
    />
    
    <v-btn
      key="delete"
      color="error"
      icon="mdi-delete"
      size="small"
      @click="$emit('delete')"
    />
  </v-speed-dial>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

defineEmits<{
  edit: []
  share: []
  export: []
  delete: []
}>()

const fab = ref(false)
</script>