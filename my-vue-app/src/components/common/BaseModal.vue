<template>
    <Teleport to="body">
      <div v-if="show" class="modal show" @click.self="close">
        <div class="box" :style="boxStyle">
          <span class="close" @click="close">×</span>
          <h3 v-if="title" class="modal-title">{{ title }}</h3>
          <div class="modal-body"><slot /></div>
          <div class="modal-footer">
            <!-- 透传 close 方法给 footer 插槽 -->
            <slot name="footer" :close="close" />
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    modelValue: Boolean,
    title: String,
    maxWidth: { type: String, default: '480px' },
  })
  const emit = defineEmits(['update:modelValue'])
  const show = computed({
    get:  () => props.modelValue,
    set:  v => emit('update:modelValue', v)
  })
  const close = () => show.value = false
  
  const boxStyle = computed(() => ({
    width:   '90vw',
    maxWidth: props.maxWidth,
    padding: '24px',
    position: 'relative',
  }))
  </script>
  
  <style>
  .modal.show {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
  }
  
  .box {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    color: var(--text-color);
  }
  
  /* 顶部的 × 按钮 */
  .close {
    position: absolute; top: 8px; right: 8px; cursor: pointer;
  }
  
  .modal-title { margin-bottom: 16px; }
  .modal-body  { margin-bottom: 24px; }
  
  /* —— 关键 👇 把按钮右对齐，主/次操作分开 —— */
  .modal-footer {
    display: flex;
    justify-content: flex-end;  /* 右对齐 */
    gap: 12px;                   /* 按钮间隔 */
    padding-top: 8px;
  }
  </style>
  