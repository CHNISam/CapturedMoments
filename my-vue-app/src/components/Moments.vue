<template>
  <div>
    <h2 class="big">投稿</h2>
    <div id="new-post" class="card" style="display:flex; flex-direction:column; gap:12px;">
      <textarea v-model="postText" placeholder="说点什么…"></textarea>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <select v-model="postPlace">
          <option value="">无地点</option>
          <option>蒙德</option>
          <option>璃月</option>
          <option>稻妻</option>
          <option>须弥</option>
          <option>枫丹</option>
          <option>纳塔</option>
        </select>
        <label class="btn-ghost upload-btn">
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="file" accept="image/*" multiple @change="handleFileChange">
        </label>
        <button @click="publish" class="btn-publish">发布</button>
      </div>
      <div id="preview" style="display:flex; gap:8px; overflow-x:auto;">
        <img v-for="(url,index) in draftImgs" :key="index" :src="url">
      </div>
    </div>
    <h2 class="big">动态</h2>
    <div id="moments-list">
      <div v-for="post in posts" :key="post.id" class="post card">
        <div class="head" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:34px; height:34px; border-radius:50%; background:url(getAvatar(post.uid)) center/cover"></div>
            <b>{{ displayName(post.uid) }}</b>
            <!-- 此处可增加红点标记未读状态 -->
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:12px">{{ new Date(post.ts).toLocaleTimeString() }}</span>
            <span v-if="post.uid === currentUser" class="more" @click="deletePost(post)">⋯</span>
          </div>
        </div>
        <div class="body">
          <p>{{ post.txt }}</p>
          <small>{{ new Date(post.ts).toLocaleDateString() }}{{ post.place ? ' · ' + post.place : '' }}</small>
        </div>
        <div class="photos">
          <img 
            v-for="(img, index) in post.imgs" 
            :key="index" 
            :src="img" 
            @click="openPhoto(img, formatMeta(post))"
          >
        </div>
        <div class="actions">
          <svg viewBox="0 0 24 24">
            <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z m0 12a5 5 0 110-10 5 5 0 010 10z"/>
          </svg>
          <span>{{ post.views }}</span>
        </div>
        <div class="comments">
          <div 
            v-for="(c, index) in post.cmts" 
            :key="index" 
            class="comment"
          >
            <div class="comment-left">
              <span class="comment-text">{{ c.txt }}</span>
            </div>
            <div class="comment-right">
              <span 
                v-if="c.who === currentUser" 
                class="comment-edit" 
                @click="editComment(post, index)"
              >✎</span>
              <span 
                v-if="c.who === currentUser" 
                class="comment-delete" 
                @click="deleteComment(post, index)"
              >×</span>
              <span v-else class="comment-author">{{ c.who }}</span>
            </div>
          </div>
          <div class="c-input">
            <input 
              v-model="newComments[post.id]" 
              type="text" 
              placeholder="评论..."
            >
            <button class="btn-publish" style="font-size:13px" @click="sendComment(post)">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Moments',
  props: {
    posts: Array,
    currentUser: String
  },
  data() {
    return {
      postText: '',
      postPlace: '',
      draftImgs: [],
      newComments: {} // { postId: '评论内容' }
    }
  },
  methods: {
    handleFileChange(e) {
      this.draftImgs = [];
      const files = Array.from(e.target.files).slice(0, 3);
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        this.draftImgs.push(url);
      });
    },
    publish() {
      if (!this.currentUser) return alert('请先登录');
      if (!this.postText.trim() && this.draftImgs.length === 0) {
        return alert('写点文字或选张图片吧~');
      }
      const newPost = {
        id: Date.now(),
        uid: this.currentUser,
        txt: this.postText.trim(),
        place: this.postPlace,
        imgs: [...this.draftImgs],
        ts: Date.now(),
        views: 0,
        cmts: []
      };
      this.$emit('add-post', newPost);
      this.postText = '';
      this.postPlace = '';
      this.draftImgs = [];
    },
    getAvatar(uid) {
      return localStorage.getItem('avatar-' + uid) || 'https://placehold.co/60';
    },
    displayName(uid) {
      return localStorage.getItem('displayName_' + uid) || uid;
    },
    deletePost(post) {
      if (confirm('撤回这条动态？')) {
        this.$emit('delete-post', post);
      }
    },
    sendComment(post) {
      const text = this.newComments[post.id];
      if (!text || !text.trim()) return;
      post.cmts.push({ who: this.currentUser, txt: text.trim() });
      this.newComments[post.id] = '';
    },
    deleteComment(post, index) {
      if (confirm('确定撤回该评论吗？')) {
        post.cmts.splice(index, 1);
      }
    },
    editComment(post, index) {
      const oldText = post.cmts[index].txt;
      const newText = prompt('编辑评论：', oldText);
      if (newText !== null && newText.trim() !== '' && newText !== oldText) {
        post.cmts[index].txt = newText.trim();
      }
    },
    openPhoto(img, meta) {
      this.$emit('open-photo', img, meta);
    },
    formatMeta(post) {
      return `${new Date(post.ts).toISOString().slice(0,10)} · ${post.place || '未知'}`;
    }
  }
}
</script>
