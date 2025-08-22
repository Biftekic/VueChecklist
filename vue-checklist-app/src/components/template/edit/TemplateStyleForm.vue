<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-select
        :model-value="icon"
        @update:model-value="$emit('update:icon', $event)"
        label="Icon"
        :items="availableIcons"
        prepend-icon="mdi-shape"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon>{{ item.value }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
        <template v-slot:selection="{ item }">
          <v-icon class="mr-2">{{ item.value }}</v-icon>
          {{ item.title }}
        </template>
      </v-select>
    </v-col>
    
    <v-col cols="12" sm="6">
      <v-select
        :model-value="color"
        @update:model-value="$emit('update:color', $event)"
        label="Color"
        :items="availableColors"
        prepend-icon="mdi-palette"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon :color="item.value">mdi-circle</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
        <template v-slot:selection="{ item }">
          <v-icon :color="item.value" class="mr-2">mdi-circle</v-icon>
          {{ item.title }}
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  color: string
}

defineProps<Props>()

defineEmits<{
  'update:icon': [value: string]
  'update:color': [value: string]
}>()

const availableIcons = [
  { title: 'Home', value: 'mdi-home' },
  { title: 'Office', value: 'mdi-office-building' },
  { title: 'Kitchen', value: 'mdi-silverware-fork-knife' },
  { title: 'Bathroom', value: 'mdi-shower' },
  { title: 'Bedroom', value: 'mdi-bed' },
  { title: 'Living Room', value: 'mdi-sofa' },
  { title: 'Truck', value: 'mdi-truck' },
  { title: 'Lightning', value: 'mdi-lightning-bolt' },
  { title: 'Star', value: 'mdi-star' },
  { title: 'Check', value: 'mdi-check-circle' }
]

const availableColors = [
  { title: 'Primary', value: 'primary' },
  { title: 'Blue', value: 'blue' },
  { title: 'Green', value: 'green' },
  { title: 'Orange', value: 'orange' },
  { title: 'Red', value: 'red' },
  { title: 'Purple', value: 'purple' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Yellow', value: 'yellow-darken-3' },
  { title: 'Teal', value: 'teal' },
  { title: 'Indigo', value: 'indigo' }
]
</script>