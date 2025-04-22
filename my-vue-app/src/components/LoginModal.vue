<template>
  <transition name="fade">
    <div v-if="visible" class="modal show">
      <div class="box login-box">
        <h3 class="login-title">登录 Captured Moments</h3>
        <div class="form-group">
          <input
            v-model="uid"
            type="text"
            placeholder="请输入原神 UID"
            @input="error = ''"
          />
        </div>
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            :placeholder="isFirstLogin
              ? '首次设置密码（建议至少4位）'
              : '请输入密码'"
            @input="error = ''"
          />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button
          class="btn-publish"
          :disabled="!canSubmit || loading"
          @click="onSubmit"
        >
          {{ loading ? '请稍候...' : submitText }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ALLOWED_UIDS } from '@/config/auth';
import { computed, ref, watch } from 'vue';

const props = defineProps({ show: Boolean });
const emit = defineEmits(['login-success']);

const uid = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const storageKey = computed(() => `password_${uid.value.trim()}`);
const storedHash = computed(() => localStorage.getItem(storageKey.value));

const isFirstLogin = computed(
  () => uid.value.trim() !== '' && !storedHash.value
);
const submitText = computed(
  () => isFirstLogin.value ? '设置并登录' : '登录'
);
const canSubmit = computed(
  () => uid.value.trim() !== '' && password.value.trim() !== ''
);

// SHA-256 哈希函数
async function hashPwd(text) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function onSubmit() {
  error.value = '';
  loading.value = true;
  const id = uid.value.trim();
  if (!ALLOWED_UIDS.includes(id)) {
    error.value = '用户不存在';
    loading.value = false;
    return;
  }
  const pwd  = password.value;
  const hash = await hashPwd(pwd);
  const raw  = storedHash.value;  // localStorage.getItem

  // 首次登录：存储哈希
  if (!raw) {
    if (pwd.length < 4) {
      error.value = '密码长度至少 4 位';
      loading.value = false;
      return;
    }
    localStorage.setItem(storageKey.value, hash);
  } else {
    // 兼容旧版明文：JSON.parse(raw) 得到旧密码
    const plain = (() => {
      try { return JSON.parse(raw); }
      catch { return null; }
    })();
    if (hash !== raw && pwd !== plain) {
      error.value = '密码不正确，请重试';
      loading.value = false;
      return;
    }
    // 成功：统一写入新哈希
    localStorage.setItem(storageKey.value, hash);
  }

  // 正常登录成功
  setTimeout(() => {
    emit('login-success', id);
    uid.value = '';
    password.value = '';
    loading.value = false;
  }, 300);
}


const visible = computed(() => props.show);
watch(visible, v => {
  if (v) {
    uid.value = '';
    password.value = '';
    error.value = '';
    loading.value = false;
  }
});
</script>

<style scoped>
.login-box { overflow: visible !important; }
.login-box::-webkit-scrollbar { display: none; }

.login-box {
  width: 88%;
  max-width: 360px;
  margin: 0 auto;
  padding: 28px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.login-title {
  margin-bottom: 24px;
  font-size: 22px;
  color: #333;
  font-weight: 600;
}
.form-group {
  margin-bottom: 18px;
}
input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 15px;
  transition: border-color 0.2s;
}
input:focus {
  outline: none;
  border-color: var(--primary);
}
.error-msg {
  color: #e00;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: left;
}
.btn-publish {
  width: 100%;
  height: 50px;
  font-size: 16px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-publish:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-publish:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 480px) {
  .login-box {
    padding: 20px;
  }
  .login-title {
    font-size: 20px;
  }
  input {
    height: 44px;
    font-size: 14px;
  }
  .btn-publish {
    height: 46px;
    font-size: 15px;
  }
}
</style>
