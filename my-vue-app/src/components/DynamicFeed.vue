<template>
  <div class="dynamic-feed">
    <div
      v-for="item in feedItems"
      :key="item.id"
      class="feed-item"
    >
      <img :src="item.image" alt="" class="item-image" />
      <p class="item-text">{{ item.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// 示例动态数据，可替换为接口请求或全局状态
const feedItems = ref([]);

onMounted(() => {
  // TODO: 从后端或 localStorage 加载动态列表
  feedItems.value = [
    { id: 1, image: '/images/1.jpg', text: '第一条动态：和你一起的午后' },
    { id: 2, image: '/images/2.jpg', text: '第二条动态：那年夏天的海边' },
    { id: 3, image: '/images/3.jpg', text: '第三条动态：夜晚的星空' },
    // … 按需增删 …
  ];
});
</script>

<style scoped>
.dynamic-feed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem;
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
}
</style>
