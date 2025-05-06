### Updated ResponsiveWrapper.vue
```vue
<template>
  <div
    :class="[
      'responsive-wrapper',
      { 'no-full-height': !fullHeight, 'center-content': centerContent }
    ]"
    ref="wrapper"
    :style="{
      '--minWidth': typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
      '--maxWidth': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
    }"
  >
    <slot />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  minWidth: { type: [String, Number], default: '280px' },
  maxWidth: { type: [String, Number], default: '600px' },
  /**
   * 是否使用满屏高度 (100dvh)，一般用于页面主内容
   * 设置为 false 时自动收缩高度并可垂直居中
   */
  fullHeight: { type: Boolean, default: true },
  /**
   * 是否在容器内部垂直 + 水平居中子元素
   * 通常配合 fullHeight=false 在 Modal 场景使用
   */
  centerContent: { type: Boolean, default: false }
})

const wrapper = ref(null)

function scrollActiveInput() {
  const active = document.activeElement
  if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) {
    active.scrollIntoView({ behavior: 'smooth', block: 'center' })
    nextTick(() => active.focus())
  }
}

function handleResize() {
  // 触发重绘，保证过渡效果
  wrapper.value?.getBoundingClientRect()
  scrollActiveInput()
}

onMounted(() => {
  window.addEventListener('orientationchange', handleResize)
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('orientationchange', handleResize)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.responsive-wrapper {
  /* clamp(min, ideal, max) */
  width: clamp(var(--minWidth), 90vw, var(--maxWidth));
  margin: 0 auto;
  transition: width 0.3s ease, padding 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  /* 默认是否铺满可视高度 */
  min-height: 100dvh;
  box-sizing: border-box;
}

/* 不使用满高时，收缩高度 */
.no-full-height {
  min-height: auto !important;
  padding: 0;
}

/* 如果需要在内部居中子元素 */
.center-content {
  justify-content: center;
  align-items: center;
}

/* 竖屏微调 */
@media (orientation: portrait) {
  .responsive-wrapper {
    padding: 24px;
  }
}

/* 横屏微调 */
@media (orientation: landscape) {
  .responsive-wrapper {
    padding: 32px;
  }
}
</style>