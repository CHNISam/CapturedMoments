<template>
  <button
    class="nav-btn"
    :class="direction"
    :disabled="disabled"
    @click="$emit('click')"
    aria-label="翻页"
  >
    {{ direction === 'left' ? '‹' : '›' }}
  </button>
</template>

<script setup>
const props = defineProps({
  direction: { type: String, default: 'left' },  // 'left' or 'right'
  disabled:  { type: Boolean, default: false }
})
</script>

<style scoped>
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 2;
  transition: background .2s;
}
.nav-btn:hover {
  background: rgba(255,255,255,0.4);
}
.nav-btn.left { left: 16px; }
.nav-btn.right { right: 16px; }
</style>
