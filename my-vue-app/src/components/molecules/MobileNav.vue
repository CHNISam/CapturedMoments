<template>
  <div class="mobile-nav">
    <ul class="nav-list mobile">
      <MobileNavItem
        v-for="item in navItems"
        :key="item.name"
        :name="item.name"
        :icon="item.icon"
        :label="item.label"
        :activeSection="activeSection"
        @select="onSelect"
      />
    </ul>
  </div>
</template>

<script setup>
import MobileNavItem from '@/components/atoms/MobileNavItem.vue'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  activeSection: { type: String, default: null }
})
const emit = defineEmits(['update:activeSection'])

const navItems = [
  { name: 'visual',   icon: 'palette', label: '视觉／界面' },
  { name: 'profile',  icon: 'user',    label: '个人资料' },
  { name: 'assistant',icon: 'robot',   label: '交互助手' },
  { name: 'publish',  icon: 'upload',  label: '发布与上传' },
  { name: 'admin',    icon: 'shield',  label: '管理员' }
]

function onSelect(name) {
  emit('update:activeSection', name)
}
</script>

<style scoped>
.mobile-nav {
  padding: 24px 16px;
  max-height: calc(100vh - 56px);
  overflow-y: auto;
}
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-list li {
  margin-bottom: 8px;
}
</style>
