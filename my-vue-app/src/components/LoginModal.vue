<template>
  <transition name="fade">
    <div v-if="visible" class="modal show">
      <div class="box login-box">
        <AnimatedTitle :text="currentTitle" />

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
import AnimatedTitle from './AnimatedTitle.vue'

// Props & Emits
const props = defineProps({ show: Boolean })
const emit = defineEmits(['login-success'])

// Refs & state
const loginForm = ref(null)
const uid = ref('')
const currentTitle = ref('登录 Captured Moments')
const password = ref('')
const error = ref('')
const loading = ref(false)
const tick = ref(0)
let submitTimeout = null

// —— 新增 —— 是否整体锁定（true 时只有管理员解锁可登录）
const isLocked = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('auth_locked') || 'false')
  } catch {
    return true
  }
})

// Storage keys
const credKey = computed(() => `cred_${uid.value.trim()}`)
const failKey = computed(() => `fail_${uid.value.trim()}`)
const MAX_FAIL = 10

// Reactive read
const storedCred = computed(() => {
  tick.value
  try {
    return JSON.parse(localStorage.getItem(credKey.value) || 'null')
  } catch {
    console.warn('local credential parse error')
    return null
  }
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
  const id = uid.value.trim()

  // —— 新增 —— 锁定状态下仅 admin unlock 可登录
  if (isLocked.value) {
    if (id === '217122260' && password.value === 'unlock') {
      localStorage.setItem('auth_locked', 'false')
      sessionStorage.setItem('currentUser', id)
      emit('login-success', id)
      return
    }
    error.value = '系统已锁定，请联系管理员解锁'
    return
  }
  // —— end 新增 ——

  // 测试绕过（保留可选）
  if (id === '217122260') {
    sessionStorage.setItem('currentUser', id)
    emit('login-success', id)
    return
  }

  loading.value = true
  try {
    error.value = ''

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

    fadeOutThenType('欢迎回来！')
    setTimeout(() => {
      emit('login-success', id)
    }, 300 + 200 + '欢迎回来！'.length * 50 + 300)

    return

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
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  z-index: 1000;
}

/* 淡入淡出动画 */
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
  max-width: clamp(300px, 45%, 400px);
  padding: clamp(1rem, 4vw, 2rem);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 表单组 */
.form-group {
  margin-bottom: 1rem;
}

/* 输入框 */
input {
  width: 100%;
  height: clamp(2.5rem, 6vh, 3rem);
  padding: 0 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: var(--primary);
}

/* 错误提示 */
.error-msg {
  color: #e00;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  margin-bottom: 0.75rem;
  text-align: left;
}

/* 登录按钮 */
.btn-publish {
  width: 100%;
  height: clamp(2.75rem, 7vh, 3.5rem);
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: clamp(0.875rem, 2.5vw, 1.125rem);
  cursor: pointer;
  transition: transform 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-publish:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-publish:not(:disabled):hover {
  transform: translateY(-1px);
}

/* 大屏优化 */
@media (min-width: 768px) {
  .login-box {
    max-width: clamp(350px, 35%, 480px);
  }
}
</style>
