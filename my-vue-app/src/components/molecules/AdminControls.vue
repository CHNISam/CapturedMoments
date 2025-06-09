<!-- src/components/molecules/controls/AdminControls.vue -->
<template>
  <div class="admin-controls">
    <GhostBtn @click="$emit('resetPassword', uid)">重置密码</GhostBtn>
    <GhostBtn @click="$emit('removeAllowedUid', uid)">删除</GhostBtn>
    <GhostBtn @click="$emit('openAdminPwdModal', uid)">打开密码弹窗</GhostBtn>
  </div>
</template>

<script>
export default {
  name: 'AdminControls',
  props: {
    uid: { type: [String, Number], required: true }
  },
  emits: ['resetPassword', 'removeAllowedUid', 'openAdminPwdModal']
}
</script>

<style scoped>
.admin-controls {
  display: flex;
  gap: 8px;
}
</style>
