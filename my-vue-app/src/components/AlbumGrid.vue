<template>
  <div class="album-grid">
    <div
      v-for="album in albums"
      :key="album.id"
      class="album-item"
    >
      <img :src="album.src" alt="" class="album-thumb" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// 示例相册数据，可替换为接口请求或全局状态
const albums = ref([]);

onMounted(() => {
  // TODO: 从后端或 localStorage 加载相册图片列表
  albums.value = [
    { id: 1, src: '/images/a1.jpg' },
    { id: 2, src: '/images/a2.jpg' },
    { id: 3, src: '/images/a3.jpg' },
    { id: 4, src: '/images/a4.jpg' },
    // … 按需增删 …
  ];
});
</script>

<style scoped>
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  padding: 0 1rem;
}

.album-item {
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform .2s;
}

.album-item:hover {
  transform: scale(1.05);
}

.album-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
