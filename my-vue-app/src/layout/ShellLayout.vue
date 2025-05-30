<template>
  <div class="shell">
    <HeaderNav
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @refresh="refreshPage"
      @search="onSearch"
    >
      <template #right-extra>
        <HeaderRightStuff />
      </template>
    </HeaderNav>

    <div class="body">
      <SideBar :collapsed="!sidebarOpen" />

      <main :class="['app-main', { 'sidebar-collapsed': !sidebarOpen }]">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script setup>
import HeaderNav from '@/components/organisms/HeaderNav.vue'
import SideBar from '@/components/organisms/SideBar.vue'
import { ref } from 'vue'

const sidebarOpen = ref(true)
function refreshPage() { window.location.reload() }
function onSearch(q) { console.log('搜索', q) }
</script>

<style scoped>
.shell { display:flex; flex-direction:column; height:100vh }
.body  { display:flex; flex:1; overflow:hidden }
.app-main {
  flex:1; margin-left:72px; padding:16px;
  background:#121212; color:#e0e0e0;
  transition: margin-left .2s;
  overflow-y:auto;
}
.app-main.sidebar-collapsed { margin-left:0 }
</style>
