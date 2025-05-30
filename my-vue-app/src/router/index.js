// src/router/index.js
import ShellLayout from '@/layout/ShellLayout.vue'
import AlbumPage from '@/views/AlbumPage.vue'
import EditorPage from '@/views/EditorPage.vue'
import MomentsPage from '@/views/MomentsPage.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: ShellLayout,
      children: [
        { path: '',        redirect: '/moments' },
        { path: 'moments', name: 'Moments', component: MomentsPage },
        { path: 'albums',  name: 'Albums',  component: AlbumPage  },
        { path: 'editor',  name: 'Editor',  component: EditorPage  }
      ]
    }
  ]
})

export default router
