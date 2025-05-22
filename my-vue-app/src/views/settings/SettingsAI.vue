<template>
  <div class="settings-section">
    <h1>🤖 交互助手</h1>

    <!-- 启用 AI 助手 -->
    <div class="setting-item">
      <div class="setting-header">
        <label for="enable-ai">启用 AI 助手</label>
        <input
          id="enable-ai"
          type="checkbox"
          v-model="settings.enableAI"
        />
      </div>
      <p class="description">开启后 AI 助手将出现在页面右下角。</p>
    </div>

    <!-- AI 名称自定义 -->
    <div class="setting-item" v-if="settings.enableAI">
      <div class="setting-header">
        <label for="ai-name">AI 名称</label>
        <input
          id="ai-name"
          type="text"
          v-model="settings.aiName"
          placeholder="给 AI 助手起个名字"
        />
        <button class="btn-save" @click="saveAIName">保存</button>
      </div>
      <p class="description">自定义助手的称呼，增加互动趣味。</p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
const settings = inject('settings')

function saveAIName() {
  console.log('保存 AI 名称:', settings.aiName)
  // TODO: 同步到后端或本地存储
}
</script>

<style scoped>
.settings-section {
  max-width: 600px;
  margin: 0 auto;
}
.setting-item {
  margin-bottom: 1.5rem;
}
.setting-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.setting-header label {
  width: 80px;
}
.setting-header input[type="text"] {
  flex: 1;
  padding: 0.5rem;
}
.btn-save {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.description {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
