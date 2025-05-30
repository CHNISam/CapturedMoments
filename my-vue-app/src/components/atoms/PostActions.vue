<template>
  <div class="actions">
    <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z m0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
    <span>{{ views }}</span>

    <svg viewBox="0 0 24 24" class="comment-btn" @click="$emit('toggle-comments')">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z"
            fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span>{{ comments }}</span>
  </div>
</template>

<script setup>
defineProps({ views:Number, comments:Number })
defineEmits(['toggle-comments'])
</script>

<style scoped>
.actions{display:flex;align-items:center;gap:6px;font-size:14px;margin:6px 0}
.comment-btn{cursor:pointer;margin-left:8px}
</style>
