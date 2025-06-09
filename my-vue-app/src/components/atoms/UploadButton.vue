<script setup>
const props = defineProps({
  accept: { type: String, default: 'image/*' },
  multiple: { type: Boolean, default: false }
});
const emit = defineEmits(['change']);
function onChange(e) { emit('change', e); }
</script>
<template>
  <label class="upload-button">
    <slot>选择文件</slot>
    <input type="file" :accept="accept" :multiple="multiple" @change="onChange" hidden />
  </label>
</template>
<style scoped>
.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--primary);
}
.upload-button input { display: none; }
</style>