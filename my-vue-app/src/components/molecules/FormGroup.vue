// src/components/molecules/FormGroup.vue
<template>
  <div class="form-group">
    <InputField
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :error="!!errorMessage"
      @input="onInput"
    />
    <ErrorMessage v-if="errorMessage" :message="errorMessage" />
  </div>
</template>

<script setup>
import ErrorMessage from '@/components/atoms/ErrorMessage.vue'
import InputField from '@/components/atoms/InputField.vue'
import { defineEmits, defineProps } from 'vue'
const props = defineProps({
  value:        { type: String, required: true },
  type:         { type: String, default: 'text' },
  placeholder:  { type: String, default: '' },
  maxlength:    { type: [String, Number], default: 255 },
  autocomplete: { type: String, default: 'off' },
  errorMessage:{ type: String, default: '' }
})
const emit = defineEmits(['update:value','input'])
function onInput(e) {
  emit('update:value', e)
  emit('input', e)
}
</script>

<style scoped>
.form-group {
  margin-bottom: 16px;
}
</style>
