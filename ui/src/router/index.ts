import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: () => import('@/pages/AccountsPage.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/pages/CategoriesPage.vue'),
        },
        {
          path: 'add',
          name: 'add',
          component: () => import('@/pages/AddPage.vue'),
        },
        {
          path: 'edit/:id',
          name: 'edit-transaction',
          component: () => import('@/pages/AddPage.vue'),
          props: true,
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/SettingsPage.vue'),
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/pages/AuthPage.vue'),
      meta: { guest: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/auth'
  if (to.meta.guest && auth.isAuthenticated) return '/'
})

export default router
