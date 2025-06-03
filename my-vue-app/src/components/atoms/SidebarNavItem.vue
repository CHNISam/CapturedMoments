<template>
  <button class="sidebar-nav-item" :class="{ active }" @click="go">
    <Icon :name="icon" />
    <span class="label">{{ label }}</span>
  </button>
</template>

<script setup>
import Icon from '@/components/icons/Icon.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  to:    { type: String, required: true },
  icon:  { type: String, required: true },
  label: { type: String, required: true }
})

const router = useRouter()
const route  = useRoute()

const active = computed(() => route.path === props.to)

function go() {
  if (route.path !== props.to) {
    router.push(props.to)
  }
}
</script>

<style scoped>
.sidebar-nav-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  width: 100%;
}
.sidebar-nav-item:hover,
.sidebar-nav-item.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.sidebar-nav-item .label {
  margin-left: 16px;
  font-size: 14px;
  flex: 1;
  text-align: left;
}
</style>
