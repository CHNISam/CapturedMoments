<template>
  <div class="info-panel">
    <p><b>尺寸：</b>{{ size }}</p>
    <p><b>日期：</b>{{ date }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  size: { type: String, default: '' },
  date: { type: String, default: '' }
})
</script>

<style scoped>
.info-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--card-light);
  padding: 12px 16px;
}
</style>
