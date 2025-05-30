<template>
  <button
    class="nav-item"
    :class="{ active }"
    @click="go"
  >
    <Icon :name="icon" />
    <span>{{ label }}</span>
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

const active = computed(() => {
  // 以路由 path 或 name 判断
  return route.path === props.to
})

function go() {
  if (route.path !== props.to) {
    router.push(props.to)
  }
}
</script>

<style scoped>
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  border: none;
  background: none;
  cursor: pointer;
  color: #e0e0e0;
  transition: background .2s;
}
.nav-item:hover,
.nav-item.active {
  background: #383838;
}
.nav-item span {
  margin-top: 4px;
  font-size: 12px;
}
</style>
