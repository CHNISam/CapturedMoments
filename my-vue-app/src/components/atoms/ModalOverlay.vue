<script setup>
const emit = defineEmits(['close']);
</script>
<template>
  <div class="overlay" @click.self="$emit('close')">
    <slot />
  </div>
</template>
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>