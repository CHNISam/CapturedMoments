<template>
  <div class="sticker-picker">
    <StickerImage
      v-for="s in stickers"
      :key="s.id"
      :src="s.url"
      @click="select(s.url)"
    />
    <div class="picker-nav">
      <button @click="$emit('prev')" :disabled="prevDisabled">‹</button>
      <button @click="$emit('next')" :disabled="nextDisabled">›</button>
    </div>
  </div>
</template>

<script setup>
import StickerImage from '@/components/atoms/StickerImage.vue';

// stickers：当前页要显示的贴图数组
// prevDisabled/nextDisabled：上一页/下一页按钮是否禁用
const props = defineProps({
  stickers: Array,
  prevDisabled: Boolean,
  nextDisabled: Boolean
});
const emit = defineEmits(['select','prev','next']);

function select(url) {
  emit('select', url);
}
</script>

<style scoped>
.sticker-picker {
  position: absolute;
  bottom: 64px;
  left: 68px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(6, 32px);
  gap: 8px;
  z-index: 200;
}
.picker-nav {
  grid-column: span 6;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
.picker-nav button {
  background: none;
  border: none;
  color: #eee;
  font-size: 18px;
  cursor: pointer;
}
</style>
