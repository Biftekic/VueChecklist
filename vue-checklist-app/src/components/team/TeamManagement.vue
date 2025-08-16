<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-2">mdi-account-group</v-icon>
      Team Management
      <v-spacer />
      <v-btn
        color="primary"
        size="small"
        variant="tonal"
        @click="addMemberDialog = true"
      >
        <v-icon start>mdi-account-plus</v-icon>
        Add Team Member
      </v-btn>
    </v-card-title>

    <v-card-text>
      <!-- Team Overview -->
      <v-row class="mb-4">
        <v-col cols="12" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="large" color="primary">mdi-account-group</v-icon>
              <div class="text-h4">{{ teamMembers.length }}</div>
              <div class="text-caption">Team Members</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="large" color="green">mdi-check-circle</v-icon>
              <div class="text-h4">{{ availableMembers }}</div>
              <div class="text-caption">Available Today</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="large" color="orange">mdi-clock</v-icon>
              <div class="text-h4">{{ totalAssignedTime }}</div>
              <div class="text-caption">Total Hours</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="large" color="blue">mdi-speedometer</v-icon>
              <div class="text-h4">{{ averageWorkload }}%</div>
              <div class="text-caption">Avg Workload</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Assignment Mode Toggle -->
      <v-btn-toggle
        v-model="assignmentMode"
        mandatory
        color="primary"
        variant="outlined"
        class="mb-4"
      >
        <v-btn value="manual">
          <v-icon start>mdi-hand-back-right</v-icon>
          Manual Assignment
        </v-btn>
        <v-btn value="auto">
          <v-icon start>mdi-robot</v-icon>
          Auto-Assign
        </v-btn>
        <v-btn value="balanced">
          <v-icon start>mdi-scale-balance</v-icon>
          Balanced Load
        </v-btn>
      </v-btn-toggle>

      <!-- Team Members Grid -->
      <v-row>
        <v-col
          v-for="member in teamMembers"
          :key="member.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            :variant="member.selected ? 'elevated' : 'outlined'"
            :color="member.selected ? 'primary' : undefined"
            @click="toggleMemberSelection(member.id)"
            style="cursor: pointer;"
          >
            <v-card-title>
              <v-avatar
                :color="getSkillColor(member.skillLevel)"
                size="32"
                class="mr-2"
              >
                {{ member.name.charAt(0) }}
              </v-avatar>
              {{ member.name }}
              <v-spacer />
              <v-checkbox
                :model-value="member.selected"
                @click.stop
                @update:model-value="toggleMemberSelection(member.id)"
                hide-details
                density="compact"
              />
            </v-card-title>
            
            <v-card-subtitle>
              <v-chip size="x-small" :color="getSkillColor(member.skillLevel)">
                {{ member.skillLevel }}
              </v-chip>
              <v-chip size="x-small" class="ml-1">
                {{ member.experience }} exp
              </v-chip>
            </v-card-subtitle>
            
            <v-card-text>
              <!-- Availability -->
              <div class="mb-2">
                <v-icon size="small">mdi-calendar</v-icon>
                <span class="text-caption ml-1">
                  Available: {{ member.availability }}
                </span>
              </div>
              
              <!-- Specializations -->
              <div v-if="member.specializations.length > 0" class="mb-2">
                <v-icon size="small">mdi-star</v-icon>
                <span class="text-caption ml-1">
                  {{ member.specializations.join(', ') }}
                </span>
              </div>
              
              <!-- Current Assignment -->
              <v-divider class="my-2" />
              <div class="assignment-section">
                <div class="text-overline">Assigned Tasks ({{ member.assignedTasks.length }})</div>
                
                <!-- Assigned Tasks Drop Zone -->
                <draggable
                  v-model="member.assignedTasks"
                  group="tasks"
                  item-key="id"
                  class="task-drop-zone"
                  :class="{ 'drop-active': isDragging }"
                  @change="handleAssignmentChange(member.id)"
                >
                  <template #item="{ element: task }">
                    <v-chip
                      size="small"
                      closable
                      @click:close="unassignTask(member.id, task.id)"
                      class="ma-1"
                    >
                      {{ task.name }}
                      <v-tooltip activator="parent" location="top">
                        {{ task.room }} - {{ task.estimatedTime }} min
                      </v-tooltip>
                    </v-chip>
                  </template>
                  
                  <template #footer>
                    <div v-if="member.assignedTasks.length === 0" class="text-caption text-grey text-center pa-2">
                      Drag tasks here to assign
                    </div>
                  </template>
                </draggable>
                
                <!-- Workload Bar -->
                <v-progress-linear
                  :model-value="getMemberWorkload(member)"
                  :color="getWorkloadColor(getMemberWorkload(member))"
                  height="20"
                  class="mt-2"
                >
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.round(value) }}%</strong>
                  </template>
                </v-progress-linear>
                
                <div class="text-caption text-center mt-1">
                  {{ getMemberTotalTime(member) }} / {{ member.maxHours * 60 }} min
                </div>
              </div>
            </v-card-text>
            
            <v-card-actions>
              <v-btn
                size="small"
                variant="text"
                @click.stop="editMember(member)"
              >
                <v-icon start>mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-spacer />
              <v-btn
                size="small"
                variant="text"
                color="error"
                @click.stop="removeMember(member.id)"
              >
                <v-icon start>mdi-delete</v-icon>
                Remove
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Unassigned Tasks -->
      <v-divider class="my-4" />
      <div class="text-h6 mb-2">
        Unassigned Tasks ({{ unassignedTasks.length }})
      </div>
      
      <v-card variant="outlined">
        <v-card-text>
          <draggable
            v-model="unassignedTasks"
            group="tasks"
            item-key="id"
            class="unassigned-tasks"
          >
            <template #item="{ element: task }">
              <v-chip
                size="small"
                variant="outlined"
                class="ma-1"
                draggable="true"
              >
                <v-icon start size="small">{{ getRoomIcon(task.room) }}</v-icon>
                {{ task.name }}
                <v-tooltip activator="parent" location="top">
                  {{ task.room }} - {{ task.estimatedTime }} min
                </v-tooltip>
              </v-chip>
            </template>
            
            <template #footer>
              <div v-if="unassignedTasks.length === 0" class="text-caption text-grey text-center pa-2">
                All tasks assigned!
              </div>
            </template>
          </draggable>
        </v-card-text>
      </v-card>

      <!-- Auto-Assignment Actions -->
      <v-card v-if="assignmentMode !== 'manual'" variant="outlined" class="mt-4">
        <v-card-text>
          <v-row align="center">
            <v-col>
              <div class="text-subtitle-1">
                {{ assignmentMode === 'auto' ? 'Auto-Assignment' : 'Balanced Load Distribution' }}
              </div>
              <div class="text-caption text-grey">
                {{ assignmentMode === 'auto' 
                  ? 'Assign tasks based on skills and availability' 
                  : 'Distribute workload evenly across team' }}
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                variant="elevated"
                @click="performAutoAssignment"
                :loading="autoAssigning"
              >
                <v-icon start>mdi-auto-fix</v-icon>
                Run Assignment
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card-text>

    <!-- Add/Edit Member Dialog -->
    <v-dialog v-model="addMemberDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ editingMember ? 'Edit' : 'Add' }} Team Member
        </v-card-title>
        
        <v-card-text>
          <v-text-field
            v-model="memberForm.name"
            label="Name"
            variant="outlined"
            density="compact"
            :rules="[v => !!v || 'Name is required']"
            class="mb-3"
          />
          
          <v-text-field
            v-model="memberForm.phone"
            label="Phone"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          
          <v-text-field
            v-model="memberForm.email"
            label="Email"
            variant="outlined"
            density="compact"
            type="email"
            class="mb-3"
          />
          
          <v-select
            v-model="memberForm.skillLevel"
            :items="skillLevels"
            label="Skill Level"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          
          <v-text-field
            v-model.number="memberForm.experience"
            label="Years of Experience"
            variant="outlined"
            density="compact"
            type="number"
            class="mb-3"
          />
          
          <v-select
            v-model="memberForm.specializations"
            :items="specializationOptions"
            label="Specializations"
            variant="outlined"
            density="compact"
            multiple
            chips
            class="mb-3"
          />
          
          <v-select
            v-model="memberForm.availability"
            :items="availabilityOptions"
            label="Availability"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          
          <v-text-field
            v-model.number="memberForm.maxHours"
            label="Max Hours per Day"
            variant="outlined"
            density="compact"
            type="number"
            suffix="hours"
          />
          
          <v-textarea
            v-model="memberForm.notes"
            label="Notes"
            variant="outlined"
            density="compact"
            rows="2"
          />
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeMemberDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="saveMember">
            {{ editingMember ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  existingTeam: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:team', 'assignments-changed'])

// State
const teamMembers = ref([])
const unassignedTasks = ref([])
const assignmentMode = ref('manual')
const addMemberDialog = ref(false)
const editingMember = ref(null)
const isDragging = ref(false)
const autoAssigning = ref(false)

// Form
const memberForm = ref({
  name: '',
  phone: '',
  email: '',
  skillLevel: 'Standard',
  experience: 1,
  specializations: [],
  availability: 'Full Day',
  maxHours: 8,
  notes: ''
})

// Options
const skillLevels = ['Trainee', 'Standard', 'Advanced', 'Expert']
const specializationOptions = [
  'Kitchen Deep Clean',
  'Bathroom Specialist',
  'Floor Care',
  'Window Cleaning',
  'Carpet Cleaning',
  'Organization',
  'Sanitization',
  'Green Cleaning'
]
const availabilityOptions = [
  'Full Day',
  'Morning Only',
  'Afternoon Only',
  'Flexible'
]

// Initialize
const initializeTeam = () => {
  if (props.existingTeam.length > 0) {
    teamMembers.value = props.existingTeam.map(member => ({
      ...member,
      selected: false,
      assignedTasks: member.assignedTasks || []
    }))
  } else {
    // Create default team
    teamMembers.value = [
      {
        id: 'member-1',
        name: 'Alice Johnson',
        skillLevel: 'Expert',
        experience: 5,
        specializations: ['Kitchen Deep Clean', 'Sanitization'],
        availability: 'Full Day',
        maxHours: 8,
        selected: false,
        assignedTasks: []
      },
      {
        id: 'member-2',
        name: 'Bob Smith',
        skillLevel: 'Standard',
        experience: 2,
        specializations: ['Floor Care', 'Window Cleaning'],
        availability: 'Full Day',
        maxHours: 8,
        selected: false,
        assignedTasks: []
      }
    ]
  }
  
  // Initialize unassigned tasks
  unassignedTasks.value = [...props.tasks]
}

// Computed
const availableMembers = computed(() => {
  return teamMembers.value.filter(m => 
    m.availability !== 'Not Available'
  ).length
})

const totalAssignedTime = computed(() => {
  let total = 0
  teamMembers.value.forEach(member => {
    total += getMemberTotalTime(member)
  })
  return Math.round(total / 60) // Convert to hours
})

const averageWorkload = computed(() => {
  if (teamMembers.value.length === 0) return 0
  
  let totalWorkload = 0
  teamMembers.value.forEach(member => {
    totalWorkload += getMemberWorkload(member)
  })
  
  return Math.round(totalWorkload / teamMembers.value.length)
})

// Methods
const getSkillColor = (level) => {
  const colors = {
    'Trainee': 'orange',
    'Standard': 'blue',
    'Advanced': 'purple',
    'Expert': 'green'
  }
  return colors[level] || 'grey'
}

const getMemberTotalTime = (member) => {
  return member.assignedTasks.reduce((total, task) => 
    total + (task.estimatedTime || 0), 0)
}

const getMemberWorkload = (member) => {
  const totalMinutes = getMemberTotalTime(member)
  const maxMinutes = member.maxHours * 60
  return Math.min(100, (totalMinutes / maxMinutes) * 100)
}

const getWorkloadColor = (workload) => {
  if (workload < 60) return 'success'
  if (workload < 80) return 'warning'
  if (workload < 100) return 'orange'
  return 'error'
}

const getRoomIcon = (room) => {
  const icons = {
    'Kitchen': 'mdi-silverware-fork-knife',
    'Bathroom': 'mdi-shower',
    'Bedroom': 'mdi-bed',
    'Living Room': 'mdi-sofa',
    'Office': 'mdi-desk'
  }
  return icons[room] || 'mdi-door'
}

const toggleMemberSelection = (memberId) => {
  const member = teamMembers.value.find(m => m.id === memberId)
  if (member) {
    member.selected = !member.selected
  }
}

const handleAssignmentChange = (memberId) => {
  emit('assignments-changed', {
    memberId,
    assignments: teamMembers.value
  })
}

const unassignTask = (memberId, taskId) => {
  const member = teamMembers.value.find(m => m.id === memberId)
  if (member) {
    const taskIndex = member.assignedTasks.findIndex(t => t.id === taskId)
    if (taskIndex > -1) {
      const task = member.assignedTasks.splice(taskIndex, 1)[0]
      unassignedTasks.value.push(task)
    }
  }
}

const performAutoAssignment = async () => {
  autoAssigning.value = true
  
  // Clear current assignments
  teamMembers.value.forEach(member => {
    unassignedTasks.value.push(...member.assignedTasks)
    member.assignedTasks = []
  })
  
  if (assignmentMode.value === 'auto') {
    // Skill-based assignment
    autoAssignBySkills()
  } else {
    // Balanced load assignment
    balancedLoadAssignment()
  }
  
  setTimeout(() => {
    autoAssigning.value = false
  }, 1000)
}

const autoAssignBySkills = () => {
  const tasksToAssign = [...unassignedTasks.value]
  unassignedTasks.value = []
  
  tasksToAssign.forEach(task => {
    // Find best member for task
    let bestMember = null
    let bestScore = -1
    
    teamMembers.value.forEach(member => {
      if (getMemberWorkload(member) < 90) {
        let score = 0
        
        // Skill level bonus
        if (member.skillLevel === 'Expert') score += 3
        else if (member.skillLevel === 'Advanced') score += 2
        else if (member.skillLevel === 'Standard') score += 1
        
        // Specialization match
        if (task.room === 'Kitchen' && member.specializations.includes('Kitchen Deep Clean')) {
          score += 5
        }
        if (task.room === 'Bathroom' && member.specializations.includes('Bathroom Specialist')) {
          score += 5
        }
        
        // Workload penalty
        score -= getMemberWorkload(member) / 20
        
        if (score > bestScore) {
          bestScore = score
          bestMember = member
        }
      }
    })
    
    if (bestMember) {
      bestMember.assignedTasks.push(task)
    } else {
      unassignedTasks.value.push(task)
    }
  })
}

const balancedLoadAssignment = () => {
  const tasksToAssign = [...unassignedTasks.value]
    .sort((a, b) => b.estimatedTime - a.estimatedTime) // Sort by time desc
  unassignedTasks.value = []
  
  tasksToAssign.forEach(task => {
    // Find member with lowest workload
    let targetMember = null
    let minWorkload = 100
    
    teamMembers.value.forEach(member => {
      const workload = getMemberWorkload(member)
      if (workload < minWorkload && workload + (task.estimatedTime / (member.maxHours * 60) * 100) <= 100) {
        minWorkload = workload
        targetMember = member
      }
    })
    
    if (targetMember) {
      targetMember.assignedTasks.push(task)
    } else {
      unassignedTasks.value.push(task)
    }
  })
}

const editMember = (member) => {
  editingMember.value = member
  memberForm.value = { ...member }
  addMemberDialog.value = true
}

const removeMember = (memberId) => {
  const index = teamMembers.value.findIndex(m => m.id === memberId)
  if (index > -1) {
    const member = teamMembers.value[index]
    unassignedTasks.value.push(...member.assignedTasks)
    teamMembers.value.splice(index, 1)
  }
}

const saveMember = () => {
  if (editingMember.value) {
    // Update existing member
    const index = teamMembers.value.findIndex(m => m.id === editingMember.value.id)
    if (index > -1) {
      teamMembers.value[index] = {
        ...teamMembers.value[index],
        ...memberForm.value
      }
    }
  } else {
    // Add new member
    const newMember = {
      ...memberForm.value,
      id: `member-${Date.now()}`,
      selected: false,
      assignedTasks: []
    }
    teamMembers.value.push(newMember)
  }
  
  closeMemberDialog()
  emit('update:team', teamMembers.value)
}

const closeMemberDialog = () => {
  addMemberDialog.value = false
  editingMember.value = null
  memberForm.value = {
    name: '',
    phone: '',
    email: '',
    skillLevel: 'Standard',
    experience: 1,
    specializations: [],
    availability: 'Full Day',
    maxHours: 8,
    notes: ''
  }
}

// Watch for task changes
watch(() => props.tasks, () => {
  // Update unassigned tasks when props change
  const assignedTaskIds = new Set()
  teamMembers.value.forEach(member => {
    member.assignedTasks.forEach(task => {
      assignedTaskIds.add(task.id)
    })
  })
  
  unassignedTasks.value = props.tasks.filter(task => 
    !assignedTaskIds.has(task.id)
  )
}, { deep: true })

// Initialize
initializeTeam()
</script>

<style scoped>
.task-drop-zone {
  min-height: 60px;
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 8px;
  transition: all 0.3s ease;
}

.task-drop-zone.drop-active {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.unassigned-tasks {
  min-height: 100px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.assignment-section {
  min-height: 120px;
}
</style>