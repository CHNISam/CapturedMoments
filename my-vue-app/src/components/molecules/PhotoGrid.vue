<script setup>
import PhotoItem from '@/components/atoms/PhotoItem.vue';
const props = defineProps({ photos: { type: Array, required: true } });
const emit = defineEmits(['select']);
function select(idx) { emit('select', idx); }
</script>
<template>
  <div class="photo-grid">
    <PhotoItem
      v-for="(url, idx) in photos"
      :key="idx"
      :src="url"
      @click="select(idx)"
    />
  </div>
</template>
<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 18px;
  justify-items: center;
}
</style>