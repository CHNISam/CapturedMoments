<template>
  <button class="delete-btn" @click="handleClick" aria-label="删除">
    <svg viewBox="0 0 24 24" class="icon">
      <path d="M3 6h18M9 6v12m6-12v12M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6" />
    </svg>
  </button>
</template>

<script setup>
const emit = defineEmits(['delete'])

function handleClick() {
  if (confirm('确定要删除这张照片吗？')) {
    emit('delete')
  }
}
</script>

<style scoped>
.delete-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
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
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}
.delete-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.delete-btn .icon {
  stroke: #fff;
  width: 20px;
  height: 20px;
}
</style>
