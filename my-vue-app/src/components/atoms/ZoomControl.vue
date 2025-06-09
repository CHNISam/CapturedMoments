<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  min:        { type: Number, default: 0.5 },
  max:        { type: Number, default: 3 }
});
const emit = defineEmits(['update:modelValue']);
function onInput(e) { emit('update:modelValue', Number(e.target.value)); }
</script>
<template>
  <div class="zoom-control">
    <svg class="icon zoom-icon" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <line x1="16" y1="16" x2="22" y2="22" />
    </svg>
    <input
      type="range"
      :min="min"
      :max="max"
      step="0.1"
      :value="modelValue"
      @input="onInput"
    />
  </div>
</template>
<style scoped>
.zoom-control {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.zoom-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
}
.zoom-control input { width: 100px; }
</style>