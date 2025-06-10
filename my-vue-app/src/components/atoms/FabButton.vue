<template>
  <button class="fab" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
// 发出 click 事件
const emit = defineEmits(['click']);
</script>

<style scoped>
.fab {
  position: absolute;
  bottom: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .2s;
}
.fab:hover {
  background: #555;
}
.fab svg {
  width: 20px;
  height: 20px;
  stroke: #fff;
}
</style>
