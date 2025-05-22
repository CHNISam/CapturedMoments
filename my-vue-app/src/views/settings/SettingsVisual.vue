<template>
  <div class="settings-section">
    <h1>🎨 视觉 / 界面</h1>

    <!-- 暗黑模式开关 -->
    <div class="setting-item">
      <div class="setting-header">
        <label for="dark-mode">启用暗黑模式</label>
        <input id="dark-mode" type="checkbox" v-model="settings.darkMode" />
      </div>
      <p class="description">根据系统或手动切换主题。</p>
    </div>

    <!-- 星空背景开关 -->
    <div class="setting-item">
      <div class="setting-header">
        <label for="show-stars">显示星空背景</label>
        <input id="show-stars" type="checkbox" v-model="settings.showStars" />
      </div>
      <p class="description">开启后在夜间会渲染动态星空。</p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
const settings = inject('settings')
</script>

<style scoped>
.settings-section { max-width: 600px; margin: 0 auto; }
.setting-item { margin-bottom: 1.5rem; }
.setting-header { display: flex; justify-content: space-between; align-items: center; }
.description { margin-top: .5rem; color: #666; font-size: .9rem; }
</style>
