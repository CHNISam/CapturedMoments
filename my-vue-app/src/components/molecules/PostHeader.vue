<template>
  <div class="post-header">
    <Avatar :src="getAvatar(uid)" :alt="uid" />
    <div class="header-info">
      <strong>{{ uid === currentUser ? '我' : uid }}</strong>
      <span v-html="badgeHTML(uid)" />
      <small>{{ date }} {{ time }}</small>
    </div>
  </div>
</template>

<script setup>
import Avatar from '@/components/atoms/Avatar.vue';

const props = defineProps({
  uid: { type: String, required: true },
  currentUser: { type: String, required: true },
  getAvatar: { type: Function, required: true },
  badgeHTML: { type: Function, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});
</script>

<style scoped>
.post-header {
  display: flex;
  align-items: center;
}
.header-info {
  margin-left: 8px;
}
.header-info small {
  display: block;
  color: var(--text-muted);
  font-size: 0.85em;
}
</style>
