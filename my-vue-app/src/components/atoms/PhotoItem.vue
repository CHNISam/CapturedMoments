<script setup>
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' }
});
const emit = defineEmits(['click']);
function onClick() { emit('click'); }
</script>
<template>
  <div class="photo-item" @click="onClick">
    <img :src="src" :alt="alt" class="photo-thumb" />
  </div>
</template>
<style scoped>
.photo-item {
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: transform .2s;
}
.photo-item:hover { transform: scale(1.05); }
.photo-thumb {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}
</style>