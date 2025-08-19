import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePageSimple.vue')
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import('@/pages/TemplatesPage.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/pages/CreateChecklistPage.simple.vue')
  },
  {
    path: '/checklists',
    name: 'checklists',
    component: () => import('@/pages/ChecklistsPage.vue')
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


export default router