# ChangeAToDo.md - Comprehensive Task Breakdown

## Overview
This document provides a detailed task breakdown for implementing the fixes and improvements identified in ChangeA.md. Tasks are organized by priority and include specific implementation details, dependencies, and success criteria.

---

## 🚨 Phase 1: Critical Database Fix (URGENT)
**Goal**: Fix saved checklists not appearing in the list
**Status**: 🔴 NOT STARTED
**Estimated Time**: 30 minutes

### Task 1.1: Fix ChecklistsPage Database Loading
**Priority**: CRITICAL
**File**: `/vue-checklist-app/src/pages/ChecklistsPage.vue`
**Line**: 208-214

#### Subtasks:
- [ ] 1.1.1 Remove sample data usage (line 150-176)
- [ ] 1.1.2 Fix loadChecklists method to use checklistStore properly
- [ ] 1.1.3 Ensure store is imported correctly
- [ ] 1.1.4 Test that saved checklists appear

**Implementation**:
```javascript
// Replace lines 208-214 with:
const loadChecklists = async () => {
  isLoading.value = true
  try {
    await checklistStore.loadChecklists()
    checklists.value = checklistStore.checklists || []
  } catch (error) {
    console.error('Error loading checklists:', error)
    checklists.value = []
  } finally {
    isLoading.value = false
  }
}
```

**Success Criteria**:
- ✅ Creating a new checklist appears in the list immediately
- ✅ Page refresh maintains all saved checklists
- ✅ No console errors related to database loading

### Task 1.2: Implement Delete Functionality with Database
**Priority**: HIGH
**File**: `/vue-checklist-app/src/pages/ChecklistsPage.vue`
**Line**: 232-236

#### Subtasks:
- [ ] 1.2.1 Connect delete button to checklistStore.deleteChecklist
- [ ] 1.2.2 Add proper confirmation dialog
- [ ] 1.2.3 Show loading state during deletion
- [ ] 1.2.4 Handle errors gracefully

**Implementation**:
```javascript
const deleteChecklist = async (id) => {
  if (confirm('Are you sure you want to delete this checklist?')) {
    try {
      await checklistStore.deleteChecklist(id)
      await loadChecklists() // Refresh the list
    } catch (error) {
      console.error('Error deleting checklist:', error)
      // Show error notification
    }
  }
}
```

---

## 🔧 Phase 2: Task Editing Capability (HIGH)
**Goal**: Enable users to edit tasks in rooms
**Status**: 🔴 NOT STARTED
**Estimated Time**: 2-3 hours

### Task 2.1: Integrate CustomTaskModal into Task Selection
**Priority**: HIGH
**File**: `/vue-checklist-app/src/components/checklist/EnhancedTaskSelectionStep.vue`

#### Subtasks:
- [ ] 2.1.1 Import CustomTaskModal component
- [ ] 2.1.2 Add edit button to each task card
- [ ] 2.1.3 Create state variables for modal control
- [ ] 2.1.4 Implement openTaskEditor method
- [ ] 2.1.5 Implement updateTask method

**Implementation Details**:
```vue
<!-- Add to template -->
<v-list-item-action>
  <v-btn
    icon="mdi-pencil"
    size="small"
    variant="text"
    @click.stop="openTaskEditor(task, roomIndex)"
  />
</v-list-item-action>

<CustomTaskModal
  v-model="taskEditDialog"
  :task="editingTask"
  :room="editingRoom"
  @save="updateTask"
/>
```

### Task 2.2: Add Custom Task Creation
**Priority**: HIGH
**File**: `/vue-checklist-app/src/components/checklist/EnhancedTaskSelectionStep.vue`

#### Subtasks:
- [ ] 2.2.1 Add "Add Custom Task" button to each room section
- [ ] 2.2.2 Implement openCustomTaskCreator method
- [ ] 2.2.3 Implement addCustomTask method
- [ ] 2.2.4 Ensure custom tasks persist with checklist

**Implementation Details**:
```vue
<v-btn
  prepend-icon="mdi-plus"
  variant="outlined"
  size="small"
  @click="openCustomTaskCreator(roomIndex)"
>
  Add Custom Task
</v-btn>
```

### Task 2.3: Display Task Details
**Priority**: MEDIUM
**File**: `/vue-checklist-app/src/components/checklist/EnhancedTaskSelectionStep.vue`

#### Subtasks:
- [ ] 2.3.1 Show estimated time for each task
- [ ] 2.3.2 Display chemicals/supplies needed
- [ ] 2.3.3 Show tools required
- [ ] 2.3.4 Add expandable details section

---

## 📋 Phase 3: Template Visibility & Options (MEDIUM)
**Goal**: Ensure all templates are accessible
**Status**: ⚠️ PARTIALLY WORKING
**Estimated Time**: 1-2 hours

### Task 3.1: Verify All Templates Display
**Priority**: MEDIUM
**File**: `/vue-checklist-app/src/components/checklist/PropertyDetailsStep.vue`

#### Subtasks:
- [ ] 3.1.1 Verify getIndustries() returns all 16 templates
- [ ] 3.1.2 Check if UI layout limits display
- [ ] 3.1.3 Add scrollable container if needed
- [ ] 3.1.4 Implement grid layout for better visibility

### Task 3.2: Add Deep Clean as Main Template
**Priority**: MEDIUM
**File**: `/vue-checklist-app/src/data/templates.ts`

#### Subtasks:
- [ ] 3.2.1 Create deepClean template object
- [ ] 3.2.2 Combine deep clean tasks from other templates
- [ ] 3.2.3 Add to cleaningTemplates export
- [ ] 3.2.4 Test template selection

**Implementation**:
```typescript
deepClean: {
  name: 'Deep Cleaning',
  icon: 'mdi-spray-bottle',
  color: '#00BCD4',
  rooms: [
    // Combine deep clean rooms
  ]
}
```

---

## 👥 Phase 4: Client-Specific Customization (MEDIUM)
**Goal**: Save and load client preferences
**Status**: 🔴 NOT STARTED
**Estimated Time**: 3-4 hours

### Task 4.1: Extend Database Schema
**Priority**: MEDIUM
**File**: `/vue-checklist-app/src/services/database.ts`

#### Subtasks:
- [ ] 4.1.1 Add customizations field to checklist schema
- [ ] 4.1.2 Create getClientChecklists method
- [ ] 4.1.3 Create getClientPreferences method
- [ ] 4.1.4 Add indexes for client queries

### Task 4.2: Save Custom Modifications
**Priority**: MEDIUM
**File**: `/vue-checklist-app/src/stores/checklistStore.ts`

#### Subtasks:
- [ ] 4.2.1 Track modified tasks
- [ ] 4.2.2 Track added custom tasks
- [ ] 4.2.3 Track removed tasks
- [ ] 4.2.4 Include customizations in saveChecklist

**Implementation**:
```javascript
const saveChecklist = async () => {
  const checklistData = {
    ...currentChecklist.value,
    customizations: {
      modifiedTasks: getModifiedTasks(),
      addedTasks: getCustomTasks(),
      removedTasks: getRemovedTasks()
    },
    clientId: selectedClient.value?.id,
    templateUsed: selectedIndustry.value
  }
  // ...
}
```

### Task 4.3: Load Client Preferences
**Priority**: MEDIUM
**File**: `/vue-checklist-app/src/components/checklist/ClientInfoStep.vue`

#### Subtasks:
- [ ] 4.3.1 Detect when existing client is selected
- [ ] 4.3.2 Load previous checklists for client
- [ ] 4.3.3 Apply previous customizations as defaults
- [ ] 4.3.4 Show indicator when preferences are loaded

---

## 🏠 Phase 5: Room Selection Improvements (LOW)
**Goal**: Allow flexible room selection
**Status**: 🔴 NOT STARTED
**Estimated Time**: 1-2 hours

### Task 5.1: Add Room Toggle Functionality
**Priority**: LOW
**File**: `/vue-checklist-app/src/components/checklist/RoomSelectionStep.vue`

#### Subtasks:
- [ ] 5.1.1 Add checkbox for each room
- [ ] 5.1.2 Implement room.selected state
- [ ] 5.1.3 Update room selection logic
- [ ] 5.1.4 Show selected room count

### Task 5.2: Custom Room Addition
**Priority**: LOW
**File**: `/vue-checklist-app/src/components/checklist/RoomSelectionStep.vue`

#### Subtasks:
- [ ] 5.2.1 Add "Add Custom Room" button
- [ ] 5.2.2 Create input dialog for room name
- [ ] 5.2.3 Implement addCustomRoom method
- [ ] 5.2.4 Persist custom rooms with checklist

---

## 🧪 Phase 6: Testing & Validation
**Goal**: Ensure all features work correctly
**Status**: 🔴 NOT STARTED
**Estimated Time**: 2-3 hours

### Task 6.1: Database Integration Tests
#### Subtasks:
- [ ] 6.1.1 Test checklist creation and retrieval
- [ ] 6.1.2 Test checklist deletion
- [ ] 6.1.3 Test client preference loading
- [ ] 6.1.4 Test custom task persistence

### Task 6.2: UI Flow Tests
#### Subtasks:
- [ ] 6.2.1 Test complete 5-step creation flow
- [ ] 6.2.2 Test task editing functionality
- [ ] 6.2.3 Test custom task addition
- [ ] 6.2.4 Test room selection/deselection

### Task 6.3: Edge Case Tests
#### Subtasks:
- [ ] 6.3.1 Test with no internet connection
- [ ] 6.3.2 Test with large number of tasks
- [ ] 6.3.3 Test with special characters in names
- [ ] 6.3.4 Test browser refresh at each step

---

## 📊 Task Summary

### By Priority:
- **CRITICAL** (1 task): Database loading fix
- **HIGH** (3 tasks): Delete functionality, task editing, custom tasks
- **MEDIUM** (5 tasks): Template visibility, client customization
- **LOW** (2 tasks): Room selection improvements

### By Complexity:
- **Simple** (< 30 min): 3 tasks
- **Moderate** (1-2 hours): 5 tasks
- **Complex** (2-4 hours): 3 tasks

### Dependencies:
1. Phase 1 (Database Fix) - No dependencies, start immediately
2. Phase 2 (Task Editing) - Depends on Phase 1
3. Phase 3 (Templates) - Independent, can run parallel
4. Phase 4 (Client Customization) - Depends on Phase 1 & 2
5. Phase 5 (Room Selection) - Independent
6. Phase 6 (Testing) - Depends on all phases

---

## 🚀 Implementation Order

### Day 1 (Immediate - 2-3 hours)
1. ✅ Task 1.1: Fix database loading (30 min)
2. ✅ Task 1.2: Fix delete functionality (30 min)
3. ✅ Task 3.1: Verify template display (1 hour)
4. ✅ Test basic functionality

### Day 2 (Task Editing - 3-4 hours)
1. ✅ Task 2.1: Integrate CustomTaskModal (2 hours)
2. ✅ Task 2.2: Add custom task creation (1 hour)
3. ✅ Task 2.3: Display task details (1 hour)

### Day 3 (Customization - 4-5 hours)
1. ✅ Task 4.1: Extend database schema (1 hour)
2. ✅ Task 4.2: Save customizations (2 hours)
3. ✅ Task 4.3: Load client preferences (1-2 hours)

### Day 4 (Polish & Testing - 3-4 hours)
1. ✅ Task 5.1: Room selection toggle (1 hour)
2. ✅ Task 5.2: Custom room addition (1 hour)
3. ✅ Task 6.1-6.3: Complete testing (2 hours)

---

## ✅ Success Metrics

### Must Have (MVP):
- [ ] Saved checklists appear in list
- [ ] Users can edit task details
- [ ] All 16 templates are accessible
- [ ] Changes persist after refresh

### Should Have:
- [ ] Custom tasks can be added
- [ ] Client preferences are remembered
- [ ] Rooms can be selected/deselected

### Nice to Have:
- [ ] Custom rooms can be added
- [ ] Bulk task operations
- [ ] Template preview before selection

---

## 📝 Notes

### Known Issues:
1. ChecklistsPage hardcodes sample data (line 208)
2. CustomTaskModal exists but not integrated
3. All templates exist but may have UI display issues
4. No client preference system implemented

### Technical Debt:
1. Need proper error handling throughout
2. Loading states missing in several components
3. No unit tests for critical functions
4. TypeScript types could be stricter

### Future Enhancements:
1. Template builder for custom templates
2. Task library for reusable tasks
3. Bulk operations for efficiency
4. Import/export functionality
5. Version history tracking
6. Client approval workflow

---

*Last Updated: [Current Date]*
*Total Tasks: 11 main tasks, 44 subtasks*
*Estimated Total Time: 12-16 hours*
*Recommended Team Size: 1-2 developers*