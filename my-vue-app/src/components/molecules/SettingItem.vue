<template>
  <div class="setting-item">
    <label class="setting-label">
      <slot name="label" />
    </label>
    <div class="setting-control">
      <slot name="control" />
    </div>
  </div>
</template>

<script setup>
// 此组件不含脚本逻辑，仅做布局：左侧 label、右侧控件
</script>

<style scoped>
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.setting-item:last-child {
  border-bottom: none;
}
.setting-label {
  flex: 0 0 120px;
  color: #e0e0e0;
  font-size: 14px;
  white-space: nowrap;
}
.setting-control {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}
</style>
