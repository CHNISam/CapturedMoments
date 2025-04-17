<template>
    <!-- 全局 `.btn-ghost` 样式来自 App.vue 中的 CSS  -->
    <a class="btn-ghost" @click="handleLogout">退出</a>
  </template>
  
  <script>
  import { logout } from '@/composables/useAuth';
  
  export default {
    name: 'LogoutButton',
    emits: ['logged-out'],
    methods: {
      handleLogout () {
        logout();
        this.$emit('logged-out');
      }
    }
  };
  </script>
  
  <style scoped>
  /* 如果你想要额外定制退出按钮，可在这里写；
     目前复用全局 .btn-ghost 即可保持一致视觉风格 */
  </style>