<template>
  <input
    class="text-input"
    :placeholder="placeholder"
    v-model="localValue"
    @input="$emit('update:modelValue', localValue)"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)
watch(() => props.modelValue, v => (localValue.value = v))
</script>

<style scoped>
.text-input {
  background: #1f1f1f;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 8px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.text-input::placeholder {
  color: #888;
}
.text-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
}
</style>
