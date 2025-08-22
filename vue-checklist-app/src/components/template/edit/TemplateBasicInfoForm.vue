<template>
  <div>
    <v-text-field
      :model-value="name"
      @update:model-value="$emit('update:name', $event)"
      label="Template Name"
      :rules="[v => !!v || 'Template name is required']"
      required
      prepend-icon="mdi-file-document"
      class="mb-4"
    />

    <v-select
      :model-value="category"
      @update:model-value="$emit('update:category', $event)"
      label="Category"
      :items="categories"
      prepend-icon="mdi-folder"
      class="mb-4"
    />

    <v-textarea
      :model-value="description"
      @update:model-value="$emit('update:description', $event)"
      label="Description"
      rows="3"
      prepend-icon="mdi-text"
      class="mb-4"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  category: string
  description: string
}

defineProps<Props>()

defineEmits<{
  'update:name': [value: string]
  'update:category': [value: string]
  'update:description': [value: string]
}>()

const categories = [
  'Residential',
  'Commercial',
  'Deep Clean',
  'Special',
  'Maintenance',
  'Custom'
]
</script>