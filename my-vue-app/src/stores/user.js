// src/stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  // 1. state：初始化时，从 localStorage 读，确保刷新后还能拿到上次登录状态
  state: () => ({
    currentUser: localStorage.getItem('cm_currentUser') || null,
    avatarMap: JSON.parse(localStorage.getItem('cm_avatarMap') || '{}')
  }),

  // 2. getters：可选，给模板或别的 Store 用来快速读值
  getters: {
    isLoggedIn: state => !!state.currentUser,

    // 新增：统一的头像取值 + 默认回退
    getAvatar: (state) => {
      return (uid) => {
        const url = state.avatarMap[uid];
        return url && url.length > 0
          ? url
          : 'https://placehold.co/60';
      };
    }
  },

  // 3. actions：所有修改 state 的场景，都顺带同步到 localStorage
  actions: {
    login(uid) {
      console.log('🔥 userStore.login called with', uid)
      this.currentUser = uid
      localStorage.setItem('cm_currentUser', uid)
    },
    logout() {
      this.currentUser = null
      localStorage.removeItem('cm_currentUser')
    },
    setAvatar(uid, url) {
      // 更新内存中 avatarMap
      this.avatarMap = { ...this.avatarMap, [uid]: url }
      // 同步到 localStorage
      localStorage.setItem('cm_avatarMap', JSON.stringify(this.avatarMap))
    }
  }
})
