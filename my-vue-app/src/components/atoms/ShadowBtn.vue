<template>
  <button class="shadow-btn" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['click'])

function onClick(e) {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<style scoped>
.shadow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  background: #444;
  color: #fff;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s, transform 0.1s;
  min-width: 80px;
}
.shadow-btn:hover:not(:disabled) {
  background: #555;
  transform: translateY(-1px);
}
.shadow-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
