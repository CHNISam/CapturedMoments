<template>
  <div>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      @input="onInput"
      :class="['input-field', { 'has-error': error }]"
    />
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: true },
  type:       { type: String, default: 'text' },
  placeholder:{ type: String, default: '' },
  maxlength:  { type: [String, Number], default: 255 },
  autocomplete:{ type: String, default: 'off' },
  error:      { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<style scoped>
.input-field {
  width: 100%; height: 56px; padding: 0 12px;
  background: var(--input-bg, #2a2a2a);
  border: 1px solid var(--input-border, #444);
  border-radius: 8px; color: var(--input-text, #eee);
  font-size: 16px;
}
.input-field.has-error {
  border-color: var(--error-color, #f55);
}
.input-field::placeholder {
  color: #999;
}
</style>
