<!-- src/components/molecules/AdminControls.vue -->
<template>
  <div class="admin-controls">
    <!-- 重置密码 -->
    <GhostBtn @click="$emit('reset-password', uid)">
      重置密码
    </GhostBtn>

    <!-- 移除白名单 -->
    <GhostBtn @click="$emit('remove-allowed-uid', uid)">
      移除白名单
    </GhostBtn>

    <!-- 设定管理员密码 -->
    <GhostBtn @click="$emit('open-admin-pwd-modal', uid)">
      设定密码
    </GhostBtn>
  </div>
</template>

<script>
import GhostBtn from '@/components/atoms/GhostBtn.vue';

export default {
  name: 'AdminControls',
  components: { GhostBtn },
  props: {
    // 传入当前这一行对应的 UID（字符串或数字）
    uid: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style scoped>
.admin-controls {
  display: flex;
  gap: 8px;
}

/* 
  下面是假设 GhostBtn 这个 Atom 的样式。 
  如果你实际的 GhostBtn.vue 已经定义了 .ghost-btn 类或者其他样式，则可以省略这里对应样式部分。 
  这里只做一个示例： 
*/
.ghost-btn {
  background: rgba(45, 45, 45, 0.7);
  color: #e0e0e0;
  border: 1px solid #444;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-size: 14px;
}
.ghost-btn:hover {
  background: rgba(70, 70, 70, 0.8);
  color: #fff;
}
</style>
