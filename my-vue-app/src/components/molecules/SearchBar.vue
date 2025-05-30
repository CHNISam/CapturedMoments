<script setup>
import { ref } from 'vue'
const q = ref('')
defineEmits(['search'])
function submit(){ emit('search',q.value) }
</script>

<template>
  <form class="search-form" @submit.prevent="submit">
    <input v-model="q" placeholder="Search…" />
    <IconBtn aria="搜索">
      <!-- 放大镜 SVG 原样贴进来 -->
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </IconBtn>
  </form>
</template>

<style scoped>
.search-form{ display:flex; flex:1; max-width:400px; }
.search-form input{
  flex:1; padding:6px 10px; background:#282828; color:#e0e0e0;
  border:1px solid #303030; border-right:none; border-radius:2px 0 0 2px;
}
</style>
