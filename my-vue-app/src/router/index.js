// src/router/index.js
import ShellLayout from '@/layout/ShellLayout.vue';
import { useUserStore } from '@/stores/user';
import AlbumPage from '@/views/AlbumPage.vue';
import EditorPage from '@/views/EditorPage.vue';
import LoginPage from '@/views/LoginPage.vue'; // 登录页（仅渲染 Modal）
import MomentsPage from '@/views/MomentsPage.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    component: ShellLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '',        redirect: '/moments' },
      { path: 'moments', name: 'Moments', component: MomentsPage },
      { path: 'albums',  name: 'Albums',  component: AlbumPage   },
      { path: 'editor',  name: 'Editor',  component: EditorPage  }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()                  // ← 现在能正确拿到 store
  if (to.meta.requiresAuth && !userStore.currentUser) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  next()
})

export default router
