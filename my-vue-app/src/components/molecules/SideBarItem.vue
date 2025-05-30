<template>
  <router-link
    :to="to"
    class="sidebar-item"
    :class="{ active: isActive }"
    @click.native="handleClick"
  >
    <component :is="icon" />
    <span class="label">{{ label }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to:      { type: String, required: true },
  icon:    { type: [Object, Function], required: true },
  label:   { type: String, required: true },
  onClick: { type: Function, default: null }
})

const route = useRoute()

// 当前路由是否激活 this.to
const isActive = computed(() => route.path === props.to)

function handleClick(e) {
  if (props.onClick) props.onClick(e)
}
</script>

<style scoped>
.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  text-decoration: none;
  color: #e0e0e0;
  transition: background .2s, color .2s;
}
.sidebar-item:hover {
  background: #383838;
}
.sidebar-item.active {
  background: #383838;
  color: #4a90e2;
}
.label {
  margin-top: 4px;
  font-size: 12px;
}
</style>
