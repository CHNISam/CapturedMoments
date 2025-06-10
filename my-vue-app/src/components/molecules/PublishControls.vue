<!-- src/components/molecules/PublishControls.vue -->
<template>
  <div class="toolbar">
    <button class="btn-publish" @click="$emit('publish')">发布</button>
  </div>
</template>

<script setup>
// 这个组件负责显示“发布”按钮，并在点击时 emit publish 事件
defineEmits(['publish']);
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.btn-publish {
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background .2s;
}
.btn-publish:hover {
  background: #357ab8;
}
</style>
