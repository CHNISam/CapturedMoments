<template>
  <input
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :value="modelValue"
    @input="onInput"
  />
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min:        { type: Number, default: 0 },
  max:        { type: Number, default: 1 },
  step:       { type: Number, default: 0.05 }
})
const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', parseFloat(e.target.value))
}
</script>

<style scoped>
input[type="range"] {
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;
  transition: background 0.2s;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #777;
  cursor: pointer;
  transition: background 0.2s;
}
input[type="range"]:hover {
  background: #444;
}
input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #777;
  cursor: pointer;
  transition: background 0.2s;
}
</style>
