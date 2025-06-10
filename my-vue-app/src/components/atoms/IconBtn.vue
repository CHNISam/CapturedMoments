<!-- src/components/atoms/IconBtn.vue -->
<script setup>
const props = defineProps({
  aria: { type: String, default: '' },     // 可访问性标签
  size: { type: Number, default: 40 }       // 尺寸
})
</script>

<template>
  <button
    class="icon-btn"
    :aria-label="aria"
    @click="$emit('click')"
    :style="{ '--btn-size': size + 'px' }"
  >
    <slot />
  </button>
</template>

<style scoped>
.icon-btn {
  width: var(--btn-size, 40px);
  height: var(--btn-size, 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.icon-btn:hover {
  background: #383838;
}
</style>
