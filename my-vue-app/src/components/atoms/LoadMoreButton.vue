<template>
  <button class="btn-load-more" @click="$emit('load')">
    <slot>加载更多</slot>
  </button>
</template>

<script setup>
defineEmits(['load'])
</script>

<style scoped>
.btn-load-more{padding:8px 16px;border:1px solid #aaa;background:none;border-radius:4px;cursor:pointer}
.btn-load-more:hover{background:rgba(0,0,0,.05)}
</style>
