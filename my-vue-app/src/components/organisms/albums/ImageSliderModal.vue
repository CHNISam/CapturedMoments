<!-- src/components/organisms/albums/ImageSliderModal.vue -->
<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <div class="slider-box">
      <!-- Info 按钮 -->
      <InfoButton
        :active="infoVisible"
        @toggle="toggleInfo"
      />

      <!-- 图片滑动区域 -->
      <div :class="['slider-content', { 'with-info': infoVisible }]">
        <NavButton
          direction="left"
          @click="prev"
          :disabled="currentIndex <= 0"
        />
        <img
          ref="slideImg"
          class="slide-img"
          :src="images[currentIndex]"
          @load="updateSize"
          :style="{ transform: `scale(${zoom})`, transition: 'transform .15s' }"
          @wheel.prevent="onWheel"
        />
        <NavButton
          direction="right"
          @click="next"
          :disabled="currentIndex >= images.length - 1"
        />
      </div>

      <!-- 删除按钮（内部已 confirm） -->
      <DeleteButton @delete="handleDelete" />

      <!-- 缩放滑杆 -->
      <ZoomControl
        v-model="zoom"
        :min="minZoom"
        :max="maxZoom"
      />

      <!-- Info 面板 -->
      <transition name="sidebar-slide">
        <InfoPanel
          v-if="infoVisible"
          :size="size"
          :date="formattedDate"
        />
      </transition>

      <!-- 页码指示 -->
      <div class="meta">{{ currentIndex + 1 }} / {{ images.length }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import NavButton    from '@/components/molecules/albums/NavButton.vue'
import InfoButton   from '@/components/molecules/albums/InfoButton.vue'
import DeleteButton from '@/components/molecules/albums/DeleteButton.vue'
import ZoomControl  from '@/components/molecules/albums/ZoomControl.vue'
import InfoPanel    from '@/components/molecules/albums/InfoPanel.vue'

const props = defineProps({
  images:       { type: Array,   required: true },
  initialIndex: { type: Number,  default: 0 },
  visible:      { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'delete-image'])

const currentIndex = ref(props.initialIndex)
const zoom         = ref(1)
const minZoom      = 0.5
const maxZoom      = 3
const infoVisible  = ref(false)
const size         = ref('')
const slideImg     = ref(null)

const formattedDate = computed(() => new Date().toLocaleString())

watch(() => props.initialIndex, v => currentIndex.value = v)
watch(currentIndex, () => {
  zoom.value = 1
  updateSize()
})

function close() {
  emit('update:visible', false)
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < props.images.length - 1) currentIndex.value++
}

function onWheel(e) {
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.min(maxZoom, Math.max(minZoom, +(zoom.value + delta).toFixed(2)))
}

function updateSize(e) {
  const img = e?.target || slideImg.value
  if (img) size.value = `${img.naturalWidth} × ${img.naturalHeight}`
}

function toggleInfo() {
  infoVisible.value = !infoVisible.value
}

function handleDelete() {
  emit('delete-image', currentIndex.value)
}

onMounted(updateSize)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.slider-box {
  position: relative;
  width: 80vw;
  max-width: 800px;
  background: var(--card-light);
  border-radius: 8px;
  overflow: hidden;
}

/* 滑动内容 */
.slider-content {
  position: relative;
  background: #000;
  text-align: center;
  padding: 20px 0;
  transition: transform .3s ease;
}
.slider-content.with-info {
  transform: translateY(-120px);
}
.slide-img {
  max-width: 90%;
  max-height: 70vh;
  display: inline-block;
}

/* InfoPanel 过渡 */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform .25s ease, opacity .25s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* 元信息 */
.meta {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.4);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
