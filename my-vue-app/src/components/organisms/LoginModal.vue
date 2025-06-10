<!-- src/components/organisms/LoginModal.vue -->
<template>
  <transition name="fade">
    <div v-if="show" class="fullpage-login" tabindex="0" @keyup.enter="canSubmit && handleSubmit()">
      <div class="login-box">
        <!-- 动画标题（白色覆写见 style） -->
        <AnimatedTitle :text="currentTitle" class="dark-title" />

        <form @submit.prevent="handleSubmit" autocomplete="on">
          <!-- UID -->
          <FormGroup v-model:value="uid" placeholder="请输入 UID" :error-message="error && !storedCred ? error : ''" />

          <!-- 密码 -->
          <FormGroup v-model:value="password" type="password" :placeholder="isFirstLogin
            ? '首次设置密码（建议至少 4 位）'
            : '请输入密码'" :autocomplete="isFirstLogin ? 'new-password' : 'current-password'"
            :error-message="error && storedCred ? error : ''" />

          <!-- 通用错误 -->
          <ErrorMessage v-if="showGeneralErr" :message="error" />

          <!-- 提交按钮 -->
          <Button type="submit" :disabled="!canSubmit" :loading="loading">
            {{ isFirstLogin ? '设置并登录' : '登录' }}
          </Button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
/* ────── imports ────── */
import { getAllowedUids } from '@/config/auth'
import { pbkdf2Hash } from '@/utils/crypto'
import { computed, ref, watch } from 'vue'

import ErrorMessage from '@/components/atoms/ErrorMessage.vue'
import Button from '@/components/atoms/SubmitButton.vue'
import AnimatedTitle from '@/components/molecules/AnimatedTitle.vue'
import FormGroup from '@/components/molecules/FormGroup.vue'

/* ────── props / emits ────── */
const props = defineProps({ show: Boolean })
const emit = defineEmits(['login-success'])

/* ────── state ────── */
const uid = ref('')
const password = ref('')
const currentTitle = ref('登录 Captured Moments')
const error = ref('')
const loading = ref(false)
const bump = ref(0)         // 手动触发 storedCred 的重新计算

/* ────── 计算属性 ────── */
const credKey = computed(() => `cred_${uid.value.trim()}`)
const storedCred = computed(() => { bump.value; return safeJSON(localStorage.getItem(credKey.value)) })
const isFirstLogin = computed(() => uid.value.trim() !== '' && !storedCred.value)
const canSubmit = computed(() => {
  const u = uid.value.trim()
  const p = password.value
  return !!u && p.length >= (isFirstLogin.value ? 4 : 1) && !loading.value
})
const showGeneralErr = computed(() =>
  error.value && !(isFirstLogin.value || !storedCred.value)
)

/* ────── methods ────── */
function safeJSON(raw) {
  try { return JSON.parse(raw || 'null') }
  catch { return null }
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function createSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map(b => b.toString(16).padStart(2, '0')).join('')
}

async function handleSubmit() {
  if (!canSubmit.value) return
  const id = uid.value.trim()
  loading.value = true
  error.value = ''

  try {
    /* 1️⃣ 账号合法性 */
    const allowed = getAllowedUids()
    if (!allowed.includes(id)) { throw new Error('用户不存在') }

    /* 2️⃣ 首次 / 已注册两种流程 */
    if (!storedCred.value) {
      // —— 第一次：长度检查 + 写入 localStorage ——  
      if (password.value.length < 4) throw new Error('密码至少 4 位')
      const salt = createSalt()
      const hash = await pbkdf2Hash(password.value, salt)
      localStorage.setItem(
        credKey.value,
        JSON.stringify({ hash, salt, iter: 100_000 })
      )
      bump.value++                               // ⬅️ 立刻触发 storedCred 更新
    } else {
      // —— 已注册：计算 PBKDF2 再对比 ——  
      const { hash, salt, iter = 100_000 } = storedCred.value
      const calc = await pbkdf2Hash(password.value, salt, iter)
      if (!timingSafeEqual(calc, hash)) throw new Error('密码不正确，请重试')
    }

    /* 3️⃣ 成功 → 写 session + emit */
    sessionStorage.setItem('currentUser', id)
    error.value = ''
    emit('login-success', id)
  } catch (e) {
    error.value = e.message || '系统错误'
  } finally {
    loading.value = false
  }
}

/* ────── watch ────── */
watch(() => props.show, v => {
  if (v) {                           // 打开时重置表单
    uid.value = ''
    password.value = ''
    error.value = ''
    loading.value = false
    bump.value++
  }
})
watch([uid, password], () => {
  if (error.value) error.value = ''                // 打开时重置错误
  error.value = ''
})
</script>

<style scoped>
.fullpage-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #121212;
}

.login-box {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
  background: rgba(18, 18, 18, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.55);
}

/* 进入/离开动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 覆写 AnimatedTitle 文字色 */
.dark-title {
  color: #fff !important;
}
</style>
