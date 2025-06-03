<template>
  <label class="file-upload-btn">
    <span>{{ label }}</span>
    <input type="file" :accept="accept" @change="onFileChange" />
  </label>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  label:  { type: String, default: '上传文件' },
  accept: { type: String, default: '*' }
})
const emit = defineEmits(['fileSelected'])

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    emit('fileSelected', file)
  }
}
</script>

<style scoped>
.file-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(45,45,45,0.7);
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}
.file-upload-btn input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.file-upload-btn:hover {
  background: rgba(70,70,70,0.8);
}
</style>
