<template>
  <img :src="src" :alt="alt" class="avatar" />
</template>

<script setup>
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: 'avatar' }
});
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
