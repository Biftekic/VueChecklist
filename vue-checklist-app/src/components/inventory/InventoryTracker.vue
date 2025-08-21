<template>
  <v-container fluid class="pa-0">
    <!-- Header with Stats -->
    <v-card flat class="mb-3">
      <v-card-text>
        <h2 class="text-h5 font-weight-bold mb-3">Inventory Management</h2>
        
        <!-- Quick Stats -->
        <v-row>
          <v-col cols="6" md="3">
            <v-card color="primary" variant="tonal">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ inventoryValue.total | currency }}</div>
                <div class="text-caption">Total Inventory Value</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card color="warning" variant="tonal">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ lowStockCount }}</div>
                <div class="text-caption">Low Stock Items</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card color="error" variant="tonal">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ pendingReorders }}</div>
                <div class="text-caption">Pending Reorders</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card color="info" variant="tonal">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ maintenanceAlerts }}</div>
                <div class="text-caption">Maintenance Due</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabs for different sections -->
    <v-tabs
      v-model="activeTab"
      color="primary"
      align-tabs="center"
      class="mb-3"
    >
      <v-tab value="supplies">
        <v-icon start size="small">mdi-bottle-tonic</v-icon>
        Supplies
      </v-tab>
      <v-tab value="equipment">
        <v-icon start size="small">mdi-tools</v-icon>
        Equipment
      </v-tab>
      <v-tab value="usage">
        <v-icon start size="small">mdi-chart-line</v-icon>
        Usage
      </v-tab>
      <v-tab value="costs">
        <v-icon start size="small">mdi-currency-usd</v-icon>
        Costs
      </v-tab>
    </v-tabs>

    <!-- Tab Content -->
    <v-window v-model="activeTab">
      <!-- Supplies Tab -->
      <v-window-item value="supplies">
        <v-card flat>
          <v-card-title>
            <div class="d-flex justify-space-between align-center" style="width: 100%">
              <span>Chemical & Supply Inventory</span>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="addSupplyDialog = true"
              >
                Add Supply
              </v-btn>
            </div>
          </v-card-title>
          
          <!-- Category Filter -->
          <v-card-text>
            <v-chip-group
              v-model="selectedCategory"
              class="mb-3"
            >
              <v-chip
                value="all"
                variant="outlined"
              >
                All Categories
              </v-chip>
              <v-chip
                v-for="category in supplyCategories"
                :key="category"
                :value="category"
                variant="outlined"
              >
                {{ category }}
              </v-chip>
            </v-chip-group>

            <!-- Supplies Table -->
            <v-data-table
              :headers="supplyHeaders"
              :items="filteredSupplies"
              :search="searchQuery"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  label="Search supplies..."
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mb-3"
                />
              </template>

              <template v-slot:item.currentStock="{ item }">
                <v-chip
                  :color="getStockColor(item)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.currentStock }} {{ item.unit }}
                </v-chip>
              </template>

              <template v-slot:item.costPerUnit="{ item }">
                ${{ item.costPerUnit.toFixed(2) }}
              </template>

              <template v-slot:item.totalValue="{ item }">
                ${{ (item.currentStock * item.costPerUnit).toFixed(2) }}
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item.currentStock <= item.reorderPoint"
                  color="error"
                  size="small"
                  variant="tonal"
                >
                  Reorder Needed
                </v-chip>
                <v-chip
                  v-else-if="item.currentStock <= item.reorderPoint * 1.5"
                  color="warning"
                  size="small"
                  variant="tonal"
                >
                  Low Stock
                </v-chip>
                <v-chip
                  v-else
                  color="success"
                  size="small"
                  variant="tonal"
                >
                  In Stock
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editSupply(item)"
                />
                <v-btn
                  icon="mdi-package-variant"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="restockSupply(item)"
                />
                <v-btn
                  icon="mdi-chart-line"
                  size="small"
                  variant="text"
                  @click="viewUsageHistory(item)"
                />
              </template>
            </v-data-table>

            <!-- Reorder Alerts -->
            <v-alert
              v-if="reorderAlerts.length > 0"
              type="warning"
              class="mt-3"
              title="Reorder Alerts"
            >
              <v-list density="compact">
                <v-list-item
                  v-for="alert in reorderAlerts"
                  :key="alert.id"
                >
                  <v-list-item-title>
                    {{ alert.supplyName }} - Only {{ alert.currentStock }} {{ alert.unit }} remaining
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-btn
                      size="small"
                      color="primary"
                      @click="processReorder(alert)"
                    >
                      Order {{ alert.reorderQuantity }} units
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Equipment Tab -->
      <v-window-item value="equipment">
        <v-card flat>
          <v-card-title>
            <div class="d-flex justify-space-between align-center" style="width: 100%">
              <span>Equipment & Tools</span>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="addEquipmentDialog = true"
              >
                Add Equipment
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <!-- Equipment Cards -->
            <v-row>
              <v-col
                v-for="equipment in equipmentList"
                :key="equipment.id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card outlined>
                  <v-card-title class="d-flex justify-space-between">
                    <span>{{ equipment.name }}</span>
                    <v-chip
                      :color="getEquipmentStatusColor(equipment.status)"
                      size="small"
                      variant="tonal"
                    >
                      {{ equipment.status }}
                    </v-chip>
                  </v-card-title>

                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small">mdi-calendar</v-icon>
                        </template>
                        <v-list-item-title>
                          Purchased: {{ formatDate(equipment.purchaseDate) }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small">mdi-wrench</v-icon>
                        </template>
                        <v-list-item-title>
                          Last Maintenance: {{ formatDate(equipment.lastMaintenance) }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small">mdi-clock-alert</v-icon>
                        </template>
                        <v-list-item-title>
                          Next Due: {{ getNextMaintenanceDate(equipment) }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small">mdi-currency-usd</v-icon>
                        </template>
                        <v-list-item-title>
                          Value: ${{ calculateEquipmentValue(equipment).toFixed(2) }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>

                    <v-progress-linear
                      :model-value="getEquipmentLifespan(equipment)"
                      height="6"
                      rounded
                      :color="getEquipmentLifespanColor(equipment)"
                      class="mt-3"
                    />
                    <div class="text-caption text-center mt-1">
                      {{ getEquipmentLifespan(equipment) }}% of expected lifespan
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      variant="text"
                      color="warning"
                      prepend-icon="mdi-wrench"
                      @click="scheduleMaintenance(equipment)"
                    >
                      Maintenance
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      variant="text"
                      icon="mdi-pencil"
                      @click="editEquipment(equipment)"
                    />
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- Maintenance Alerts -->
            <v-alert
              v-if="maintenanceAlertsList.length > 0"
              type="info"
              class="mt-3"
              title="Maintenance Schedule"
            >
              <v-list density="compact">
                <v-list-item
                  v-for="alert in maintenanceAlertsList"
                  :key="alert.id"
                >
                  <template v-slot:prepend>
                    <v-icon
                      :color="alert.priority === 'high' ? 'error' : 'warning'"
                    >
                      mdi-wrench-clock
                    </v-icon>
                  </template>
                  <v-list-item-title>
                    {{ alert.equipmentName }} - {{ alert.description }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-btn
                      size="small"
                      :color="alert.priority === 'high' ? 'error' : 'primary'"
                      @click="completeMaintenance(alert)"
                    >
                      Complete
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Usage Tab -->
      <v-window-item value="usage">
        <v-card flat>
          <v-card-title>Usage Tracking & Analytics</v-card-title>
          <v-card-text>
            <!-- Date Range Selector -->
            <v-row class="mb-3">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="usageDateRange.start"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="usageDateRange.end"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>

            <!-- Top Used Supplies Chart -->
            <v-card outlined class="mb-3">
              <v-card-title>Top Used Supplies</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(supply, index) in topUsedSupplies"
                    :key="index"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" variant="tonal">
                        {{ index + 1 }}
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ supply.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ supply.totalQuantity }} {{ supply.unit }} used
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="text-right">
                        <div class="font-weight-bold">${{ supply.totalCost.toFixed(2) }}</div>
                        <div class="text-caption">{{ supply.usageCount }} times</div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Supply Predictions -->
            <v-card outlined>
              <v-card-title>30-Day Supply Predictions</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="predictionHeaders"
                  :items="supplyPredictions"
                  density="compact"
                >
                  <template v-slot:item.daysUntilEmpty="{ item }">
                    <v-chip
                      :color="item.daysUntilEmpty < 7 ? 'error' : item.daysUntilEmpty < 14 ? 'warning' : 'success'"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.daysUntilEmpty }} days
                    </v-chip>
                  </template>

                  <template v-slot:item.needsReorder="{ item }">
                    <v-icon
                      :color="item.needsReorder ? 'error' : 'success'"
                    >
                      {{ item.needsReorder ? 'mdi-alert' : 'mdi-check' }}
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Costs Tab -->
      <v-window-item value="costs">
        <v-card flat>
          <v-card-title>Cost Analysis & Reports</v-card-title>
          <v-card-text>
            <!-- Monthly Cost Breakdown -->
            <v-row>
              <v-col cols="12" md="4">
                <v-card color="blue-grey" variant="tonal">
                  <v-card-text class="text-center">
                    <v-icon size="x-large" class="mb-2">mdi-bottle-tonic</v-icon>
                    <div class="text-h5 font-weight-bold">
                      ${{ monthlyCosts.supplies.toFixed(2) }}
                    </div>
                    <div class="text-caption">Supply Costs</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="orange" variant="tonal">
                  <v-card-text class="text-center">
                    <v-icon size="x-large" class="mb-2">mdi-package-variant</v-icon>
                    <div class="text-h5 font-weight-bold">
                      ${{ monthlyCosts.reorders.toFixed(2) }}
                    </div>
                    <div class="text-caption">Reorder Costs</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="purple" variant="tonal">
                  <v-card-text class="text-center">
                    <v-icon size="x-large" class="mb-2">mdi-wrench</v-icon>
                    <div class="text-h5 font-weight-bold">
                      ${{ monthlyCosts.maintenance.toFixed(2) }}
                    </div>
                    <div class="text-caption">Maintenance Costs</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Cost by Checklist -->
            <v-card outlined class="mt-3">
              <v-card-title>Recent Checklist Costs</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="checklist in recentChecklistCosts"
                    :key="checklist.id"
                  >
                    <v-list-item-title>{{ checklist.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDate(checklist.date) }} - {{ checklist.itemCount }} items used
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="text-h6 font-weight-bold">
                        ${{ checklist.totalCost.toFixed(2) }}
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Export Options -->
            <v-card outlined class="mt-3">
              <v-card-title>Export Reports</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-file-excel"
                      @click="exportToExcel"
                    >
                      Export to Excel
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-file-pdf-box"
                      @click="exportToPDF"
                    >
                      Export to PDF
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Add Supply Dialog -->
    <v-dialog v-model="addSupplyDialog" max-width="600">
      <v-card>
        <v-card-title>Add New Supply</v-card-title>
        <v-card-text>
          <v-form ref="supplyForm">
            <v-text-field
              v-model="newSupply.name"
              label="Supply Name"
              required
              variant="outlined"
              density="compact"
            />
            <v-select
              v-model="newSupply.category"
              :items="supplyCategories"
              label="Category"
              variant="outlined"
              density="compact"
            />
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newSupply.currentStock"
                  label="Current Stock"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="newSupply.unit"
                  :items="unitTypes"
                  label="Unit"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newSupply.reorderPoint"
                  label="Reorder Point"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newSupply.reorderQuantity"
                  label="Reorder Quantity"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
            <v-text-field
              v-model.number="newSupply.costPerUnit"
              label="Cost Per Unit ($)"
              type="number"
              step="0.01"
              variant="outlined"
              density="compact"
            />
            <v-checkbox
              v-model="newSupply.hazardous"
              label="Hazardous Material"
              density="compact"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="addSupplyDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveSupply">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Restock Dialog -->
    <v-dialog v-model="restockDialog" max-width="500">
      <v-card>
        <v-card-title>Restock Supply</v-card-title>
        <v-card-text>
          <div v-if="selectedSupply">
            <h4 class="text-subtitle-1 mb-3">{{ selectedSupply.name }}</h4>
            <v-text-field
              v-model.number="restockQuantity"
              label="Quantity to Add"
              type="number"
              variant="outlined"
              density="compact"
              :suffix="selectedSupply.unit"
            />
            <v-text-field
              v-model.number="restockCost"
              label="Total Cost ($)"
              type="number"
              step="0.01"
              variant="outlined"
              density="compact"
            />
            <v-alert type="info" density="compact" class="mt-2">
              Current Stock: {{ selectedSupply.currentStock }} {{ selectedSupply.unit }}
              <br>
              After Restock: {{ selectedSupply.currentStock + restockQuantity }} {{ selectedSupply.unit }}
            </v-alert>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="restockDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmRestock">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { logger } from "@/services/logger"
import { ref, computed, onMounted } from 'vue'
import inventoryService from '@/services/inventoryService'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// State
const activeTab = ref('supplies')
const searchQuery = ref('')
const selectedCategory = ref('all')
const addSupplyDialog = ref(false)
const addEquipmentDialog = ref(false)
const restockDialog = ref(false)
const selectedSupply = ref(null)
const restockQuantity = ref(0)
const restockCost = ref(0)

// Data
const supplies = ref([])
const equipmentList = ref([])
const reorderAlerts = ref([])
const maintenanceAlertsList = ref([])
const topUsedSupplies = ref([])
const supplyPredictions = ref([])
const recentChecklistCosts = ref([])
const inventoryValue = ref({ total: 0, supplies: 0, equipment: 0 })
const monthlyCosts = ref({ supplies: 0, reorders: 0, maintenance: 0 })

// Form data
const newSupply = ref({
  name: '',
  category: 'Chemicals',
  currentStock: 0,
  unit: 'bottle',
  reorderPoint: 5,
  reorderQuantity: 10,
  costPerUnit: 0,
  hazardous: false
})

// Date range for usage tracking
const usageDateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

// Constants
const supplyCategories = [
  'Chemicals',
  'Tools & Equipment',
  'Consumables',
  'Safety Equipment',
  'Paper Products',
  'Other'
]

const unitTypes = [
  'bottle',
  'gallon',
  'liter',
  'ounce',
  'pound',
  'kilogram',
  'piece',
  'pack',
  'box',
  'roll',
  'case'
]

// Table headers
const supplyHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Category', key: 'category' },
  { title: 'Current Stock', key: 'currentStock' },
  { title: 'Cost/Unit', key: 'costPerUnit' },
  { title: 'Total Value', key: 'totalValue' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const predictionHeaders = [
  { title: 'Supply', key: 'name' },
  { title: 'Current Stock', key: 'currentStock' },
  { title: 'Daily Average', key: 'dailyAverage' },
  { title: 'Days Until Empty', key: 'daysUntilEmpty' },
  { title: 'Needs Reorder', key: 'needsReorder' }
]

// Computed
const filteredSupplies = computed(() => {
  let filtered = supplies.value
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(s => s.category === selectedCategory.value)
  }
  return filtered
})

const lowStockCount = computed(() => {
  return supplies.value.filter(s => s.currentStock <= s.reorderPoint).length
})

const pendingReorders = computed(() => {
  return reorderAlerts.value.filter(a => a.status === 'pending').length
})

const maintenanceAlerts = computed(() => {
  return maintenanceAlertsList.value.filter(a => a.status === 'pending').length
})

// Methods
const loadInventoryData = async () => {
  try {
    // Initialize inventory if needed
    await inventoryService.initializeInventory()
    
    // Load supplies
    supplies.value = await inventoryService.getAllSupplies()
    
    // Load equipment
    equipmentList.value = await inventoryService.getAllEquipment()
    
    // Load alerts
    reorderAlerts.value = await inventoryService.getReorderAlerts()
    maintenanceAlertsList.value = await inventoryService.getMaintenanceAlerts()
    
    // Load analytics
    topUsedSupplies.value = await inventoryService.getTopUsedSupplies()
    supplyPredictions.value = await inventoryService.predictSupplyNeeds()
    
    // Calculate values
    inventoryValue.value = await inventoryService.getInventoryValue()
    
    // Load monthly costs
    const now = new Date()
    monthlyCosts.value = await inventoryService.calculateMonthlyCosts(
      now.getFullYear(),
      now.getMonth() + 1
    )
    monthlyCosts.value.total = monthlyCosts.value.supplies + 
                               monthlyCosts.value.reorders + 
                               monthlyCosts.value.maintenance
  } catch (error) {
    logger.error('Error loading inventory data:', error)
    appStore.showSnackbar('Failed to load inventory data', 'error')
  }
}

const getStockColor = (item) => {
  if (item.currentStock <= item.reorderPoint) return 'error'
  if (item.currentStock <= item.reorderPoint * 1.5) return 'warning'
  return 'success'
}

const getEquipmentStatusColor = (status) => {
  const colors = {
    'good': 'success',
    'fair': 'warning',
    'needs_repair': 'error',
    'in_repair': 'info',
    'retired': 'grey'
  }
  return colors[status] || 'grey'
}

const getEquipmentLifespan = (equipment) => {
  const age = Math.floor((new Date() - new Date(equipment.purchaseDate)) / (1000 * 60 * 60 * 24))
  return Math.min(Math.round((age / equipment.lifespan) * 100), 100)
}

const getEquipmentLifespanColor = (equipment) => {
  const percentage = getEquipmentLifespan(equipment)
  if (percentage < 50) return 'success'
  if (percentage < 75) return 'warning'
  return 'error'
}

const calculateEquipmentValue = (equipment) => {
  const age = Math.floor((new Date() - new Date(equipment.purchaseDate)) / (1000 * 60 * 60 * 24))
  const depreciationRate = age / equipment.lifespan
  return equipment.costPerUnit * (1 - Math.min(depreciationRate, 0.9))
}

const getNextMaintenanceDate = (equipment) => {
  const lastMaintenance = new Date(equipment.lastMaintenance || equipment.purchaseDate)
  const nextDate = new Date(lastMaintenance)
  nextDate.setDate(nextDate.getDate() + equipment.maintenanceInterval)
  return nextDate.toLocaleDateString()
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString()
}

const editSupply = (supply) => {
  selectedSupply.value = supply
  newSupply.value = { ...supply }
  addSupplyDialog.value = true
}

const saveSupply = async () => {
  try {
    if (newSupply.value.id) {
      await inventoryService.updateSupply(newSupply.value.id, newSupply.value)
    } else {
      await inventoryService.addSupply(newSupply.value)
    }
    await loadInventoryData()
    addSupplyDialog.value = false
    appStore.showSnackbar('Supply saved successfully', 'success')
  } catch (error) {
    logger.error('Error saving supply:', error)
    appStore.showSnackbar('Failed to save supply', 'error')
  }
}

const restockSupply = (supply) => {
  selectedSupply.value = supply
  restockQuantity.value = supply.reorderQuantity || 10
  restockCost.value = restockQuantity.value * supply.costPerUnit
  restockDialog.value = true
}

const confirmRestock = async () => {
  try {
    await inventoryService.updateSupply(selectedSupply.value.id, {
      currentStock: selectedSupply.value.currentStock + restockQuantity.value,
      lastRestocked: new Date().toISOString()
    })
    
    await loadInventoryData()
    restockDialog.value = false
    appStore.showSnackbar('Supply restocked successfully', 'success')
  } catch (error) {
    logger.error('Error restocking supply:', error)
    appStore.showSnackbar('Failed to restock supply', 'error')
  }
}

const viewUsageHistory = (supply) => {
  // Implement usage history view
  logger.debug('View usage history for:', supply)
}

const editEquipment = (equipment) => {
  // Implement equipment edit
  logger.debug('Edit equipment:', equipment)
}

const scheduleMaintenance = async (equipment) => {
  try {
    await inventoryService.createMaintenanceAlert(equipment)
    await loadInventoryData()
    appStore.showSnackbar('Maintenance scheduled', 'success')
  } catch (error) {
    logger.error('Error scheduling maintenance:', error)
    appStore.showSnackbar('Failed to schedule maintenance', 'error')
  }
}

const completeMaintenance = async (alert) => {
  try {
    await inventoryService.completeMaintenance(alert.id, 'Routine maintenance completed', 0)
    await loadInventoryData()
    appStore.showSnackbar('Maintenance completed', 'success')
  } catch (error) {
    logger.error('Error completing maintenance:', error)
    appStore.showSnackbar('Failed to complete maintenance', 'error')
  }
}

const processReorder = async (alert) => {
  try {
    await inventoryService.completeReorder(
      alert.id,
      alert.estimatedCost,
      alert.reorderQuantity
    )
    await loadInventoryData()
    appStore.showSnackbar('Reorder processed successfully', 'success')
  } catch (error) {
    logger.error('Error processing reorder:', error)
    appStore.showSnackbar('Failed to process reorder', 'error')
  }
}

const exportToExcel = () => {
  // Implement Excel export
  appStore.showSnackbar('Excel export feature coming soon', 'info')
}

const exportToPDF = () => {
  // Implement PDF export
  appStore.showSnackbar('PDF export feature coming soon', 'info')
}

// Filters
const currency = (value) => {
  if (!value) return '$0.00'
  return `$${parseFloat(value).toFixed(2)}`
}

// Lifecycle
onMounted(() => {
  loadInventoryData()
})
</script>

<style scoped>
.v-data-table {
  font-size: 0.875rem;
}
</style>