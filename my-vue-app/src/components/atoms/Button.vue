// src/components/atoms/Button.vue
<template>
  <button
    v-bind="$attrs"
    class="btn-atom"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="loading">请稍候...</span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
const props = defineProps({
  disabled: { type: Boolean, default: false },
  loading:  { type: Boolean, default: false }
})
const emit = defineEmits(['click'])
function onClick(e) { if (!props.disabled) emit('click', e) }
</script>

<style scoped>
.btn-atom {
  width:100%;height:48px;
  background:var(--btn-bg,#32414a);
  color:var(--btn-text,#ddd);
  border:none;border-radius:8px;font-size:15px;
  cursor:pointer;transition:transform .1s;
}
.btn-atom:disabled{opacity:.6;cursor:not-allowed;}
.btn-atom:not(:disabled):hover{transform:translateY(-1px);background:var(--btn-hover-bg,#2b3540);}
</style>