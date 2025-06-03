<template>
  <div class="setting-group">
    <h3 v-if="title" class="group-title">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: { type: String, default: '' }
})
</script>

<style scoped>
.setting-group {
  background: #2a2a2a;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  padding: 12px 0;
}
.group-title {
  color: #e0e0e0;
  font-size: 16px;
  font-weight: 600;
  margin: 0 24px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding-bottom: 8px;
}
</style>
