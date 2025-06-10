<template>
  <div class="comment-editor">
    <input
      v-model="text"
      class="comment-input"
      type="text"
      placeholder="评论..."
      @keydown.enter.prevent="onSend"
    />
    <button class="btn-publish" @click="onSend">发送</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: { type: String, default: '' }
});
const emit = defineEmits(['update:modelValue', 'send']);
const text = ref(props.modelValue);

watch(() => props.modelValue, v => (text.value = v));

function onSend() {
  if (!text.value.trim()) return;
  emit('send', text.value.trim());
  emit('update:modelValue', '');
}
</script>

<style scoped>
.comment-editor {
  display: flex;
  gap: 8px;
}
.comment-input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
}
.btn-publish {
  padding: 8px 12px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
}
</style>
