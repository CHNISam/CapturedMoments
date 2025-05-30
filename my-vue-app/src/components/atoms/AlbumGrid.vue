<template>
  <div class="album-grid">
    <div
      v-for="(img, idx) in images"
      :key="idx"
      class="album-grid__item"
    >
      <img :src="img.url" :alt="img.alt || 'Album image'" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  images: { type: Array, required: true }  // [{ url: '...', alt: '...' }, …]
})
</script>

<style scoped>
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}
.album-grid__item img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
}
</style>
