<template>
  <button class="ghost-btn" :disabled="disabled" @click="onClick">
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
.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(45,45,45,0.7);
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.ghost-btn:hover:not(:disabled) {
  background: rgba(70,70,70,0.8);
}
.ghost-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
