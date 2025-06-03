<template>
  <button class="mobile-nav-item" :class="{ active }" @click="onClick">
    <Icon :name="icon" />
    <span class="label">{{ label }}</span>
    <svg class="chevron-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  </button>
</template>

<script setup>
import Icon from '@/components/icons/Icon.vue'
import { computed } from 'vue'

const props = defineProps({
  name:          { type: String, required: true },
  icon:          { type: String, required: true },
  label:         { type: String, required: true },
  activeSection: { type: String, default: null }
})
const emit = defineEmits(['select'])

const active = computed(() => props.activeSection === props.name)

function onClick() {
  emit('select', props.name)
}
</script>

<style scoped>
.mobile-nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.mobile-nav-item .label {
  margin-left: 12px;
  font-size: 16px;
  flex: 1;
  text-align: left;
}
.mobile-nav-item .chevron-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}
.mobile-nav-item:hover,
.mobile-nav-item.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
</style>
