# Known Bugs and Issues

## Critical: Blank Screen on App Initialization

### Description
The app shows a completely blank/dark screen when certain components and services are loaded together, particularly when using the full CreateChecklistPage with all step components.

### Root Causes Identified

#### 1. Error Handler and Performance Monitor Services
**Location**: `src/main.ts`, `src/services/errorHandler.ts`, `src/services/performanceMonitor.ts`

**Problem**: 
- The errorHandler service tries to initialize with router before it's ready
- performanceMonitor has circular dependencies or initialization issues
- These services fail silently, preventing the entire app from rendering

**Solution Applied**:
```typescript
// In src/main.ts - COMMENTED OUT:
// import { errorHandler } from './services/errorHandler'
// import { performanceMonitor } from './services/performanceMonitor'
// errorHandler.setRouter(router)
```

#### 2. Router Navigation Guards
**Location**: `src/router/index.ts`

**Problem**:
- Navigation guards using performanceMonitor cause initialization failures

**Solution Applied**:
```typescript
// COMMENTED OUT in router/index.ts:
// router.beforeEach((to, from, next) => {
//   if (from.name) {
//     performanceMonitor.trackRouteChange(from.path, to.path)
//   }
//   next()
// })
```

#### 3. Complex Step Components Loading Together
**Location**: `src/pages/CreateChecklistPage.vue` with components:
- PropertyDetailsStep
- RoomSelectionStep
- EnhancedTaskSelectionStep
- ClientInfoStep
- ReviewStep

**Problem**:
- When all 5 step components are imported and used in CreateChecklistPage, the app shows blank screen
- Components work individually but fail when loaded together
- Likely due to:
  - Heavy store initialization in each component
  - Circular dependencies between stores
  - Too many watchers/computed properties initializing at once

**Current Workaround**:
Using simplified pages without the complex step components:
- `CreateChecklistPage.simple.vue` instead of full version
- `HomePageSimple.vue` without store dependencies

### Symptoms
1. Completely blank/dark screen
2. No console errors (failures are silent)
3. Vue app doesn't mount to #app element
4. Browser shows blank page with no content

### Testing Results

#### Working Configuration ✅
```typescript
// Router configuration that WORKS:
{
  path: '/',
  component: () => import('@/pages/HomePageSimple.vue')  // No stores
},
{
  path: '/create',
  component: () => import('@/pages/CreateChecklistPage.simple.vue')  // Simple form
}
```

#### Failing Configuration ❌
```typescript
// Router configuration that causes BLANK SCREEN:
{
  path: '/',
  component: () => import('@/pages/HomePage.vue')  // With checklistStore
},
{
  path: '/create',
  component: () => import('@/pages/CreateChecklistPage.vue')  // With all 5 step components
}
```

### Debugging Steps Taken

1. **Isolated Testing**: Created test pages to load components individually
   - `CreateChecklistDebug.vue` - Toggle components one by one
   - `CreateChecklistDebug2.vue` - Dynamic component loading
   - `TestMinimal.vue` - Bare minimum Vue component

2. **Progressive Loading**: 
   - Started with minimal pages → worked ✅
   - Added MainLayout → worked ✅
   - Added stores → sometimes worked ⚠️
   - Added all step components → failed ❌

3. **Service Disabling**:
   - Disabled errorHandler → improved
   - Disabled performanceMonitor → improved
   - Disabled service worker → no change

### Files Modified to Fix

1. **src/main.ts**
   - Commented out errorHandler and performanceMonitor imports
   - Simplified error handling to console.log only

2. **src/router/index.ts**
   - Removed performanceMonitor import
   - Commented out navigation guards
   - Using simplified page components

3. **Page Components**
   - Created simplified versions without complex dependencies
   - Using `.simple.vue` versions for stability

### How to Prevent in Future

1. **Avoid Silent Failures**: Always add try-catch with console.error in initialization code
2. **Lazy Load Heavy Components**: Use dynamic imports for complex components
3. **Test Incrementally**: Add features one by one, test after each addition
4. **Monitor Bundle Size**: Large bundles with many dependencies increase failure risk
5. **Avoid Circular Dependencies**: Check store dependencies carefully
6. **Initialize Services After App Mount**: Don't initialize services in main.ts before app.mount()

### Current Status (Updated: 2025-08-19)
- App is RUNNING and STABLE with simplified pages ✅
- Server running on http://localhost:5173/ ✅
- Basic routing working (Home, Create, Templates, Checklists) ✅
- MainLayout is loaded and functional ✅
- Bottom navigation is visible and working ✅
- Full functionality with step components causes blank screen ❌
- Error handlers and performance monitoring are DISABLED ⚠️
- Using simple forms instead of multi-step wizard ⚠️

### What's Working
- Basic app initialization and mounting ✅
- Vue Router with simplified pages ✅
- Vuetify framework loaded ✅
- MainLayout with beautiful gradient UI ✅
  - App bar with title and icon ✅
  - Bottom navigation with proper styling ✅
  - Rounded corners and shadows ✅
  - Back button functionality ✅
- HomePageSimple.vue with professional UI ✅
  - Welcome card with gradient ✅
  - Action cards with hover effects ✅
  - Stats section ✅
  - Responsive grid layout ✅
- CreateChecklistPage.simple.vue with form UI ✅
  - Progress indicator ✅
  - Professional form fields ✅
  - Quick templates section ✅
  - Date/time pickers ✅
  - Form validation ready ✅
- Icon integration (mdi icons) ✅
- Navigation between all pages ✅
- Smooth transitions and animations ✅

### What Needs Restoration
- Proper UI styling and theming ❌
- Step components for checklist creation ❌
- Store integration (checklistStore) ❌
- Error handling services ❌
- Performance monitoring ❌
- ThemeToggle component ❌
- Full feature pages (HomePage.vue, CreateChecklistPage.vue) ❌

### If System is Reset
1. DO NOT enable errorHandler or performanceMonitor in main.ts
2. DO NOT use the full CreateChecklistPage with all step components
3. USE the simplified page versions (.simple.vue files)
4. TEST each component individually before combining
5. CHECK browser console for any errors during initialization

### Commands to Restore Working State
```bash
# If blank screen occurs after reset:
git checkout 2e48550  # Last known working commit with simplified pages

# Or manually fix:
1. Comment out errorHandler and performanceMonitor in src/main.ts
2. Use HomePageSimple.vue for home route
3. Use CreateChecklistPage.simple.vue for create route
4. Comment out router navigation guards in src/router/index.ts
```

### Related Commits
- `2e48550` - Working configuration with simplified pages
- `daf0b3b` - Disabled error handlers and performance monitoring
- `10403d4` - Original fix where pages were simplified

---

## Cleanup Log (2025-08-19)

### Files Removed
- 7 debug/test files (CreateChecklistDebug.vue, TestMinimal.vue, etc.)
- 3 duplicate files (HomePage.simple.vue, MainLayout backups)
- 2 unused store files (checklistsOptimistic.ts, checklistsNormalized.ts)
- HelloWorld.vue (unused component)

### Code Cleaned
- Removed all console.log statements
- Cleaned up commented code in main.ts and router
- Added proper TypeScript types
- Improved error handling

---

Last Updated: 2025-08-19
Status: STABLE - App working with simplified architecture