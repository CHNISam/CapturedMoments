<!-- src/components/molecules/SliderModalNavButton.vue -->
<template>
  <button
    :class="['slider-modal__nav-btn', direction]"
    @click="$emit('click')"
    :disabled="disabled"
  >
    {{ direction === 'left' ? '‹' : '›' }}
  </button>
</template>

<script>
export default {
  name: 'SliderModalNavButton',
  props: {
    direction: {
      type: String,
      validator: v => ['left', 'right'].includes(v),
      required: true
    },
    disabled: Boolean
  }
}
</script>

<style scoped>
.slider-modal__nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.2);
  border: none; color: #fff; font-size: 24px;
  border-radius: 50%; cursor: pointer;
  transition: background .2s; z-index:2;
}
.slider-modal__nav-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.4);
}
.slider-modal__nav-btn.left { left: 16px; }
.slider-modal__nav-btn.right { right: 16px; }
.slider-modal__nav-btn:disabled { opacity:.3; cursor:default; }
</style>
