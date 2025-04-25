<template>
  <transition name="fade">
    <div v-if="visible" class="modal show">
      <div class="box login-box">
        <h3 class="login-title">登录 Captured Moments</h3>
        <form
          ref="loginForm"
          method="post"
          action="/login"
          autocomplete="on"
          @submit.prevent="handleSubmit"
        >
          <div class="form-group">
            <input
              v-model="uid"
              name="username"
              type="text"
              placeholder="请输入原神 UID"
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
import { getAllowedUids } from '@/config/auth'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

// Props & Emits
const props = defineProps({ show: Boolean })
const emit = defineEmits(['login-success'])

// Refs & state
const loginForm = ref(null)
const uid = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const tick = ref(0)
let submitTimeout = null

// Storage keys
const credKey = computed(() => `cred_${uid.value.trim()}`)
const failKey = computed(() => `fail_${uid.value.trim()}`)
const MAX_FAIL = 10

// Reactive read
const storedCred = computed(() => {
  tick.value
  return JSON.parse(localStorage.getItem(credKey.value) || 'null')
})

// Flags
const isFirstLogin = computed(() => uid.value.trim() !== '' && !storedCred.value)
const canSubmit = computed(() => uid.value.trim() !== '' && password.value.trim() !== '')
const visible = computed(() => props.show)

// PBKDF2 helper
async function pbkdf2Hash(pwd, salt, iter = 100000) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(pwd), { name: 'PBKDF2' }, false, ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: iter, hash: 'SHA-256' },
    key, 256
  )
  return Array.from(new Uint8Array(bits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// constant-time hex compare
function equalTiming(aHex, bHex) {
  if (aHex.length !== bHex.length) return false
  let diff = 0
  for (let i = 0; i < aHex.length; i++) {
    diff |= aHex.charCodeAt(i) ^ bHex.charCodeAt(i)
  }
  return diff === 0
}

// Generate random salt
function createSalt() {
  const arr = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Form submit
async function handleSubmit() {
  loading.value = true
  try {
    error.value = ''
    const id = uid.value.trim()

    if (!getAllowedUids().includes(id)) {
      error.value = '用户不存在'
      return
    }

    // brute-force lock
    let fails = Number(sessionStorage.getItem(failKey.value) || 0)
    if (fails >= MAX_FAIL) {
      error.value = '尝试过多，请稍后再试'
      return
    }

    const pwd = password.value
    const cred = storedCred.value

    // first login
    if (!cred) {
      if (pwd.length < 4) {
        error.value = '密码长度至少4位'
        return
      }
      const salt = createSalt()
      const hash = await pbkdf2Hash(pwd, salt)
      localStorage.setItem(credKey.value, JSON.stringify({ hash, salt, iter: 100000 }))
      tick.value++
    } else {
      const { hash, salt, iter = 100000 } = cred
      const calc = await pbkdf2Hash(pwd, salt, iter)
      if (!equalTiming(calc, hash)) {
        sessionStorage.setItem(failKey.value, ++fails)
        error.value = '密码不正确，请重试'
        return
      }
      sessionStorage.removeItem(failKey.value)
    }

    // save current user to sessionStorage
    sessionStorage.setItem('currentUser', id)
    emit('login-success', id)

    // clear plaintext
    password.value = ''

    submitTimeout = setTimeout(() => {
      loginForm.value?.submit?.()
    }, 100)
  } catch (err) {
    console.error('登录异常：', err)
    error.value = '系统错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// Reset state when modal opens
watch(visible, v => {
  if (v) {
    uid.value = ''
    password.value = ''
    error.value = ''
    loading.value = false
    tick.value++
  }
})

// Clean up
onBeforeUnmount(() => {
  if (submitTimeout) clearTimeout(submitTimeout)
})
</script>

<style scoped>
/* 模态遮罩 & 居中 */
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  z-index: 1000;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 登录框 */
.login-box {
  width: 90%;
  max-width: 360px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

/* 标题与表单项 */
.login-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}
.form-group {
  margin-bottom: 16px;
}
input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}
input:focus {
  outline: none;
  border-color: var(--primary);
}
.error-msg {
  color: #e00;
  font-size: 13px;
  margin-bottom: 12px;
  text-align: left;
}

/* 按钮 */
.btn-publish {
  width: 100%;
  height: 48px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.1s;
}
.btn-publish:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-publish:not(:disabled):hover {
  transform: translateY(-1px);
}

/* 大屏（PC）优化 */
@media (min-width: 768px) {
  .login-box {
    max-width: 400px;
    padding: 32px;
  }
  input {
    height: 48px;
    font-size: 15px;
  }
  .btn-publish {
    height: 52px;
    font-size: 16px;
  }
}

/* 小屏（移动端）微调 */
@media (max-width: 480px) {
  .login-box {
    padding: 16px;
  }
  input {
    height: 42px;
    font-size: 13px;
  }
  .btn-publish {
    height: 44px;
    font-size: 14px;
  }
}
</style>
