<template>
  <label class="toggle-switch">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="onToggle"
    />
    <span class="slider"></span>
  </label>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

function onToggle(e) {
  emit('update:modelValue', e.target.checked)
}
</script>

<style scoped>
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  background-color: #444;
  border-radius: 10px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background-color 0.2s;
}
.slider::before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #ddd;
  transition: transform 0.2s, background-color 0.2s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #4a90e2;
}
input:checked + .slider::before {
  transform: translateX(20px);
  background-color: #fff;
}
</style>
