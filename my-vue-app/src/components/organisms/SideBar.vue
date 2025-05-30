<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <NavItem to="/"         icon="home"    label="首页"    />
    <NavItem to="/moments"  icon="moments" label="动态"    />
    <NavItem to="/albums"   icon="albums"  label="相册"    />
    <NavItem to="/editor"   icon="post"    label="投稿"    />
  </aside>
</template>

<script setup>
import NavItem from '@/components/molecules/NavItem.vue';

const props = defineProps({
  collapsed: { type: Boolean, default: false }
})
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  top: 56px;
  left: 0;
  bottom: 0;
  width: 72px;
  background: #202020;
  border-right: 1px solid #303030;
  display: flex;
  flex-direction: column;
  transition: transform .2s;
  z-index: 999;
}
.app-sidebar.collapsed {
  transform: translateX(-100%);
}
</style>
