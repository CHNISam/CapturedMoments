<template>
  <transition name="fade">
    <div v-if="visible" class="modal show">
      <div class="box login-box">
        <h3 class="login-title">登录 Captured Moments</h3>
        <form
          ref="loginForm"
          method="post"
          action="/login"
          autocomplete="on"
          @submit="handleSubmit"
        >
          <div class="form-group">
            <input
              v-model="uid"
              name="username"
              type="text"
              placeholder="请输入原神 UID"
              @input="error = ''"
              autocomplete="username"
            />
          </div>
          <div class="form-group">
            <input
              v-model="password"
              name="password"
              type="password"
              :placeholder="isFirstLogin
                ? '首次设置密码（建议至少4位）'
                : '请输入密码'"
              @input="error = ''"
              :autocomplete="isFirstLogin ? 'new-password' : 'current-password'"
            />
          </div>
          <p v-if="error" class="error-msg">{{ error }}</p>
          <button
            type="submit"
            class="btn-publish"
            :disabled="!canSubmit || loading"
          >
            {{ loading ? '请稍候...' : (isFirstLogin ? '设置并登录' : '登录') }}
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { getAllowedUids } from '@/config/auth';
import { computed, ref, watch } from 'vue';

// Props & Emits
const props = defineProps({ show: Boolean });
const emit = defineEmits(['login-success']);

// Refs
const loginForm = ref(null);

// State
const uid = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const tick = ref(0);

// Storage keys
const hashKey = computed(() => `password_${uid.value.trim()}`);
const saltKey = computed(() => `salt_${uid.value.trim()}`);

// Read hash & salt, force-refresh via tick
const storedHash = computed(() => { tick.value; return localStorage.getItem(hashKey.value); });
const storedSalt = computed(() => { tick.value; return localStorage.getItem(saltKey.value); });

// Flags
const isFirstLogin = computed(() => uid.value.trim() !== '' && !storedHash.value);
const canSubmit = computed(() => uid.value.trim() !== '' && password.value.trim() !== '');
const visible = computed(() => props.show);

// SHA-256 helper
async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Salted hash
async function saltedHash(pwd, salt) {
  const first = await sha256Hex(pwd + salt);
  return await sha256Hex(first + salt);
}

// Generate or retrieve salt
function getOrCreateSalt() {
  let salt = localStorage.getItem(saltKey.value);
  if (!salt) {
    const arr = crypto.getRandomValues(new Uint8Array(8));
    salt = Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
    localStorage.setItem(saltKey.value, salt);
  }
  return salt;
}

// Form submit handler
async function handleSubmit(e) {
  e.preventDefault();
  error.value = '';
  loading.value = true;
  const id = uid.value.trim();

  if (!getAllowedUids().includes(id)) {
    error.value = '用户不存在';
    loading.value = false;
    return;
  }

  const pwd = password.value;
  const rawHash = storedHash.value;
  const salt = storedSalt.value;

  // First-time login
  if (!rawHash) {
    if (pwd.length < 4) {
      error.value = '密码长度至少4位';
      loading.value = false;
      return;
    }
    const newSalt = getOrCreateSalt();
    const newHash = await saltedHash(pwd, newSalt);
    localStorage.setItem(hashKey.value, newHash);
    tick.value++;
  }
  // Salted login
  else if (salt) {
    const check = await saltedHash(pwd, salt);
    if (check !== rawHash) {
      error.value = '密码不正确，请重试';
      loading.value = false;
      return;
    }
  }
  // Legacy support
  else {
    let plain = null;
    try { plain = JSON.parse(rawHash); } catch {}
    const simple = await sha256Hex(pwd);
    if (pwd === plain || simple === rawHash) {
      const newSalt = getOrCreateSalt();
      const newHash = await saltedHash(pwd, newSalt);
      localStorage.setItem(hashKey.value, newHash);
      tick.value++;
    } else {
      error.value = '密码不正确，请重试';
      loading.value = false;
      return;
    }
  }

  // Save current user
  localStorage.setItem('currentUser', JSON.stringify(id));
  emit('login-success', id);

  // Delay then submit real form to trigger browser prompt
  setTimeout(() => {
    if (loginForm.value && typeof loginForm.value.submit === 'function') {
      loginForm.value.submit();
    } else {
      console.warn('loginForm ref not found, cannot submit form');
    }
  }, 100);
}

// Reset state when modal opens
watch(visible, v => {
  if (v) {
    uid.value = '';
    password.value = '';
    error.value = '';
    loading.value = false;
    tick.value++;
  }
});
</script>

<style scoped>
.login-box { overflow: visible; }
.login-box::-webkit-scrollbar { display: none; }

.login-box {
  width: 90%; max-width: 360px;
  margin: 0 auto; padding: 24px;
  text-align: center;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}
.login-title { margin-bottom:20px; font-size:20px; font-weight:600; }
.form-group { margin-bottom:16px; }
input {
  width:100%; height:44px; padding:0 12px;
  border:1px solid #ccc; border-radius:8px;
  font-size:14px;
}
input:focus { outline:none; border-color:var(--primary); }
.error-msg { color:#e00; font-size:13px; margin-bottom:12px; text-align:left; }
.btn-publish {
  width:100%; height:48px;
  background:var(--primary); color:#fff;
  border:none; border-radius:8px;
  font-size:15px; cursor:pointer;
  transition: transform 0.1s;
}
.btn-publish:disabled { opacity:0.6; cursor:not-allowed; }
.btn-publish:not(:disabled):hover { transform: translateY(-1px); }
@media (max-width:480px) {
  .login-box { padding:16px; }
  input { height:42px; font-size:13px; }
  .btn-publish { height:44px; font-size:14px; }
}
</style>
