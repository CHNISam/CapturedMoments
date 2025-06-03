<template>
  <aside class="sidebar-nav">
    <ul>
      <SidebarNavItem
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
      />
    </ul>
  </aside>
</template>

<script setup>
import SidebarNavItem from '@/components/atoms/SidebarNavItem.vue';

// 把面板各个 section 路由映射到一个数组
const navItems = [
  { name: 'visual',   icon: 'palette', label: '视觉／界面', to: '/settings/visual' },
  { name: 'profile',  icon: 'user',    label: '个人资料',   to: '/settings/profile' },
  { name: 'assistant',icon: 'robot',   label: '交互助手',   to: '/settings/assistant' },
  { name: 'publish',  icon: 'upload',  label: '发布与上传', to: '/settings/publish' },
  { name: 'admin',    icon: 'shield',  label: '管理员',     to: '/settings/admin' }
]
</script>

<style scoped>
.sidebar-nav {
  width: 240px;
  background: #1e1e1e;
  border-right: 1px solid #303030;
  border-radius: 8px 0 0 8px;
  position: sticky;
  top: 40px;
  bottom: 40px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}
.sidebar-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
