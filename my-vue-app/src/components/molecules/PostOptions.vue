<template>
  <div class="post-options">
    <IconBtn label="edit" @click="$emit('edit')">
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    </IconBtn>
    <IconBtn label="delete" @click="$emit('delete')">
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M3 6h18" />
        <path d="M9 6v12" />
        <path d="M15 6v12" />
        <path d="M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6" />
      </svg>
    </IconBtn>
  </div>
</template>

<script setup>
import IconBtn from '@/components/atoms/IconBtn.vue';
</script>

<style scoped>
.post-options {
  display: flex;
  gap: 8px;
}
</style>
