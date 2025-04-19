<template>
<transition name="fade">
  <!-- 用 <form> 包裹，浏览器才会弹出保存密码 -->
  <form
    v-if="show"
    id="loginModal"
    class="modal show"
    @submit.prevent="confirmLogin"
    autocomplete="on"
  >
    <div class="box login-box">
      <h3 style="margin-bottom:16px">登录 Captured Moments</h3>
      <!-- uid input -->
      <input
        name="username"
        autocomplete="username"
        type="text"
        v-model.trim="uidInput"
        placeholder="请输入原神 UID"
        style="width:100%;padding:8px;margin-bottom:10px;border-radius:8px;border:1px solid #ccc;"
      />
      <!-- pwd input -->
      <input
        name="password"
        autocomplete="current-password"
        type="password"
        v-model="loginPassword"
        placeholder="密码（首次输入将被保存）"
        style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;"
      />
      <!-- submit 按钮 -->
      <button type="submit" class="btn-publish" style="margin-top:12px;width:100%;">
        进入
      </button>
    </div>
  </form>
</transition>
</template>

<script>
/**
 * LoginModal.vue
 * - 支持白名单校验
 * - 首次设置密码后缓存到 localStorage
 * - 后续登录进行密码校验
 */

import { ALLOWED_UIDS } from '@/composables/constants';
import { login } from '@/composables/useAuth';

export default {
  name: 'LoginModal',
  props: {
    show: { type: Boolean, default: true }
  },
  emits: ['login-success'],
  data () {
    return {
      uidInput: '',        // 用户输入的 UID
      loginPassword: ''    // 用户输入的密码
    };
  },
  methods: {
    confirmLogin() {
      // 1. 去掉 UID 前后空格
      const uid = this.uidInput.trim()

      // 2. 白名单校验
      if (!ALLOWED_UIDS.includes(uid)) {
        return alert('用户不存在')
      }

      // 3. 调用 login()：首次会自动存密码（或用默认密码），后续会比对返回 true/false
      if (!login(uid, this.loginPassword)) {
        return alert('密码不正确，请重试！')
      }

      // 4. 开门成功：通知父组件 & 清空输入
      this.$emit('login-success', uid)
      this.uidInput      = ''
      this.loginPassword = ''
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>