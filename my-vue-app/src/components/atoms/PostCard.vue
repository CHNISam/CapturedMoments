<template>
  <article class="post-card">
    <header class="head">
      <img :src="avatarUrl" class="avatar" />
      <b>{{ author }}</b>
      <small class="date">{{ time }}</small>
    </header>

    <section class="body" v-html="content" />

    <slot name="images" />
    <slot name="actions" />
    <slot name="comments" />
  </article>
</template>

<script setup>
defineProps({
  avatarUrl: String,
  author:    String,
  time:      String,
  content:   String
})
</script>

<style scoped>
.post-card{border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:16px}
.head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.avatar{width:34px;height:34px;border-radius:50%}
.date{color:#888;font-size:12px}
.body{margin:8px 0;line-height:1.5}
</style>
