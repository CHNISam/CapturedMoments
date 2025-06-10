<template>
  <div class="demo-container">
    <h2>PostCard 全场景 Demo</h2>
    <PostCard
      v-for="post in demoPosts"
      :key="post.id"
      :post="post"
      currentUser="Alice"
      :getAvatar="getAvatar"
      :badgeHTML="badgeHTML"
      @edit="onEdit"
      @delete="onDelete"
      @toggle-comments="onToggleComments"
      @send-comment="onSendComment"
      style="margin-bottom: 24px;"
    />
  </div>
</template>

<script setup>
// ① 导入你的模拟数据
import { demoPosts } from '@/data/demoPosts.js'
// ② 导入核心组件
import PostCard from '@/components/molecules/PostCard.vue'

// 简单实现头像和徽章逻辑
function getAvatar(uid) {
  return `https://placehold.co/40?text=${uid.charAt(0)}`
}
function badgeHTML(uid) {
  return uid === 'Bob' ? '<span style="color:gold">★</span>' : ''
}

// 事件回调
function onEdit(post)          { console.log('edit', post) }
function onDelete(post)        { console.log('delete', post) }
function onToggleComments(post){ console.log('toggle-comments', post) }
function onSendComment(post, txt) { console.log('send-comment', post, txt) }
</script>

<style scoped>
.demo-container {
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
}
</style>
