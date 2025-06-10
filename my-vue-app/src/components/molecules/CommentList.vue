<template>
  <div class="comment-list">
    <div v-for="(c, i) in comments" :key="i" class="comment-item">
      <strong>{{ c.who }}:</strong> {{ c.txt }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  comments: { type: Array, default: () => [] }
});
</script>

<style scoped>
.comment-item {
  margin-bottom: 8px;
}
</style>
