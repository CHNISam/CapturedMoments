<template>
  <section id="moments">
    <PostCard v-for="p in posts" :key="p.id"
              :post="p" :current-user="currentUser"
              @edit="startEdit" @delete="deletePost" @comment="sendComment"/>
  </section>
</template>

<script setup>
import PostCard from '@/components/organisms/PostCard.vue'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'
const { currentUser } = useUserStore()
const posts = reactive(JSON.parse(localStorage.getItem('posts')||'[]'))
</script>
