<!-- src/views/LoginPage.vue -->
<template>
  <LoginModal show @login-success="onLogin" />
</template>

<script setup>
import LoginModal from '@/components/organisms/LoginModal.vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route  = useRoute()
const userStore = useUserStore()

function onLogin(uid) {
  userStore.login(uid)
  // 登录后跳回来
  const redirect = route.query.redirect || '/moments'
  router.replace(redirect)
}
</script>
