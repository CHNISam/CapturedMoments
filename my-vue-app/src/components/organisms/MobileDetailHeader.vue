<template>
  <header class="detail-header">
    <button class="back-btn" @click="$emit('back')" aria-label="返回">
      <svg class="icon-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <h2 class="detail-title">{{ title }}</h2>
    <span class="header-spacer"></span>
  </header>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  title: { type: String, required: true }
})
const emit = defineEmits(['back'])
</script>

<style scoped>
.detail-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #181818;
  color: #e0e0e0;
}
.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icon-back {
  width: 24px;
  height: 24px;
}
.detail-title {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  text-align: center;
  user-select: none;
}
.header-spacer {
  width: 36px;
  height: 36px;
}
</style>
