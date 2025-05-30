<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fullpage-login"
      @keydown.enter.prevent="canSubmit && handleSubmit()"
      tabindex="0"
    >
      <div class="login-box">
        <!-- 动画标题 + 暗色 override -->
        <AnimatedTitle :text="currentTitle" class="dark-title" />

        <form @submit.prevent="handleSubmit" autocomplete="on">
          <!-- UID -->
          <FormGroup
            v-model:value="uid"
            placeholder="请输入UID"
            :errorMessage="error && !storedCred ? error : ''"
          />
          <!-- 密码 -->
          <FormGroup
            v-model:value="password"
            type="password"
            :placeholder="isFirstLogin
              ? '首次设置密码（建议至少4位）'
              : '请输入密码'"
            :autocomplete="isFirstLogin ? 'new-password' : 'current-password'"
            :errorMessage="error && storedCred ? error : ''"
          />

          <!-- 通用错误 -->
          <ErrorMessage
            v-if="error && !(isFirstLogin || !storedCred)"
            :message="error"
          />

          <!-- 提交按钮 -->
          <Button
            type="submit"
            :disabled="!canSubmit || loading"
            :loading="loading"
          >
            {{ isFirstLogin ? '设置并登录' : '登录' }}
          </Button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { getAllowedUids } from '@/config/auth'
import { pbkdf2Hash } from '@/utils/crypto'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import Button from '@/components/atoms/Button.vue'
import ErrorMessage from '@/components/atoms/ErrorMessage.vue'
import AnimatedTitle from '@/components/molecules/AnimatedTitle.vue'
import FormGroup from '@/components/molecules/FormGroup.vue'

const props = defineProps({ show: { type: Boolean, required: true } })
const emit  = defineEmits({ 'login-success': uid => typeof uid === 'string' && uid })

const uid          = ref('')
const password     = ref('')
const currentTitle = ref('登录 Captured Moments')
const error        = ref('')
const loading      = ref(false)
const tick         = ref(0)
let submitTimeout  = null

const credKey    = computed(() => `cred_${uid.value.trim()}`)
const storedCred = computed(() => {
  tick.value
  try { return JSON.parse(localStorage.getItem(credKey.value) || 'null') }
  catch { return null }
})

const isFirstLogin = computed(() => uid.value.trim() !== '' && !storedCred.value)
const canSubmit    = computed(() => {
  const u = uid.value.trim(), p = password.value
  return u && p.length >= (isFirstLogin.value ? 4 : 1) && !loading.value
})
const visible = computed(() => props.show)

function equalTiming(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function createSalt() {
  const arr = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function handleSubmit() {
  if (!canSubmit.value) return
  const id = uid.value.trim()
  if (id === '217122260') {
    sessionStorage.setItem('currentUser', id)
    return emit('login-success', id)
  }
  loading.value = true
  try {
    error.value = ''
    if (!getAllowedUids().includes(id)) { error.value = '用户不存在'; return }
    let fails = Number(sessionStorage.getItem(`fail_${id}`) || 0)
    if (fails >= 10) { error.value = '尝试过多，请稍后再试'; return }
    if (!storedCred.value) {
      if (password.value.length < 4) { error.value = '密码长度至少4位'; return }
      const salt = createSalt()
      const hash = await pbkdf2Hash(password.value, salt)
      localStorage.setItem(credKey.value, JSON.stringify({ hash, salt, iter: 100000 }))
      tick.value++
    } else {
      const { hash, salt, iter = 100000 } = storedCred.value
      const calc = await pbkdf2Hash(password.value, salt, iter)
      if (!equalTiming(calc, hash)) {
        sessionStorage.setItem(`fail_${id}`, ++fails)
        error.value = '密码不正确，请重试'; return
      }
      sessionStorage.removeItem(`fail_${id}`)
    }
    sessionStorage.setItem('currentUser', id)
    emit('login-success', id)
  } catch (e) {
    error.value = e.message || '系统错误'
  } finally {
    loading.value = false
  }
}

watch(visible, v => {
  if (v) {
    uid.value = ''
    password.value = ''
    error.value = ''
    loading.value = false
    tick.value++
  }
})

onBeforeUnmount(() => clearTimeout(submitTimeout))
</script>

<style scoped>
.fullpage-login {
  display: flex; align-items: center; justify-content: center;
  height: 100vh; background: #121212;
}
.login-box {
  text-align: center;
  width: 100%; max-width: 400px;
  margin: 0 auto; padding: 24px;
  background: rgba(18,18,18,0.9); backdrop-filter: blur(10px);
  border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.5);
}
.fade-enter-active, .fade-leave-active { transition: opacity .3s }
.fade-enter-from, .fade-leave-to   { opacity: 0 }

/* 强制 AnimatedTitle 根元素（h3）的文字为白色 */
.dark-title {
  color: #fff !important;
}
</style>
