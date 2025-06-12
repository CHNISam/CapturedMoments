<template>
  <button
    class="info-btn"
    :class="{ active }"
    @click="$emit('toggle')"
    :aria-label="active ? '收起信息' : '查看信息'"
  >
    <svg viewBox="0 0 24 24" class="icon">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
      <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="12" y1="11" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>
</template>

<script setup>
const props = defineProps({
  active: { type: Boolean, default: false }
})
</script>

<style scoped>
.info-btn {
  position: absolute;
  top: 8px;
  right: 50px;
  width: 36px;
  height: 36px;
  background: rgba(0,0,0,0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  z-index: 1001;
  transition: background .2s, color .2s;
}
.info-btn:hover {
  background: rgba(0,0,0,0.6);
}
.info-btn.active {
  background: #007aff;
  color: #fff;
}
</style>
