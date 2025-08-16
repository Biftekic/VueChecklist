<template>
  <div>
    <v-skeleton-loader
      v-for="i in fields"
      :key="i"
      type="text"
      :loading="true"
      :boilerplate="false"
      class="mb-4"
    />
    <v-skeleton-loader
      type="button"
      :loading="true"
      :boilerplate="false"
      class="mt-4"
    />
  </div>
</template>

<script setup>
defineProps({
  fields: {
    type: Number,
    default: 4
  }
})
</script>