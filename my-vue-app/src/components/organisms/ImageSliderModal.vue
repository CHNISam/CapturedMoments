// src/components/ImageSliderModal.vue
<template>
    <div v-if="visible" class="overlay" @click.self="close">
        <div class="slider-box">
            <button class="close-btn" @click="close">×</button>
            <button class="more-btn" @click="toggleOptions">⋯</button>
            <button class="info-btn" @click="toggleInfo" :aria-label="infoVisible ? '收起信息' : '查看信息'">
                <svg viewBox="0 0 24 24" class="icon">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
                    <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <line x1="12" y1="11" x2="12" y2="16" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" />
                </svg>
            </button>

            <transition name="options-pop">
                <div v-if="optionsVisible" class="options-panel">
                    <button class="option" @click="$emit('delete-image', currentIndex)">删除</button>
                </div>
            </transition>

            <div class="slider-content">
                <button class="nav-btn left" @click="prev" :disabled="currentIndex <= 0">‹</button>
                <img ref="slideImg" class="slide-img" :src="images[currentIndex]" @load="updateSize"
                    :style="{ transform: `scale(${zoom})`, transition: 'transform .15s' }" @wheel.prevent="onWheel" />
                <button class="nav-btn right" @click="next" :disabled="currentIndex >= images.length - 1">›</button>
            </div>

            <button class="delete-btn" @click="$emit('delete-image', currentIndex)">
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
            this.zoom = 1; this.optionsVisible = false; this.infoVisible = false;
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
        toggleInfo() { this.infoVisible = !this.infoVisible; }
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

.close-btn,
.more-btn,
.info-btn {
    position: absolute;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 8px;
}

.close-btn {
    top: 8px;
    right: 16px;
}

.more-btn {
    top: 8px;
    right: 48px;
}

.info-btn {
    top: 8px;
    right: 80px;
}

.icon {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    fill: none;
}

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
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
}

.slider-content {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    position: relative;
}

.nav-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: #fff;
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 2;
}

.nav-btn.left {
    margin-right: 16px;
}

.nav-btn.right {
    margin-left: 16px;
}

.slide-img {
    max-width: 90%;
    max-height: 70vh;
    display: block;
}

.delete-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.08); /* 微弱白感，深色适配 */
  border: 1px solid rgba(255, 255, 255, 0.12); /* 极细白边，突出轮廓 */
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

.delete-btn:hover {
  background: rgba(255, 255, 255, 0.15); /* hover 稍亮一点点 */
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.delete-btn .icon {
  stroke: #ffffff;
  width: 20px;
  height: 20px;
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

/* sidebar-slide transitions */
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
</style>