<template>
  <PostCard
    v-for="p in posts"
    :key="p.id"
    :avatar-url="p.avatar"
    :author="p.author"
    :time="p.time"
    :content="p.content"
  >
    <template #images>
      <PostImages :imgs="p.imgs" @open="i=>emit('open-modal',{post:p,idx:i})"/>
    </template>

    <template #actions>
      <PostActions
        :views="p.views"
        :comments="p.cmts.length"
        @toggle-comments="emit('toggle-comments',p)"
      />
    </template>

    <template #comments>
      <slot name="comments" :post="p"/>
    </template>
  </PostCard>

  <LoadMoreButton v-if="hasMore" @load="emit('load-more')" />
</template>

<script setup>
import LoadMoreButton from '@/components/atoms/LoadMoreButton.vue'
import PostActions from '@/components/atoms/PostActions.vue'
import PostCard from '@/components/atoms/PostCard.vue'
import PostImages from '@/components/atoms/PostImages.vue'

const props = defineProps({ posts:Array, hasMore:Boolean })
const emit  = defineEmits(['load-more','open-modal','toggle-comments'])
</script>
