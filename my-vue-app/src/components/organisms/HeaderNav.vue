<template>
  <header class="app-header">
    <!-- 左区：汉堡 + Logo + 主页 -->
    <div class="header-left">
      <button class="icon-btn hamburger" @click="$emit('toggle-sidebar')" aria-label="切换侧栏">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span class="logo" @click="$emit('refresh')">{{ title }}</span>
      <button class="icon-btn home-btn" @click="$emit('refresh')" aria-label="主页">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
          <path d="M3 12l9-9 9 9M4 10v10h6v-6h4v6h6V10" />
        </svg>
      </button>
    </div>

    <!-- 中区：搜索 -->
    <form class="header-center search-form" @submit.prevent="emitSearch">
      <input v-model="searchQuery" class="search-input" placeholder="Search…" aria-label="搜索" />
      <button type="submit" class="icon-btn" aria-label="搜索">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>

    <!-- 右区：投稿 / 通知 / AI / 头像下拉 -->
    <div class="header-right">
      <button class="icon-btn" @click="$emit('post')" aria-label="投稿">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
          <path d="M12 4v16M20 12H4" />
        </svg>
      </button>
      <button class="icon-btn" @click="$emit('notify')" aria-label="通知">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11
                   a6 6 0 0 0-5-5.917V5
                   a2 2 0 1 0-4 0v.083
                   A6 6 0 0 0 4 11v3.159
                   c0 .538-.214 1.055-.595 1.436L2 17h5" />
          <path d="M12 21a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
        </svg>
      </button>
      <button class="icon-btn" @click="$emit('ai')" aria-label="AI 助手">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5">
          <path d="M8 16l4-8 4 8" />
          <path d="M9 16.5l4-8 4 8" stroke-opacity=".2" />
          <line x1="10" y1="12" x2="14" y2="12" />
          <line x1="17" y1="8" x2="17" y2="16" />
          <line x1="17.6" y1="8.6" x2="17.6" y2="16.6" stroke-opacity=".2" />
        </svg>
      </button>

      <!-- 头像 & 下拉 -->
      <div class="nav-avatar" @mouseenter="dropdown = true" @mouseleave="dropdown = false">
        <img :src="avatar" class="avatar-img" alt="avatar" />
        <transition name="dropdown-fade">
          <div v-show="dropdown" class="nav-dropdown">
            <button class="dropdown-item" @click="goSettings">设置</button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" @click="handleLogout">
              退出
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, required: true },
  avatar: { type: String, required: true }
})
const emit = defineEmits([
  'toggle-sidebar',
  'refresh',
  'search',
  'post',
  'notify',
  'ai',
  'settings'
])

const searchQuery = ref('')
const dropdown = ref(false)

function emitSearch() {
  emit('search', searchQuery.value)
}

// 注入 Pinia Store 和 Vue Router
const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.logout()
  router.push({ name: 'Login' })
}
function goSettings () {
  dropdown.value = false
  router.push('/settings')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  background: #181818;
  border-bottom: 1px solid #303030;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  color: #e0e0e0;
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.icon-btn:hover {
  background: #383838;
}

.icon-btn svg {
  width: 24px;
  height: 24px;
  stroke: #e0e0e0;
}

.header-center {
  flex: 1;
  max-width: 400px;
  display: flex;
}

.search-input {
  flex: 1;
  padding: 6px 10px;
  background: #282828;
  color: #e0e0e0;
  border: 1px solid #303030;
  border-right: none;
  border-radius: 2px 0 0 2px;
}

.search-input::placeholder {
  color: #aaa;
}

.search-form .icon-btn {
  border: 1px solid #303030;
  border-left: none;
  border-radius: 0 2px 2px 0;
}

.nav-avatar {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: #2a2a2a;
  border: 1px solid #303030;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 8px 0;
  z-index: 200;
}

.dropdown-item {
  width: 100%;
  background: none;
  border: none;
  padding: 8px 16px;
  text-align: left;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #383838;
}

.dropdown-divider {
  height: 1px;
  margin: 4px 0;
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity .25s, transform .25s;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
