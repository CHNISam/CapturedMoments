// ===========================
//  📂 src/router/index.js
// ===========================

import { createRouter, createWebHashHistory } from 'vue-router';

/* ===== 📦 视图组件 ===== */
import MainApp from '../views/MainApp.vue'; // 外壳（顶栏/侧栏/背景）
import MomentsPage from '../views/MomentsPage.vue'; // 主页：动态 + 相册
import SettingsAccount from '../views/settings/SettingsAccount.vue'; // 账户
import SettingsAI from '../views/settings/SettingsAI.vue'; // AI
import SettingsLayout from '../views/settings/SettingsLayout.vue'; // 设置总布局
import SettingsVisual from '../views/settings/SettingsVisual.vue'; // 视觉

const routes = [
  {
    path: '/',
    component: MainApp,
    children: [
      // ── 根路径渲染 主页 ──
      { path: '', component: MomentsPage },

      // ── 设置中心 ──
      {
        path: 'settings',
        component: SettingsLayout,
        children: [
          { path: '',        redirect: 'visual' },
          { path: 'visual',  component: SettingsVisual  },
          { path: 'account', component: SettingsAccount },
          { path: 'ai',      component: SettingsAI      }
        ]
      }

      // 以后可继续添加其他子路由……
      // { path: 'test', component: UploadTest }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),  // Hash 模式（兼容 GH Pages）
  routes
});

export default router;
