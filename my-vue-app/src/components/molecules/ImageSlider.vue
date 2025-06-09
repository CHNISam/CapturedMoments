<script setup>
import { onMounted, ref, watch } from 'vue';
const props = defineProps({
  images:     { type: Array, required: true },
  modelValue: { type: Number, default: 0 }
});
const emit = defineEmits(['update:modelValue','zoom-change']);
const index = ref(props.modelValue);
const zoom  = ref(1);
watch(() => props.modelValue, v => index.value = v);
watch(index, v => emit('update:modelValue', v));
function prev() { if (index.value > 0) index.value--; zoom.value = 1; emit('zoom-change', zoom.value); }
function next() { if (index.value < props.images.length-1) index.value++; zoom.value = 1; emit('zoom-change', zoom.value); }
function onWheel(e) {
  const d = e.deltaY > 0 ? -0.1 : 0.1;
  zoom.value = Math.min(3, Math.max(0.5, +(zoom.value + d).toFixed(2)));
  emit('zoom-change', zoom.value);
}
onMounted(() => zoom.value = 1);
</script>
<template>
  <div class="slider-content">
    <button class="nav-btn left" @click="prev" :disabled="index<=0">‹</button>
    <img
      :src="images[index]"
      class="slide-img"
      :style="{ transform: `scale(${zoom})`, transition: 'transform .15s' }"
      @wheel.prevent="onWheel"
    />
    <button class="nav-btn right" @click="next" :disabled="index>=images.length-1">›</button>
  </div>
</template>
<style scoped>
.slider-content { display:flex; align-items:center; justify-content:center; background:#000; position:relative; }
.nav-btn{ background:rgba(255,255,255,0.2); border:none; color:#fff; font-size:24px; width:40px; height:40px; border-radius:50%; cursor:pointer; z-index:2; }
.nav-btn.left { margin-right:16px; }
.nav-btn.right{ margin-left:16px; }
.slide-img { max-width:90%; max-height:70vh; display:block; }
</style>