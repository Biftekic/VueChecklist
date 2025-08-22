import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/pages/HomePageSimple.vue')
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import(/* webpackChunkName: "templates" */ '@/pages/TemplatesPage.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "create" */ '@/pages/CreateChecklistPage.vue')
  },
  {
    path: '/checklists',
    name: 'checklists',
    component: () => import(/* webpackChunkName: "checklists" */ '@/pages/ChecklistsPage.vue')
  },
  {
    path: '/checklist/:id',
    name: 'checklist-detail',
    component: () => import(/* webpackChunkName: "checklist-detail" */ '@/pages/ChecklistDetailPageEnhanced.vue')
  },
  {
    path: '/checklist/:id/edit',
    name: 'checklist-edit',
    component: () => import(/* webpackChunkName: "checklist-edit" */ '@/pages/EditChecklistPage.vue')
  },
  {
    path: '/template/:id/edit',
    name: 'template-edit',
    component: () => import(/* webpackChunkName: "template-edit" */ '@/pages/EditTemplatePage.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/pages/SettingsPage.vue')
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import(/* webpackChunkName: "inventory" */ '@/pages/InventoryPage.vue')
  },
  {
    path: '/test-icons',
    name: 'test-icons',
    component: () => import(/* webpackChunkName: "test-icons" */ '@/components/TestIcons.vue')
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