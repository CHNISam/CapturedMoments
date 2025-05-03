// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router';
import MainApp from '../views/MainApp.vue'; // ✅ 加这一行
import UploadTest from '../views/UploadTest.vue';

const routes = [
  {
    path: '/',
    name: 'MainApp',
    component: MainApp
  },
  {
    path: '/test',
    name: 'UploadTest',
    component: UploadTest
  }
];

const router = createRouter({
  history: createWebHashHistory(), // ✅ 使用 Hash 模式兼容 GitHub Pages
  routes
});
export default router;