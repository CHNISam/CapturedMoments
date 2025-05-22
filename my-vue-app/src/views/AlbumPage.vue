<template>
  <section id="albums" class="album-page">
    <h2 class="section-title">🖼 相册</h2>
    <div class="album-grid">
      <AlbumGrid />
    </div>
  </section>
</template>

<script setup>
import AlbumGrid from '@/components/AlbumGrid.vue';
</script>

<style scoped>
.album-page {
  padding: 1.5rem 2rem;
}
.section-title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(120px,1fr));
  gap: 1rem;
}
</style>
