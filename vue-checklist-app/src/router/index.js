import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import('@/pages/TemplatesPage.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/pages/CreateChecklistPage.vue')
  },
  {
    path: '/checklists',
    name: 'checklists',
    component: () => import('@/pages/ChecklistsPage.vue')
  },
  {
    path: '/checklist/:id',
    name: 'checklist-detail',
    component: () => import('@/pages/ChecklistDetailPage.vue')
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