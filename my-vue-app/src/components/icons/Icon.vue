<!-- src/components/icons/Icon.vue -->
<script setup>
import { computed } from 'vue'

// 从同目录下引入这四个已经存在的图标组件
import AlbumIcon from './AlbumIcon.vue'
import HomeIcon from './HomeIcon.vue'
import MomentsIcon from './MomentsIcon.vue'
import PostIcon from './PostIcon.vue'

const props = defineProps({
  name: { type: String, required: true } // 'home' | 'moments' | 'albums' | 'post'
})

// 根据 props.name 映射到对应的组件
const map = {
  home:    HomeIcon,
  moments: MomentsIcon,
  albums:  AlbumIcon,
  post:    PostIcon,
}
const Comp = computed(() => map[props.name] || null)
</script>

<template>
  <component :is="Comp" v-if="Comp" />
</template>
