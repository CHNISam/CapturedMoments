<!-- src/AppMobile.vue -->
<template>
    <div>
      <!-- 可以只显示“投稿”和“照片”两个主要页面，用底部 Tab 切换 -->
      <nav class="mobile-tab">
        <button @click="view = 'moments'">动态</button>
        <button @click="view = 'album'">相册</button>
      </nav>
  
      <section v-if="view==='moments'" id="moments">
        <!-- 精简后的投稿区+列表 -->
        <!-- … -->
      </section>
  
      <section v-else id="album">
        <!-- 移动端图片列表，点击滑动 -->
        <!-- … -->
      </section>
  
      <!-- 移动端 Modal，也可以用滑动关闭手势 -->
      <div v-if="showModal" class="modal-mobile" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <!-- 图片放大、双指缩放逻辑留在这里 -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AppMobile',
    data() {
      return {
        view: 'moments',
        // … 同原来 modalIndex、modalImgs、modalZoom、pinchDist 等
      }
    },
    methods: {
      // 只保留触摸手势和缩放相关的方法
      onTouchStart(e) { /* … */ },
      onTouchEnd(e)   { /* … */ },
      onPinchStart(e) { /* … */ },
      onPinchMove(e)  { /* … */ },
      onPinchEnd()    { /* … */ },
      // 以及图片加载、删除、地点编辑等最核心的方法
    }
  }
  </script>
  
  <style>
  /* 专为移动端优化的样式，比如底部导航固定、字体加大、tap 区域增大等 */
  </style>
  