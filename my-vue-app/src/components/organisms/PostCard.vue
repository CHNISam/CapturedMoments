<script setup>
/* ---------- props / emits ---------- */
const props = defineProps({
  post:         { type:Object, required:true },
  currentUser:  { type:String, required:true },
  getAvatar:    { type:Function, required:true },
  badgeHTML:    { type:Function, required:true }
})
const emit = defineEmits(['edit','delete','toggle-comments','send-comment'])

/* ---------- local state ---------- */
import { computed, ref } from 'vue'
const showMenu     = ref(false)
const commentsOpen = ref(false)
const newComment   = ref('')

/* ---------- helpers ---------- */
const postDate = computed(()=> new Date(props.post.ts).toLocaleDateString())
const postTime = computed(()=> new Date(props.post.ts).toLocaleTimeString())

function sendComment(){
  if(!newComment.value.trim()) return
  emit('send-comment',props.post,newComment.value.trim())
  newComment.value=''
}
</script>

<template>
  <div class="post card">
    <!-- 头 -->
    <div class="head">
      <div class="left">
        <img :src="getAvatar(post.uid)" class="avatar"/>
        <b>{{ post.uid===currentUser ? '我' : post.uid }}</b>
        <span v-html="badgeHTML(post.uid)"></span>
        <small class="date">{{ postDate }} {{ postTime }}</small>
      </div>

      <div class="more-wrapper" v-if="post.uid===currentUser">
        <span class="more" @click="showMenu=!showMenu">⋯</span>
        <transition name="options-pop">
          <div v-if="showMenu" class="post-options">
            <button @click="emit('edit',post)">
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
              </svg>
            </button>
            <button class="trash-btn" @click="emit('delete',post)">
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/>
                <path d="M9 6v12"/>
                <path d="M15 6v12"/>
                <path d="M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6"/>
              </svg>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- 文本 -->
    <div class="body">
      <p v-html="post.txt"></p>
    </div>

    <!-- 图片缩略 -->
    <div class="photos" v-if="post.imgs.length">
      <div v-for="(img,i) in post.imgs.slice(0,3)" :key="i" class="thumb">
        <img :src="img"/>
        <div v-if="i===2 && post.imgs.length>3" class="thumb-overlay">
          <svg class="stack-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="6" rx="1" ry="1"/>
            <rect x="6" y="12" width="18" height="6" rx="1" ry="1"/>
          </svg>
          <span class="overlay-count">+{{ post.imgs.length-3 }}</span>
        </div>
      </div>
    </div>

    <!-- actions -->
    <div class="actions">
      <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z m0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
      <span>{{ post.views }}</span>

      <svg class="comment-toggle" @click="commentsOpen=!commentsOpen"
           viewBox="0 0 24 24" style="cursor:pointer;margin-left:8px;">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z"
              fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>{{ post.cmts.length }}</span>
    </div>

    <!-- 评论 -->
    <div v-if="commentsOpen" class="comments">
      <div v-for="(c,i) in post.cmts" :key="i" class="comment">
        <span class="comment-display">{{ c.who }}: {{ c.txt }}</span>
      </div>
      <div class="c-input">
        <input v-model="newComment" placeholder="评论..."
               @keydown.enter.prevent="sendComment"/>
        <button class="btn-publish" @click="sendComment">发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/post-card-base.css';         /* 把你原来那大段样式抽出去; 若无, 直接复制 */
</style>
