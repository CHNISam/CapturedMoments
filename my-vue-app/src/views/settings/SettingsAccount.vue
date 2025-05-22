<template>
  <div class="settings-section">
    <h1>👤 账户与身份</h1>

    <!-- 用户名修改 -->
    <div class="setting-item">
      <div class="setting-header">
        <label for="username">用户名</label>
        <input
          id="username"
          type="text"
          v-model="settings.username"
          placeholder="请输入用户名"
        />
        <button class="btn-save" @click="saveUsername">保存</button>
      </div>
      <p class="description">修改后会实时更新到您的资料。</p>
    </div>

    <!-- 头像上传 -->
    <div class="setting-item">
      <label>头像</label>
      <div class="avatar-uploader">
        <img
          :src="settings.avatar || defaultAvatar"
          alt="当前头像"
          class="avatar-preview"
        />
        <input type="file" accept="image/*" @change="uploadAvatar" />
      </div>
      <p class="description">支持 JPG/PNG，建议 200×200px。</p>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
const settings = inject('settings')
const defaultAvatar = ref('/default-avatar.png')

function saveUsername() {
  console.log('保存用户名:', settings.username)
  // TODO: 同步到后端或本地存储
}

function uploadAvatar(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    settings.avatar = reader.result
    console.log('新头像 Base64:', settings.avatar)
    // TODO: 同步到后端或本地存储
  }
  reader.readAsDataURL(file)
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
.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.avatar-preview {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}
.description {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
