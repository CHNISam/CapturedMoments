import { defineStore } from 'pinia';

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [],
    loadedCount: 5,
    loadStep: 5,
    isListLoading: false
  }),

  getters: {
    visiblePosts: state => state.posts.slice(0, state.loadedCount)
  },

  actions: {
    fetchPosts() {
      this.isListLoading = true;
      // TODO: replace localStorage with real API call
      this.posts = JSON.parse(localStorage.getItem('posts') || '[]');
      this.isListLoading = false;
    },

    createPost(post) {
      this.posts.unshift(post);
      // 在存储时剥离图片数据，前端再根据情况加载
      const stripped = this.posts.map(p => ({ ...p, imgs: [] }));
      localStorage.setItem('posts', JSON.stringify(stripped));
    },

    updatePost(updated) {
      const idx = this.posts.findIndex(p => p.id === updated.id);
      if (idx !== -1) {
        this.posts.splice(idx, 1, updated);
        localStorage.setItem('posts', JSON.stringify(this.posts));
      }
    },

    deletePost(id) {
      this.posts = this.posts.filter(p => p.id !== id);
      const stripped = this.posts.map(p => ({ ...p, imgs: [] }));
      localStorage.setItem('posts', JSON.stringify(stripped));
    },

    loadMore() {
      this.loadedCount += this.loadStep;
    }
  }
});
