import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles.css';

const app = createApp(App);

// 判断是否是移动设备（简单基于宽度）
app.config.globalProperties.$isMobile = window.innerWidth <= 768;

// 监听窗口大小变化，动态更新
window.addEventListener('resize', () => {
  app.config.globalProperties.$isMobile = window.innerWidth <= 768;
});

app.mount('#app');
