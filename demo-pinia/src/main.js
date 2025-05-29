// src/main.js
import { createPinia } from 'pinia'; // ✅ 加上
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()           // ✅ 创建实例
app.use(pinia)                        // ✅ 挂载 pinia 到 Vue app

app.mount('#app')                     // ✅ 最后挂载应用
