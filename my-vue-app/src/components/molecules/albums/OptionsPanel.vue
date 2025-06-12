<template>
  <div class="options-panel">
    <button class="option" @click="$emit('delete')">删除</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['delete'])
</script>

<style scoped>
.options-panel {
  position: absolute;
  top: 40px;
  right: 48px;
  background: var(--card-light);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.option {
  display: block;
  padding: 8px 12px;
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
}
</style>
