<template>
  <button class="sidebar-item" :class="{active}" @click="$emit('click')">
    <slot/>
  </button>
</template>

<script setup>
defineProps({ active:Boolean })
defineEmits(['click'])
</script>

<style scoped>
.sidebar-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:16px 0;width:100%;background:none;border:none;cursor:pointer}
.sidebar-item.active,.sidebar-item:hover{background:#383838}
.sidebar-item svg{width:24px;height:24px;stroke:#e0e0e0}
.sidebar-item span{font-size:12px;color:#e0e0e0}
/* 侧栏图标和文字统一白色 */
.app-sidebar .sidebar-item span,
.app-sidebar .sidebar-item svg {
  color: #fff;
  stroke: #fff;
}

</style>
