<template>
  <div class="post-actions">
    <IconBtn label="toggle-comments" @click="$emit('toggle-comments')">
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z" />
      </svg>
    </IconBtn>
    <span>{{ comments }}</span>
    <div class="views">
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z"/>
        <path d="M12 12a5 5 0 110-10 5 5 0 010 10z"/>
      </svg>
      <span>{{ views }}</span>
    </div>
  </div>
</template>

<script setup>
import IconBtn from '@/components/atoms/IconBtn.vue';
const props = defineProps({
  comments: { type: Number, default: 0 },
  views:    { type: Number, default: 0 }
});
</script>

<style scoped>
.post-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
