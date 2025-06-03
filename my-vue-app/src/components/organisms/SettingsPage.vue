<template>
  <div class="yt-settings-page">
    <SettingsPanel
      v-model:theme="theme"
      v-model:bgSrc="bgSrc"
      v-model:bgOpacity="bgOpacity"
      v-model:bgBlur="bgBlur"
      v-model:imageInsertMode="imageInsertMode"
      v-model:llmEnabled="llmEnabled"
      v-model:localDisplayName="displayName"
      :allowedUids="allowedUids"
      :currentUser="currentUser"
      :adminUid="ADMIN_UID"
      @openPassword="openPasswordModal"
      @openBadge="openBadgeModal"
    />
  </div>
</template>

<script setup>
import SettingsPanel from '@/components/organisms/SettingsPanel.vue'
import { useUserStore } from '@/stores/user'
import { pbkdf2Hash } from '@/utils/crypto'
import { computed, ref, watch } from 'vue'

// —— 常量 —— //
const ADMIN_UID = '217122260'

// —— Pinia：拿当前登录用户 —— //
const userStore   = useUserStore()
const currentUser = computed(() => userStore.currentUser)

// —— “本地显示名称（昵称）” —— //
const displayName = ref(
  localStorage.getItem('displayName_' + (currentUser.value || '')) || ''
)

// —— 其它状态（与 SettingsPanel 双向绑定） —— //
const theme           = ref(localStorage.getItem('theme') || 'dark')
const bgSrc           = ref(localStorage.getItem('bgSrc') || '')
const bgOpacity       = ref(parseFloat(localStorage.getItem('bgOpacity') || '0.35'))
const bgBlur          = ref(parseInt(localStorage.getItem('bgBlur') || '4', 10))
const imageInsertMode = ref(localStorage.getItem('imageInsertMode') || 'preview')
const llmEnabled      = ref(JSON.parse(localStorage.getItem('llmEnabled') || 'true'))
const allowedUids     = ref(JSON.parse(localStorage.getItem('cm_allowedUids') || '[]'))

// —— 同步 localStorage —— //
watch(theme, val => {
  document.body.classList.toggle('dark', val === 'dark')
  localStorage.setItem('theme', val)
}, { immediate: true })

watch(bgSrc, val => localStorage.setItem('bgSrc', val))
watch(bgOpacity, val => localStorage.setItem('bgOpacity', val.toString()))
watch(bgBlur, val => localStorage.setItem('bgBlur', val.toString()))
watch(imageInsertMode, val => localStorage.setItem('imageInsertMode', val))
watch(llmEnabled, val => localStorage.setItem('llmEnabled', JSON.stringify(val)))
watch(displayName, val => {
  if (currentUser.value) {
    localStorage.setItem('displayName_' + currentUser.value, val.trim())
    userStore.setDisplayName(currentUser.value, val.trim())
  }
})
watch(allowedUids, val => {
  localStorage.setItem('cm_allowedUids', JSON.stringify(val))
}, { deep: true })

// —— 方法：传给 SettingsPanel 的两个事件 —— //
async function openPasswordModal() {
  if (!currentUser.value) {
    alert('请先登录')
    return
  }
  const uid = currentUser.value
  const credKey = `cred_${uid}`
  const raw = localStorage.getItem(credKey)
  if (!raw) return alert('尚未设置密码')

  const { hash: storedHash, salt, iter } = JSON.parse(raw)
  const oldPwd = prompt('请输入旧密码：')
  if (!oldPwd) return
  const oldHash = await pbkdf2Hash(oldPwd, salt, iter)
  if (oldHash !== storedHash) return alert('旧密码不正确')

  const newPwd = prompt('请输入新密码（≥4 位）：')
  if (!newPwd || newPwd.length < 4) return alert('长度不足 4 位')
  const confirmPwd = prompt('请再次输入新密码：')
  if (confirmPwd !== newPwd) return alert('两次输入不一致')

  const newHash = await pbkdf2Hash(newPwd, salt, iter)
  localStorage.setItem(credKey, JSON.stringify({ hash: newHash, salt, iter }))
  alert('密码修改成功')
}

function openBadgeModal() {
  const BADGES = [
    { id: 'none',    name: '不佩戴'     },
    { id: 'best',    name: '最好的大佬' },
    { id: 'catgirl', name: '你才是猫娘' }
  ]
  const ids = BADGES.map(b => `${b.id}:${b.name}`).join('\n')
  const ans = prompt(`请输入要佩戴的勋章 ID：\n${ids}`, '')
  if (!ans) return
  if (!BADGES.some(b => b.id === ans)) return alert('无效勋章 ID')
  localStorage.setItem(`wear_${currentUser.value}`, ans)
  userStore.setBadge(currentUser.value, ans)
  alert(`已设置勋章为 ${ans}`)
}
</script>

<style scoped>
.yt-settings-page {
  min-height: 100vh;
  background: #0f0f0f;
  color: #e0e0e0;
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
</style>
