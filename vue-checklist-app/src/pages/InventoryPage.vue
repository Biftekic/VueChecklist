<template>
  <MainLayout title="Inventory">
    <v-container class="pa-4">
      <!-- Header with Action Button -->
      <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h4">Inventory</h1>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="addItem"
        >
          Add Item
        </v-btn>
      </div>

      <!-- Category Tabs -->
      <v-tabs
        v-model="selectedCategory"
        class="mb-4"
        color="primary"
      >
        <v-tab value="all">All</v-tab>
        <v-tab value="supplies">Supplies</v-tab>
        <v-tab value="equipment">Equipment</v-tab>
        <v-tab value="chemicals">Chemicals</v-tab>
      </v-tabs>

      <!-- Inventory Grid -->
      <v-row>
        <v-col
          v-for="item in filteredItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card elevation="2">
            <v-card-title>
              <v-icon left class="mr-2" :color="getCategoryColor(item.category)">
                {{ getCategoryIcon(item.category) }}
              </v-icon>
              {{ item.name }}
            </v-card-title>
            
            <v-card-subtitle>
              {{ item.category }}
            </v-card-subtitle>

            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2">Quantity:</span>
                <v-chip :color="getStockLevelColor(item.quantity, item.minStock)">
                  {{ item.quantity }} {{ item.unit }}
                </v-chip>
              </div>
              
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2">Min Stock:</span>
                <span>{{ item.minStock }} {{ item.unit }}</span>
              </div>
              
              <v-progress-linear
                :value="getStockPercentage(item.quantity, item.minStock)"
                :color="getStockLevelColor(item.quantity, item.minStock)"
                height="8"
                rounded
                class="mb-2"
              />
              
              <v-alert
                v-if="item.quantity <= item.minStock"
                type="warning"
                density="compact"
                variant="tonal"
                class="mt-2"
              >
                Low stock - reorder needed
              </v-alert>
            </v-card-text>

            <v-card-actions>
              <v-btn
                icon
                @click="decreaseQuantity(item)"
                :disabled="item.quantity <= 0"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              
              <v-text-field
                v-model.number="item.quantity"
                type="number"
                density="compact"
                hide-details
                variant="outlined"
                class="mx-2"
                style="max-width: 80px"
              />
              
              <v-btn
                icon
                @click="increaseQuantity(item)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              
              <v-spacer />
              
              <v-btn
                icon
                @click="editItem(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              
              <v-btn
                icon
                @click="deleteItem(item.id)"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card
        v-if="filteredItems.length === 0"
        class="pa-8 text-center"
        elevation="0"
        color="grey-lighten-4"
      >
        <v-icon size="64" color="grey">
          mdi-package-variant-closed
        </v-icon>
        <v-card-title class="text-grey">
          No inventory items
        </v-card-title>
        <v-card-subtitle>
          {{ selectedCategory === 'all' ? 'Add your first inventory item' : `No items in ${selectedCategory} category` }}
        </v-card-subtitle>
        <v-btn
          color="primary"
          class="mt-4"
          @click="addItem"
        >
          Add First Item
        </v-btn>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { logger } from "@/services/logger"
import { ref, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'

// State
const selectedCategory = ref('all')

// Sample inventory items
const items = ref([
  {
    id: '1',
    name: 'All-Purpose Cleaner',
    category: 'chemicals',
    quantity: 5,
    minStock: 3,
    unit: 'bottles'
  },
  {
    id: '2',
    name: 'Microfiber Cloths',
    category: 'supplies',
    quantity: 20,
    minStock: 10,
    unit: 'pieces'
  },
  {
    id: '3',
    name: 'Vacuum Cleaner',
    category: 'equipment',
    quantity: 2,
    minStock: 1,
    unit: 'units'
  },
  {
    id: '4',
    name: 'Glass Cleaner',
    category: 'chemicals',
    quantity: 2,
    minStock: 4,
    unit: 'bottles'
  },
  {
    id: '5',
    name: 'Mop Heads',
    category: 'supplies',
    quantity: 8,
    minStock: 5,
    unit: 'pieces'
  },
  {
    id: '6',
    name: 'Disinfectant',
    category: 'chemicals',
    quantity: 10,
    minStock: 6,
    unit: 'bottles'
  }
])

// Computed
const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return items.value
  }
  return items.value.filter(item => item.category === selectedCategory.value)
})

// Methods
const getCategoryIcon = (category) => {
  const icons = {
    supplies: 'mdi-package-variant',
    equipment: 'mdi-tools',
    chemicals: 'mdi-flask'
  }
  return icons[category] || 'mdi-package'
}

const getCategoryColor = (category) => {
  const colors = {
    supplies: 'blue',
    equipment: 'orange',
    chemicals: 'purple'
  }
  return colors[category] || 'grey'
}

const getStockLevelColor = (quantity, minStock) => {
  if (quantity <= 0) return 'error'
  if (quantity <= minStock) return 'warning'
  if (quantity <= minStock * 2) return 'orange'
  return 'success'
}

const getStockPercentage = (quantity, minStock) => {
  const maxStock = minStock * 3 // Assume max is 3x minimum
  return Math.min((quantity / maxStock) * 100, 100)
}

const increaseQuantity = (item) => {
  item.quantity++
}

const decreaseQuantity = (item) => {
  if (item.quantity > 0) {
    item.quantity--
  }
}

const addItem = () => {
  logger.debug('Add new item')
  // Open dialog to add new item
  alert('Add item feature coming soon!')
}

const editItem = (item) => {
  logger.debug('Edit item:', item)
  // Open dialog to edit item
  alert('Edit feature coming soon!')
}

const deleteItem = (id) => {
  if (confirm('Are you sure you want to delete this item?')) {
    items.value = items.value.filter(item => item.id !== id)
  }
}
</script>

<style scoped>
.v-text-field {
  text-align: center;
}
</style>