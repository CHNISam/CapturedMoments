<template>
  <div class="slider-content">
    <SliderNavButton dir="left" :disabled="prevDisabled" @navigate="onPrev">‹</SliderNavButton>
    <slot />
    <SliderNavButton dir="right" :disabled="nextDisabled" @navigate="onNext">›</SliderNavButton>
  </div>
</template>
<script>
import SliderNavButton from '@/components/atoms/SliderNavButton.vue';
export default {
  name: 'SliderControls',
  components: { SliderNavButton },
  props: { prevDisabled: Boolean, nextDisabled: Boolean },
  emits: ['prev','next'],
  methods: { onPrev() { this.$emit('prev') }, onNext() { this.$emit('next') } }
};
</script>
<style scoped>
.slider-content { display:flex; align-items:center; justify-content:center; background:#000; position:relative; }
</style>
