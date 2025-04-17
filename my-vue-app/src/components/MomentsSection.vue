<template>
  <section id="moments">
    <h2 class="big">投稿</h2>
    <!-- 发动态表单（保留你原来的模板、逻辑） -->
    <NewPostForm />

    <h2 class="big">动态</h2>
    <div id="moments-list">
      <!-- 动态卡片 -->
      <PostCard
        v-for="p in store.posts"
        :key="p.id"
        :post="p"
      />
    </div>
  </section>
</template>

<script setup>
import { useStore } from '@/composables/useStore'
import NewPostForm from './NewPostForm.vue'; // 如果觉得表单逻辑太多，也可拆成子组件
import PostCard from './PostCard.vue'; // 同理：一个动态卡片单独维护

const store = useStore()
</script>
