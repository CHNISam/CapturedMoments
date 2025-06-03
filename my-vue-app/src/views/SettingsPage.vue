<template>
  <!-- ⚠️ SettingsPanel 本身负责左右两栏的布局，直接塞进来即可 -->
  <SettingsPanel
    v-model:theme="theme"
    v-model:bgSrc="bgSrc"
    v-model:bgOpacity="bgOpacity"
    v-model:bgBlur="bgBlur"
    v-model:imageInsertMode="imageInsertMode"
    v-model:llmEnabled="llmEnabled"
    v-model:localDisplayName="displayName"
    v-model:selectedBadge="selectedBadge"
    :allowedBadges="BADGES"
    :allowedUids="allowedUids"
    :currentUser="currentUser"
    :adminUid="ADMIN_UID"
    @open-password-modal="openPasswordModal"
    @open-badge-modal="openBadgeModal"
    @reset-password="resetPassword"
    @add-allowed-uid="addAllowedUid"
    @remove-allowed-uid="removeAllowedUid"
    @open-admin-pwd-modal="openAdminPwdModal"
  />
</template>

<script setup>
import SettingsPanel from '@/components/organisms/SettingsPanel.vue'
import { useUserStore } from '@/stores/user'
import { pbkdf2Hash } from '@/utils/crypto'
import { computed, ref, watch } from 'vue'

// —— 常量 —— //
const ADMIN_UID = '217122260'
const BADGES = [
  { id: 'none',    name: '不佩戴'     },
  { id: 'best',    name: '最好的大佬' },
  { id: 'catgirl', name: '你才是猫娘' }
]

// —— Pinia：拿当前登录用户 —— //
const userStore   = useUserStore()
const currentUser = computed(() => userStore.currentUser)

// —— “本地显示名称（昵称）” —— //
const displayName = ref(
  localStorage.getItem('displayName_' + (currentUser.value || '')) || ''
)

// —— 其它 v-model 用到的状态 —— //
const theme           = ref(localStorage.getItem('theme') || 'dark')
const bgSrc           = ref(localStorage.getItem('bgSrc') || '')
const bgOpacity       = ref(parseFloat(localStorage.getItem('bgOpacity') || '0.35'))
const bgBlur          = ref(parseInt(localStorage.getItem('bgBlur') || '4', 10))
const imageInsertMode = ref(localStorage.getItem('imageInsertMode') || 'preview')
const llmEnabled      = ref(JSON.parse(localStorage.getItem('llmEnabled') || 'true'))
const selectedBadge   = ref(
  localStorage.getItem('wear_' + (currentUser.value || '')) || 'none'
)
const allowedUids = ref(
  JSON.parse(localStorage.getItem('cm_allowedUids') || '[]')
)
const newAdminUid = ref('')

// —— watch：在值变化时同步到 localStorage（以及 body.dark） —— //
watch(theme, (val) => {
  document.body.classList.toggle('dark', val === 'dark')
  localStorage.setItem('theme', val)
})
watch(bgSrc, (val) => {
  localStorage.setItem('bgSrc', val)
})
watch(bgOpacity, (val) => {
  localStorage.setItem('bgOpacity', val.toString())
})
watch(bgBlur, (val) => {
  localStorage.setItem('bgBlur', val.toString())
})
watch(imageInsertMode, (val) => {
  localStorage.setItem('imageInsertMode', val)
})
watch(llmEnabled, (val) => {
  localStorage.setItem('llmEnabled', JSON.stringify(val))
})
watch(displayName, (val) => {
  if (currentUser.value) {
    localStorage.setItem('displayName_' + currentUser.value, val.trim())
    // 如果 Pinia store 有相应 action，可以这样同步：
    userStore.setDisplayName(currentUser.value, val.trim())
  }
})
watch(selectedBadge, (val) => {
  if (currentUser.value) {
    localStorage.setItem('wear_' + currentUser.value, val)
    // 同步到 Pinia store（如果你有 action）
    userStore.setBadge(currentUser.value, val)
  }
})
watch(allowedUids, (val) => {
  localStorage.setItem('cm_allowedUids', JSON.stringify(val))
})

// —— 方法：对应 SettingsPanel 的各事件 —— //

async function openPasswordModal() {
  if (!currentUser.value) {
    alert('当前无登录用户，无法修改密码')
    return
  }
  const uid = currentUser.value
  const credKey = `cred_${uid}`
  const raw = localStorage.getItem(credKey)
  if (!raw) {
    alert('请先登录并设置密码')
    return
  }
  const oldPwd = window.prompt('请输入旧密码：')
  if (oldPwd === null) return // 用户取消
  const { hash: storedHash, salt, iter } = JSON.parse(raw)
  const oldHash = await pbkdf2Hash(oldPwd, salt, iter)
  if (oldHash !== storedHash) {
    alert('旧密码不正确！')
    return
  }
  const newPwd = window.prompt('请输入新密码（最少4位）：')
  if (newPwd === null) return
  if (newPwd.length < 4) {
    alert('新密码长度至少4位！')
    return
  }
  const confirmPwd = window.prompt('请再次输入新密码：')
  if (confirmPwd === null) return
  if (confirmPwd !== newPwd) {
    alert('两次输入的新密码不一致！')
    return
  }
  const newHash = await pbkdf2Hash(newPwd, salt, iter)
  localStorage.setItem(credKey, JSON.stringify({ hash: newHash, salt, iter }))
  alert('密码修改成功！')
}

function openBadgeModal() {
  const ids = BADGES.map((b) => b.id).join(' / ')
  const choice = window.prompt(`请输入要佩戴的勋章 ID（可选 ${ids}）：`, selectedBadge.value)
  if (choice === null) return
  if (!BADGES.some((b) => b.id === choice)) {
    alert('无效的勋章 ID')
    return
  }
  selectedBadge.value = choice
  alert(`已将勋章设置为：${choice}`)
}

// 管理员：重置某个 UID 的密码（清除本地存储中的密码）
function resetPassword(uid) {
  if (!isAdmin.value) {
    alert('只有管理员才能重置密码')
    return
  }
  if (!uid) return
  if (!window.confirm(`将清除 UID ${uid} 的本地密码，下次登录需重设？`)) return
  localStorage.removeItem(`cred_${uid}`)
  localStorage.removeItem(`salt_${uid}`)
  alert(`已清除 UID ${uid} 的本地密码`)
}

// 其他管理功能函数保持不变
// ...

</script>

<style scoped> 
/* 使用 Button 组件的样式 */
body.dark {
  background: #121212;  /* 主体背景改为极深灰 */
  color: #e0e0e0;       /* 主体文字改为浅灰 */
}

.yt-settings-page {
  min-height: 100vh;
  background: #0f0f0f; /* YouTube Studio 深灰 */
  color: #e0e0e0;
  padding: 24px 0;
  display: flex;
  justify-content: center; /* SettingsPanel 内部自带 max-width */
}

/* —— 按钮样式 —— */
.btn-atom {
  width:100%;
  height:48px;
  background: var(--btn-bg, #32414a);
  color: var(--btn-text, #ddd);
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: transform .1s;
}
.btn-atom:disabled {
  opacity: .6;
  cursor: not-allowed;
}
.btn-atom:not(:disabled):hover {
  transform: translateY(-1px);
  background: var(--btn-hover-bg, #2b3540);
}

</style>
