// src/components/atoms/SliderImage.vue
<template>
  <img :src="src" @load="$emit('load', $event)"
       :style="{ transform: `scale(${zoom})`, transition: 'transform .15s' }"
       @wheel.prevent="$emit('wheel', $event)" class="slide-img" />
</template>
<script>
export default {
  name: 'SliderImage',
  props: { src: String, zoom: Number },
  emits: ['load','wheel']
};
</script>
<style scoped>
.slide-img { max-width: 90%; max-height: 70vh; display: block; }
</style>