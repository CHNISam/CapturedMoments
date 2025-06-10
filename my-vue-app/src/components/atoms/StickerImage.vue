<template>
  <img
    class="inline-sticker-picker-img"
    :src="src"
    @click="$emit('click')"
  />
</template>

<script setup>
// src：贴图 URL
const props = defineProps({ src: { type: String, required: true } });
defineEmits(['click']);
</script>

<style scoped>
.inline-sticker-picker-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  cursor: pointer;
}
</style>
