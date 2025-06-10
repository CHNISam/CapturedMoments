<!-- src/components/molecules/SliderModalInfoButton.vue -->
<template>
  <button
    class="slider-modal__info-btn"
    :class="{ active }"
    @click="$emit('click')"
    :aria-label="active? '收起信息':'查看信息'"
  >
    <svg viewBox="0 0 24 24" class="icon">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="11" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'SliderModalInfoButton',
  props: { active: Boolean }
}
</script>

<style scoped>
.slider-modal__info-btn {
  position:absolute; top:8px; right:50px;
  width:36px; height:36px;
  background: rgba(0,0,0,0.4); color:#fff;
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:background .2s,box-shadow .2s; z-index:1001;
}
.slider-modal__info-btn:hover { background: rgba(0,0,0,0.6); }
/* 激活态 */
.slider-modal__info-btn.active {
  background:#fff; color:#007aff;
  box-shadow:0 0 0 2px rgba(0,122,255,0.6);
}
.icon { stroke: currentColor; fill: none; width:20px; height:20px; }
</style>
