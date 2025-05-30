<template>
  <p class="error-message">{{ message }}</p>
</template>

<script setup>
const props = defineProps({
  message: { type: String, required: true }
})
</script>

<style scoped>
.error-message {
  color: var(--error-color, #f55);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: left;
}
</style>
