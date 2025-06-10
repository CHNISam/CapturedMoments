<template>
  <div class="post-content">
    <p v-html="text"></p>
    <div v-if="images.length" class="photos">
      <div v-for="(img, i) in previewImages" :key="i" class="thumb">
        <img :src="img" />
        <div v-if="i === 2 && images.length > 3" class="thumb-overlay">
          <svg class="stack-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="6" rx="1" ry="1" />
            <rect x="6" y="12" width="18" height="6" rx="1" ry="1" />
          </svg>
          <span class="overlay-count">+{{ images.length - 3 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  text: { type: String, default: '' },
  images: { type: Array, default: () => [] }
});
const previewImages = computed(() => props.images.slice(0, 3));
</script>

<style scoped>
.post-content p {
  margin-bottom: 12px;
}
.photos {
  display: flex;
  gap: 8px;
}
.thumb {
  position: relative;
}
.thumb img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.thumb-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 16px;
}
</style>
