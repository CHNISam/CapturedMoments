<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <div class="slider-box">
      <button class="more-btn" @click="toggleOptions">⋯</button>

      <!-- Info 按钮，加 active class -->
      <button class="info-btn" :class="{ active: infoVisible }" @click="toggleInfo"
        :aria-label="infoVisible ? '收起信息' : '查看信息'">
        <svg viewBox="0 0 24 24" class="icon">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
          <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <line x1="12" y1="11" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <transition name="options-pop">
        <div v-if="optionsVisible" class="options-panel">
          <button class="option" @click="confirmDelete">删除</button>
        </div>
      </transition>

      <!-- slider-content 根据 infoVisible 推上去 -->
      <div :class="['slider-content', { 'with-info': infoVisible }]">
        <button class="nav-btn left" @click="prev" :disabled="currentIndex <= 0">‹</button>
        <img ref="slideImg" class="slide-img" :src="images[currentIndex]" @load="updateSize"
          :style="{ transform: `scale(${zoom})`, transition: 'transform .15s' }" @wheel.prevent="onWheel" />
        <button class="nav-btn right" @click="next" :disabled="currentIndex >= images.length - 1">›</button>
      </div>

      <button class="delete-btn" @click="confirmDelete">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M3 6h18M9 6v12m6-12v12M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6" />
        </svg>
      </button>

      <div class="zoom-control">
        <svg class="icon zoom-icon" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="16" y1="16" x2="22" y2="22" />
        </svg>
        <input type="range" :min="minZoom" :max="maxZoom" step="0.1" v-model.number="zoom" />
      </div>

      <transition name="sidebar-slide">
        <div v-if="infoVisible" class="info-panel">
          <p><b>尺寸：</b>{{ size }}</p>
          <p><b>日期：</b>{{ formattedDate }}</p>
        </div>
      </transition>

      <div class="meta">{{ currentIndex + 1 }} / {{ images.length }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSliderModal',
  props: {
    images: Array,
    initialIndex: Number,
    visible: Boolean
  },
  data() {
    return {
      currentIndex: this.initialIndex,
      zoom: 1, minZoom: 0.5, maxZoom: 3,
      optionsVisible: false,
      infoVisible: false,
      size: ''
    };
  },
  computed: {
    formattedDate() {
      return new Date().toLocaleString();
    }
  },
  watch: {
    initialIndex(val) { this.currentIndex = val; },
    currentIndex() {
      this.zoom = 1;
      this.optionsVisible = false;
      // **不要再这里重置 infoVisible，保持开关状态**
      this.updateSize();
    }
  },
  methods: {
    close() { this.$emit('update:visible', false); },
    prev() { if (this.currentIndex > 0) this.currentIndex--; },
    next() { if (this.currentIndex < this.images.length - 1) this.currentIndex++; },
    onWheel(e) {
      const d = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, +(this.zoom + d).toFixed(2)));
    },
    updateSize(e) {
      const img = e?.target || this.$refs.slideImg;
      if (img) this.size = `${img.naturalWidth} × ${img.naturalHeight}`;
    },
    toggleOptions() { this.optionsVisible = !this.optionsVisible; },
    toggleInfo() { this.infoVisible = !this.infoVisible; },
    confirmDelete() {
      if (confirm('确定要删除这张照片吗？')) {
        this.$emit('delete-image', this.currentIndex);
      }
    }
  },
  mounted() { this.updateSize(); }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .7);
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

/* 关闭 / 更多 按钮 */
.more-btn {
  position: absolute;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px;
}

.more-btn {
  top: 8px;
  right: 48px;
}

/* Info 按钮，active 态加 class */
.info-btn {
  position: absolute;
  top: 8px;
  right: 50px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.4);
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
  background: rgba(0, 0, 0, 0.6);
}

.info-btn.active {
  background: #007aff;
  /* iOS 蓝 */
  color: #fff;
}

/* slider-content：切换图片时固定位置；with-info 推上去 */
.slider-content {
  position: relative;
  background: #000;
  text-align: center;
  padding: 20px 0;
  transition: transform .3s ease;
}

.slider-content.with-info {
  transform: translateY(-120px);
  /* 推上去的距离按设计调 */
}

.slider-content img {
  max-width: 90%;
  max-height: 70vh;
  display: inline-block;
}

/* 导航按钮：绝对定位不抖 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 2;
  transition: background .2s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.nav-btn.left {
  left: 16px;
}

.nav-btn.right {
  right: 16px;
}

/* 其他按钮、面板保持原样 */
.options-panel {
  position: absolute;
  top: 40px;
  right: 48px;
  background: var(--card-light);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.option {
  display: block;
  padding: 8px 12px;
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
}

.delete-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .2s, transform .2s, border .2s;
  z-index: 5;
}

.delete-btn:hover {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.08);
  /* 微弱白感，深色适配 */
  border: 1px solid rgba(255, 255, 255, 0.12);
  /* 极细白边，突出轮廓 */
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, border 0.2s;
  z-index: 5;
}

.delete-btn .icon {
  stroke: #ffffff;
  width: 20px;
  height: 20px;
}

/* Hover 时 */
.delete-btn:hover {
  transform: scale(1.05);
  /* 略微放大提示可点 */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  /* 加深阴影 */
}

/* 点击（active）时 */
.delete-btn:active {
  transform: scale(0.95);
  /* 点击时产生“按下”感觉 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  /* 阴影收窄，模拟凹陷 */
}


.zoom-control {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.zoom-control input {
  width: 100px;
}

.info-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--card-light);
  padding: 12px 16px;
}

.meta {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}

/* 弹出/收起 info-panel 的过渡 */
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
</style>
