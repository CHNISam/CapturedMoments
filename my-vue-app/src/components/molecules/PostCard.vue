<script setup>
import CommentSection from '@/components/molecules/CommentSection.vue';
import PostActions from '@/components/molecules/PostActions.vue';
import PostContent from '@/components/molecules/PostContent.vue';
import PostHeader from '@/components/molecules/PostHeader.vue';
import PostOptions from '@/components/molecules/PostOptions.vue';
import { computed, ref } from 'vue';

const props = defineProps({
  post:        { type: Object, required: true },
  currentUser: { type: String, required: true },
  getAvatar:   { type: Function, required: true },
  badgeHTML:   { type: Function, required: true }
});
const emit = defineEmits([
  'edit', 'delete', 'toggle-comments', 'send-comment'
]);

const showMenu     = ref(false);
const commentsOpen = ref(false);

const postDate = computed(() => new Date(props.post.ts).toLocaleDateString());
const postTime = computed(() => new Date(props.post.ts).toLocaleTimeString());

function handleEdit() {
  emit('edit', props.post);
}
function handleDelete() {
  emit('delete', props.post);
}
function toggleComments() {
  commentsOpen.value = !commentsOpen.value;
  emit('toggle-comments', props.post);
}
function onSendComment(text) {
  emit('send-comment', props.post, text);
}
</script>

<template>
  <div class="post card">
    <div class="head">
      <PostHeader
        :uid="post.uid"
        :current-user="currentUser"
        :get-avatar="getAvatar"
        :badge-html="badgeHTML"
        :date="postDate"
        :time="postTime"
      />
      <div v-if="post.uid === currentUser" class="more-wrapper">
        <span class="more" @click="showMenu = !showMenu">⋯</span>
        <transition name="options-pop">
          <PostOptions
            v-if="showMenu"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </transition>
      </div>
    </div>

    <PostContent :text="post.txt" :images="post.imgs" />

    <PostActions
      :comments="post.cmts.length"
      :views="post.views"
      @toggle-comments="toggleComments"
    />

    <CommentSection
      v-if="commentsOpen"
      :comments="post.cmts"
      @send-comment="onSendComment"
    />
  </div>
</template>

<style scoped>
@import '@/assets/css/post-card-base.css';
</style>
