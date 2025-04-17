<template>
  <transition name="fade">
    <div v-if="show" id="loginModal" class="modal show">
      <div class="box login-box" style="text-align:center;max-width:340px;">
        <h3 style="margin-bottom:16px">登录 Captured&nbsp;Moments</h3>
        <input
          type="text"
          v-model.trim="uidInput"
          placeholder="请输入原神 UID"
          style="width:100%;padding:8px;margin-bottom:10px;border-radius:8px;border:1px solid #ccc;"
        />

        <!-- 输入 / 首次设置密码 -->
        <input
          type="password"
          v-model="loginPassword"
          placeholder="密码（首次输入将被保存）"
          style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;"
        />

        <button
          class="btn-publish"
          style="margin-top:12px;width:100%;"
          @click="confirmLogin"
        >
          进入
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
const ALLOWED_UIDS     = ['217122260', '246490729'];   // 允许登录的原神 UID
const DEFAULT_PASSWORD = '123456';                     // 没设过密码时的默认值

export default {
  name: 'LoginModal',
  props: {
    show: { type: Boolean, default: true }
  },
  emits: ['login-success'],
  data () {
    return {
      uidInput: '',
      loginPassword: ''
    };
  },
  methods: {
    confirmLogin () {
      const uid = this.uidInput.trim();

      // 1. 白名单校验
      if (!ALLOWED_UIDS.includes(uid)) {
        alert('用户不存在');
        return;
      }

      const key     = 'password_' + uid;
      const stored  = localStorage.getItem(key);

      // 2. 首登：要求设置密码
      if (!stored) {
        if (!this.loginPassword.trim()) {
          alert('首次使用请先设置密码！');
          return;
        }
        localStorage.setItem(key, JSON.stringify(this.loginPassword));
        alert('密码已保存，下次请使用同一密码登录');
      }
      // 3. 普通登录：校验密码
      else if (this.loginPassword !== JSON.parse(stored)) {
        alert('密码不正确，请重试！');
        return;
      }

      // 4. 登录成功，通知父组件
      this.$emit('login-success', uid);

      // 5. 清理输入框
      this.uidInput = '';
      this.loginPassword = '';
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active{transition:opacity .3s ease}
.fade-enter,
.fade-leave-to{opacity:0}
</style>
