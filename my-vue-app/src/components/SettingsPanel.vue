<!-- src/components/SettingsPanel.vue -->
<template>
  <!-- 两栏布局：左侧导航，右侧内容 -->
  <section id="settings" class="settings-container">
    <!-- ============ 左侧导航 ============ -->
    <aside class="settings-nav">
      <ul class="nav-list">
        <li :class="{ active: activeSection === 'visual' }" @click="toggleSection('visual')">
          <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M2.5 21.5l2-2 4-4L6 15l-4 4v2.5h2.5z" />
            <path d="M6 15l9-9 3 3-9 9" />
            <path d="M14.5 5.5l3.5-3.5 3 3-3.5 3.5" />
          </svg><span>视觉／界面</span>
        </li>
        <li :class="{ active: activeSection === 'profile' }" @click="toggleSection('profile')">
          <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            <path d="M4 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2" />
          </svg><span>个人资料</span>
        </li>
        <li :class="{ active: activeSection === 'assistant' }" @click="toggleSection('assistant')">
          <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z" />
          </svg><span>交互助手</span>
        </li>
        <li :class="{ active: activeSection === 'publish' }" @click="toggleSection('publish')">
          <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 10l5-5m0 0l5 5m-5-5v12" />
          </svg><span>发布与上传</span>
        </li>
        <li v-if="isAdmin" :class="{ active: activeSection === 'admin' }" @click="toggleSection('admin')">
          <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg><span>管理员</span>
        </li>
      </ul>
    </aside>

    <!-- ============ 右侧内容 ============ -->
    <section class="settings-content">
      <!-- 视觉／界面 -->
      <ul v-show="activeSection === 'visual'" class="settings-group">
        <li class="setting-item">
          <span>主题模式</span>
          <input type="checkbox" :checked="theme === 'dark'" @change="toggleTheme" />
        </li>
        <li class="setting-item">
          <span>背景设置</span>
          <label class="btn-ghost upload-btn">
            上传背景 <input type="file" accept="image/*" @change="changeBackground" />
          </label>
        </li>
        <li class="setting-item">
          <span>背景透明度</span>
          <input type="range" min="0" max="1" step="0.05" v-model.number="proxyBgOpacity" />
        </li>
        <li class="setting-item">
          <span>背景模糊</span>
          <input type="range" min="0" max="20" step="1" v-model.number="proxyBgBlur" />
        </li>
        <li class="setting-item">
          <span>自动加载</span>
          <input type="checkbox" :checked="loadMode === 'auto'" @change="saveLoadModeSwitch($event)" />
        </li>
      </ul>

      <!-- 个人资料 -->
      <ul v-show="activeSection === 'profile'" class="settings-group">
        <li class="setting-item">
          <span>账号与安全</span>
          <button class="btn-ghost" @click="$emit('open-password-modal')">更改密码</button>
        </li>
        <li class="setting-item rename-item">
          <span>我的昵称</span>
          <button class="btn-ghost" @click="showRenameModal = true">{{ localDisplayName || '设置昵称' }}</button>
        </li>
        <li class="setting-item">
          <span>勋章中心</span>
          <button class="btn-ghost" @click="$emit('open-badge-modal')">更换勋章</button>
        </li>
      </ul>

      <!-- 交互助手 -->
      <ul v-show="activeSection === 'assistant'" class="settings-group">
        <li class="setting-item">
          <span>桌宠</span>
          <input type="checkbox" :checked="petEnabled" @change="$emit('update:petEnabled', $event.target.checked)" />
        </li>
        <li class="setting-item">
          <span>AI</span>
          <input type="checkbox" :checked="llmEnabled" @change="$emit('update:llmEnabled', $event.target.checked)" />
        </li>
      </ul>

      <!-- 发布与上传 -->
      <ul v-show="activeSection === 'publish'" class="settings-group">
        <li class="setting-item">
          <span>图片嵌入正文</span>
          <input type="checkbox" :checked="imageInsertMode === 'inline'" @change="saveImageInsertModeSwitch($event)" />
        </li>

      </ul>

      <!-- 管理员 -->
      <ul v-show="activeSection === 'admin' && isAdmin" class="settings-group">
        <li class="setting-item" v-for="uid in allowedUids" :key="uid">
          <span>{{ uid }}</span>
          <div class="btn-group">
            <button class="btn-ghost" @click="$emit('reset-password', uid)">重置密码</button>
            <button class="btn-ghost" @click="$emit('remove-allowed-uid', uid)">移除白名单</button>
            <button class="btn-ghost" @click="$emit('open-admin-pwd-modal', uid)">设定密码</button>
          </div>
        </li>
        <li class="setting-item">
          <input v-model="newAdminUid" placeholder="新 UID" class="rename-input" />
          <button class="btn-publish" @click="$emit('add-allowed-uid', newAdminUid)">新增</button>
        </li>
      </ul>
    </section>
    <!-- 昵称修改弹窗 -->
    <div v-if="showRenameModal" class="modal show" @click.self="showRenameModal = false">
      <div class="box" style="min-width:360px; max-width:480px;">
        <!-- 右上角关闭 -->
        <span class="close" @click="showRenameModal = false">×</span>
        <!-- 标题 -->
        <h3 style="margin-bottom:16px;">修改昵称</h3>
        <!-- 输入区域 -->
        <div style="margin-bottom:24px;">
          <input v-model="renameDraft" placeholder="输入新的昵称"
            style="width:100%; padding:8px; border:var(--glass-border); border-radius:4px;" />
        </div>
        <!-- 按钮 -->
        <div style="text-align:right; gap:8px; display:flex; justify-content:flex-end;">
          <button class="btn-ghost" @click="showRenameModal = false">取消</button>
          <button class="btn-publish" @click="confirmRename">确定</button>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'SettingsPanel',
  components: { },
  emits: [
    'update:theme', 'update:bgSrc', 'update:bgOpacity', 'update:bgBlur',
    'update:loadMode', 'update:imageInsertMode',
    'update:petEnabled', 'update:llmEnabled', 'update:localDisplayName',
    'open-password-modal', 'open-nickname-modal', 'open-badge-modal',
    'reset-password', 'add-allowed-uid', 'remove-allowed-uid', 'open-admin-pwd-modal'
  ],
  props: {
    theme: String, bgOpacity: Number, bgBlur: Number,
    loadMode: String, imageInsertMode: String,
    petEnabled: Boolean, llmEnabled: Boolean,
    localDisplayName: String,
    allowedUids: Array, currentUser: [String, Number], adminUid: [String, Number]
  },
  data() { return { activeSection: 'visual', newAdminUid: '', showRenameModal: false, renameDraft: this.localDisplayName || '', }; },
  computed: {
    isAdmin() { return String(this.currentUser) === String(this.adminUid); },
    proxyBgOpacity: {
      get() { return this.bgOpacity; },
      set(v) { this.$emit('update:bgOpacity', v); }
    },
    proxyBgBlur: {
      get() { return this.bgBlur; },
      set(v) { this.$emit('update:bgBlur', v); }
    }
  },
  methods: {
    toggleSection(k) { this.activeSection = k; },
    toggleTheme() { this.$emit('update:theme', this.theme === 'light' ? 'dark' : 'light'); },
    changeBackground(e) {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = ev => this.$emit('update:bgSrc', ev.target.result);
      r.readAsDataURL(f);
    },
    saveLoadMode(e) { this.$emit('update:loadMode', e.target.value); },
    saveLoadModeSwitch(e) {
      // 开：'auto'，关：'manual'
      this.$emit('update:loadMode', e.target.checked ? 'auto' : 'manual');
    },
    saveImageInsertModeSwitch(e) {
      // 选中 = inline，否则 preview
      this.$emit('update:imageInsertMode', e.target.checked ? 'inline' : 'preview');
    },
    confirmRename() {
      this.$emit('update:localDisplayName', this.renameDraft.trim());
      this.showRenameModal = false;
    },
  },
};
</script>

<style scoped>
/* ===== 布局基础 ===== */
.settings-container {
  display: flex;
  gap: 24px;
  padding: 40px 16px;
  max-width: 1600px;
  margin: 0 auto;
  height: 80vh;
  /* 保证固定高度，内部滚动 */
  box-sizing: border-box;
}

/* 左侧导航 ===== */
.settings-nav {
  width: 140px;
  background: rgba(0, 0, 0, 0.02);
  border-right: none;
  /* 更柔和 */
  border-radius: 8px;
  padding: 8px;
  position: sticky;
  /* 滚动时保持可见 */
  top: 40px;
  bottom: 40px;
  align-self: flex-start;
}

/* 右侧内容 ===== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  /* 独立滚动区域 */
  padding: 0 24px;
  scrollbar-width: thin;
  /* Firefox */
}

/* 通用设置项 ===== */
.setting-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  /* 固定标签宽度 */
  align-items: center;
  gap: 32px;
  /* 标签与控件间距 */
  margin: 24px 0;
  /* 行间距 */
  padding: 0 24px;
}

.setting-item span {
  white-space: nowrap;
  /* 标签文字不换行 */
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.setting-item:hover {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.setting-item .btn-ghost,
.setting-item .btn-publish,
.rename-input {
  width: 160px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 控件宽度限制 ===== */
.setting-item input[type="range"],
.setting-item select {
  width: 100%;
  max-width: 360px;
}

/* 分组标题 ===== */
.group-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 32px 0 16px;
}

.group-title+.settings-group {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

/* 分组列表 ===== */
.settings-group {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* 导航列表 ===== */
.nav-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-list li {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: background .2s;
}

.nav-list li:hover {
  background: rgba(0, 0, 0, 0.04);
}

.nav-list li.active {
  background: rgba(74, 144, 226, 0.08);
  color: inherit;
  font-weight: 600;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-right: 8px;
}

/* 按钮组与输入项 ===== */
.btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.rename-item input,
.rename-input {
  width: 160px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-ghost input[type="file"] {
  display: none;
}

.settings-container .btn-ghost,
.settings-container .btn-publish {
  display: inline-block;
  width: fit-content;
  padding: 6px 12px;
  min-width: 64px;
  text-align: center;
}

.settings-container .btn-group button {
  justify-self: start;
}
</style>