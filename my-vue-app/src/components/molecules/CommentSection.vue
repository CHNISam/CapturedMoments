<template>
  <div class="comments">
    <CommentList :comments="comments" />
    <CommentEditor v-model="newComment" @send="onSend" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CommentList from '@/components/molecules/CommentList.vue';
import CommentEditor from '@/components/molecules/CommentEditor.vue';

const props = defineProps({
  comments: { type: Array, default: () => [] }
});
const emit = defineEmits(['send-comment']);
const newComment = ref('');

function onSend(text) {
  emit('send-comment', text);
  newComment.value = '';
}
</script>

<style scoped>
.comments {
  margin-top: 12px;
}
</style>
