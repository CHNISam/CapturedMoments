<template>
  <div class="app-shell">
    <!-- ★ 顶栏 -->
    <HeaderBar
      :title="title"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @refresh="refreshPage"
      @search="handleSearch"
    >
      <!-- 右侧插槽里还是你的头像 / AI / 通知那坨 -->
      <template #right-extra>
        <HeaderRightStuff
          @open-settings="openSettings"
          @open-ai="openAI"
        />
      </template>
    </HeaderBar>

    <!-- ★ 主体：左侧栏 + 右主区 -->
    <div class="shell-body">
      <SidebarNav
        :collapsed="!sidebarOpen"
        :active="activeTab"
        @navigate="goRoute"
      />

      <main :class="['app-main', { 'sidebar-collapsed': !sidebarOpen }]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/HeaderBar.vue'
import HeaderRightStuff from '@/components/HeaderRightStuff.vue'
import SidebarNav from '@/components/SidebarNav.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const title = 'Captured Moments'
const sidebarOpen = ref(true)
const activeTab   = ref('home')
const router      = useRouter()

function refreshPage () {
  location.reload()
}
function handleSearch (q) {
  console.log('🔍 搜索：', q)
  // 这里写真正的搜索逻辑 / 跳转
}
function goRoute (name) {
  activeTab.value = name
  router.push(name === 'home' ? '/' : `/${name}`)
}
function openSettings () {/* … */}
function openAI ()        {/* … */}
</script>

<style scoped>
.app-shell { height: 100vh; display: flex; flex-direction: column; }
.shell-body { flex: 1; display: flex; }
.app-main   { flex: 1; padding: 16px; background:#121212; color:#e0e0e0; }
.app-main.sidebar-collapsed{ margin-left: 0; }
</style>
