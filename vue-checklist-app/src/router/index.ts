import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// Temporarily disabled for debugging
// import { performanceMonitor } from '@/services/performanceMonitor'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePageSimple.vue')
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import('@/pages/TestMinimal.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/pages/CreateChecklistPage.simple.vue')
  },
  {
    path: '/checklists',
    name: 'checklists',
    component: () => import('@/pages/TestMinimal.vue')
  },
  {
    path: '/checklist/:id',
    name: 'checklist-detail',
    component: () => import('@/pages/ChecklistDetailPageEnhanced.vue')
  },
  {
    path: '/checklist/:id/edit',
    name: 'checklist-edit',
    component: () => import('@/pages/EditChecklistPage.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/SettingsPage.vue')
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('@/pages/InventoryPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Temporarily disabled route tracking
// router.beforeEach((to, from, next) => {
//   if (from.name) {
//     performanceMonitor.trackRouteChange(from.path, to.path)
//   }
//   next()
// })

export default router