// src/components/atoms/InputField.vue
<template>
  <div>
    <input
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      @input="onInput"
      :class="['input-field', { 'has-error': error } ]"
    />
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
const props = defineProps({
  modelValue: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  maxlength: { type: [String, Number], default: 255 },
  autocomplete: { type: String, default: 'off' },
  error: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue','input'])
function onInput(e) {
  emit('update:modelValue', e.target.value)
  emit('input', e)
}
</script>

<style scoped>
.input-field {
  width: 100%;
  height: 56px;
  padding: 0 12px;
  background: var(--input-bg, #1e1e1e);
  border: 1px solid var(--input-border, #333);
  border-radius: 8px;
  color: var(--input-text, #eee);
  font-size: 16px;
}
.input-field.has-error {
  border-color: var(--error-color, #f55);
}
</style>