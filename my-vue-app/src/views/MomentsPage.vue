<template>
  <section id="moments" class="moments-page">
    <h2 class="section-title">📸 动态</h2>
    <DynamicFeed />
  </section>
</template>

<script setup>
import DynamicFeed from '@/components/DynamicFeed.vue';
</script>

<style scoped>
.moments-page { padding: 1.5rem 2rem; }
.section-title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
