<!-- src/components/SettingsPanel.vue -->
<template>
  <section id="settings" :class="['settings-container', { mobile: isMobile }]">
    <!-- ====================== 📱 Mobile ====================== -->
    <template v-if="isMobile">
      <!-- ▶ 主导航列表 -->
      <div v-if="activeSection === null" class="mobile-nav">
        <ul class="nav-list">
          <li @click="toggleSection('visual')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M2.5 21.5l2-2 4-4L6 15l-4 4v2.5h2.5z" />
              <path d="M6 15l9-9 3 3-9 9" />
              <path d="M14.5 5.5l3.5-3.5 3 3-3.5 3.5" />
            </svg>
            <span>视觉／界面</span>
          </li>
          <li @click="toggleSection('profile')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              <path d="M4 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2" />
            </svg>
            <span>个人资料</span>
          </li>
          <li @click="toggleSection('assistant')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z" />
            </svg>
            <span>交互助手</span>
          </li>
          <li @click="toggleSection('publish')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 10l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span>发布与上传</span>
          </li>
          <li v-if="isAdmin" @click="toggleSection('admin')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M9.4 11c.2-.7.6-1.4 1.1-2.1 1-1.4 2.5-2.4 4.2-2.8M12 2a10 10 0 1 0 10 10c0-2-.6-3.9-1.7-5.5" />
            </svg>
            <span>管理员</span>
          </li>
        </ul>
      </div>

      <!-- ▶ 详情页 -->
      <div v-else class="mobile-detail">
        <header class="detail-header">
          <button class="back-btn" @click="activeSection = null">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>


          <h2 class="detail-title">{{ sectionTitleMap[activeSection] }}</h2>
        </header>
        <section class="settings-content">
          <!-- ↓↓ 原有各分组内容 ↓↓ -->
          <!-- 视觉／界面 -->
          <ul v-show="activeSection === 'visual'" class="settings-group setting-group-card">
            <li class="setting-item">
              <span>主题模式</span>
              <button class="btn-ghost" disabled title="已锁定为深色模式"@click="toggleTheme">
                <svg v-if="theme === 'light'" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
                </svg>
              </button>
            </li>
            <li class="setting-item">
              <span>背景设置</span>
              <button class="btn-ghost" @click="showBgModal = true">打开</button>
            </li>
            <li class="setting-item">
              <span>自动加载</span>
              <input type="checkbox" :checked="loadMode === 'auto'" @change="saveLoadModeSwitch($event)" />
            </li>
          </ul>

          <!-- 个人资料 -->
          <ul v-show="activeSection === 'profile'" class="settings-group setting-group-card">
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
          <ul v-show="activeSection === 'assistant'" class="settings-group setting-group-card">
            <li class="setting-item">
              <span>桌宠</span>
              <input type="checkbox" :checked="petEnabled"
                @change="$emit('update:petEnabled', $event.target.checked)" />
            </li>
            <li class="setting-item">
              <span>AI</span>
              <input type="checkbox" :checked="llmEnabled"
                @change="$emit('update:llmEnabled', $event.target.checked)" />
            </li>
          </ul>

          <!-- 发布与上传 -->
          <ul v-show="activeSection === 'publish'" class="settings-group setting-group-card">
            <li class="setting-item">
              <span>图片嵌入正文</span>
              <input type="checkbox" :checked="imageInsertMode === 'inline'"
                @change="saveImageInsertModeSwitch($event)" />
            </li>
          </ul>

          <!-- 管理员：账户管理 -->
          <ul v-show="activeSection === 'admin' && isAdmin" class="settings-group setting-group-card">
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
      </div>
    </template>

    <!-- ====================== 💻 Desktop ====================== -->
    <template v-else>
      <!-- ▶ 左侧导航 -->
      <aside class="settings-nav">
        <ul class="nav-list">
          <li :class="{ active: activeSection === 'visual' }" @click="toggleSection('visual')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M2.5 21.5l2-2 4-4L6 15l-4 4v2.5h2.5z" />
              <path d="M6 15l9-9 3 3-9 9" />
              <path d="M14.5 5.5l3.5-3.5 3 3-3.5 3.5" />
            </svg>
            <span>视觉／界面</span>
          </li>
          <li :class="{ active: activeSection === 'profile' }" @click="toggleSection('profile')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              <path d="M4 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2" />
            </svg>
            <span>个人资料</span>
          </li>
          <li :class="{ active: activeSection === 'assistant' }" @click="toggleSection('assistant')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z" />
            </svg>
            <span>交互助手</span>
          </li>
          <li :class="{ active: activeSection === 'publish' }" @click="toggleSection('publish')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 10l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span>发布与上传</span>
          </li>
          <li v-if="isAdmin" :class="{ active: activeSection === 'admin' }" @click="toggleSection('admin')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M9.4 11c.2-.7.6-1.4 1.1-2.1 1-1.4 2.5-2.4 4.2-2.8M12 2a10 10 0 1 0 10 10c0-2-.6-3.9-1.7-5.5" />
            </svg>
            <span>管理员</span>
          </li>
        </ul>
      </aside>

      <!-- ▶ 右侧内容 -->
      <section class="settings-content">
        <!-- ↓↓ 原有各分组内容（与移动端复用） ↓↓ -->
        <!-- 视觉／界面 -->
        <ul v-show="activeSection === 'visual'" class="settings-group">
          <li class="setting-item">
            <span>主题模式</span>
            <button class="btn-ghost" disabled title="已锁定为深色模式"@click="toggleTheme">
              <svg v-if="theme === 'light'" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
              </svg>
            </button>
          </li>

          <li class="setting-item">
            <span>背景设置</span>
            <button class="btn-ghost" @click="showBgModal = true">打开</button>
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
            <input type="checkbox" :checked="imageInsertMode === 'inline'"
              @change="saveImageInsertModeSwitch($event)" />
          </li>
        </ul>

        <!-- 管理员：账户管理 -->
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

        <!-- 管理员：安全监控 -->
        <div v-show="activeSection === 'admin' && isAdmin" class="settings-group admin-monitor">
          <h3 class="group-title">安全监控</h3>
          <AdminPanel />
        </div>
      </section>
    </template>

    <!-- ===== 昵称修改弹窗 ===== -->
    <Teleport to="body">
      <div v-if="showRenameModal" class="modal show" @click.self="showRenameModal = false">
        <div class="box" style="min-width:360px; max-width:480px;">
          <span class="close" @click="showRenameModal = false">×</span>
          <h3 style="margin-bottom:16px;">修改昵称</h3>
          <div style="margin-bottom:24px;">
            <input v-model="renameDraft" placeholder="输入新的昵称"
              style="width:100%; padding:8px; border:var(--glass-border); border-radius:4px;" />
          </div>
          <div style="text-align:right; gap:8px; display:flex; justify-content:flex-end;">
            <button class="btn-ghost" @click="showRenameModal = false">取消</button>
            <button class="btn-publish" @click="confirmRename">确定</button>
          </div>
        </div>
      </div>
    </Teleport>
    <BaseModal v-model="showBgModal" title="背景设置" maxWidth="480px">
      <!-- 正文内容不变 -->
      <ul class="setting-list">
        <li class="setting-item">
          <span>上传背景</span>
          <label class="btn-ghost upload-btn">
            上传图片
            <input type="file" accept="image/*" @change="onBgUpload" />
          </label>
        </li>
        <li class="setting-item">
          <span>背景透明度</span>
          <input type="range" min="0" max="1" step="0.05" v-model.number="draftOpacity" />
        </li>
        <li class="setting-item">
          <span>背景模糊</span>
          <input type="range" min="0" max="20" step="1" v-model.number="draftBlur" />
        </li>
        <!-- 新增：清除背景 -->
        <li class="setting-item">
          <span>清除背景</span>
          <button type="button" class="btn-ghost" @click="clearBg()">清除背景</button>
        </li>
      </ul>

      <!-- 底部按钮，拿到 close() 直接关模态 —— 工业常见 pattern -->
      <template #footer="{ close }">
        <button type="button" class="btn-ghost" @click="cancelBg()">取消</button>
        <button type="button" class="btn-publish" @click="confirmBg()">完成</button>
      </template>
    </BaseModal>

  </section>
</template>

<script>
import BaseModal from '@/components/BaseModal.vue'

export default {
  name: 'SettingsPanel',
  components: { BaseModal },

  emits: [
    'update:theme', 'update:bgSrc', 'update:bgOpacity', 'update:bgBlur',
    'update:loadMode', 'update:imageInsertMode',
    'update:petEnabled', 'update:llmEnabled', 'update:localDisplayName',
    'open-password-modal', 'open-badge-modal',
    'reset-password', 'add-allowed-uid', 'remove-allowed-uid', 'open-admin-pwd-modal'
  ],
  props: {
    theme: String,
    bgOpacity: Number,
    bgBlur: Number,
    loadMode: String,
    imageInsertMode: String,
    petEnabled: Boolean,
    llmEnabled: Boolean,
    localDisplayName: String,
    allowedUids: Array,
    currentUser: [String, Number],
    adminUid: [String, Number]
  },
  data() {
    return {
      activeSection: 'visual',        // desktop 默认直接进入视觉设置
      isMobile: false,               // 响应式判定
      newAdminUid: '',
      showRenameModal: false,
      renameDraft: this.localDisplayName || '',
      showBgModal: false,
      origBgSrc: this.bgSrc,
      origOpacity: this.bgOpacity,
      origBlur: this.bgBlur,
      draftBgSrc: this.bgSrc,
      draftOpacity: this.bgOpacity,
      draftBlur: this.bgBlur,
    }
  },
  computed: {
    isAdmin() {
      return String(this.currentUser) === String(this.adminUid)
    },
    sectionTitleMap() {
      return {
        visual: '视觉／界面',
        profile: '个人资料',
        assistant: '交互助手',
        publish: '发布与上传',
        admin: '管理员'
      }
    },
    proxyBgOpacity: {
      get() { return this.bgOpacity },
      set(v) { this.$emit('update:bgOpacity', v) }
    },
    proxyBgBlur: {
      get() { return this.bgBlur },
      set(v) { this.$emit('update:bgBlur', v) }
    }
  },
  created() {
    this.updateMobile()
    if (this.isMobile) this.activeSection = null
  },
  mounted() {
    window.addEventListener('resize', this.updateMobile, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateMobile)
  },
  watch: {
    showBgModal(val) {
      if (val) {
        this.origBgSrc = this.bgSrc
        this.origOpacity = this.bgOpacity
        this.origBlur = this.bgBlur
        this.draftBgSrc = this.bgSrc
        this.draftOpacity = this.bgOpacity
        this.draftBlur = this.bgBlur
      }
    },
    draftBgSrc(val) {
      if (this.showBgModal) this.$emit('update:bgSrc', val)
    },
    draftOpacity(val) {
      if (this.showBgModal) this.$emit('update:bgOpacity', val)
    },
    draftBlur(val) {
      if (this.showBgModal) this.$emit('update:bgBlur', val)
    }
  },

  methods: {
    onBgUpload(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => {
        this.draftBgSrc = ev.target.result
      }
      reader.readAsDataURL(file)
    },
    clearBg() {
      // 一键清空并实时预览
      this.$emit('update:bgSrc', '');
      this.$emit('update:bgOpacity', 1);
      this.$emit('update:bgBlur', 0);
      // 更新草稿，保证后续取消/完成逻辑正常
      this.draftBgSrc = '';
      this.draftOpacity = 1;
      this.draftBlur = 0;
    },

    cancelBg() {
      this.$emit('update:bgSrc', this.origBgSrc)
      this.$emit('update:bgOpacity', this.origOpacity)
      this.$emit('update:bgBlur', this.origBlur)
      this.showBgModal = false
    },

    confirmBg() {
      this.showBgModal = false
    },


    updateMobile() {
      this.isMobile = window.innerWidth < 768
    },
    toggleSection(k) { this.activeSection = k },
    // toggleTheme() { this.$emit('update:theme', this.theme === 'light' ? 'dark' : 'light') },
    changeBackground(e) {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = ev => this.$emit('update:bgSrc', ev.target.result);
      r.readAsDataURL(f)
    },
    saveLoadModeSwitch(e) { this.$emit('update:loadMode', e.target.checked ? 'auto' : 'manual') },
    saveImageInsertModeSwitch(e) { this.$emit('update:imageInsertMode', e.target.checked ? 'inline' : 'preview') },
    confirmRename() {
      this.$emit('update:localDisplayName', this.renameDraft.trim());
      this.showRenameModal = false;
    }
  }
}
</script>

<style scoped>
/* ===== 基础 ===== */
.settings-container {
  display: flex;
  gap: 24px;
  padding: 40px 16px;
  max-width: 1600px;
  margin: 0 auto;
  height: 80vh;
  box-sizing: border-box;
}

/* ===== 左侧导航（桌面） ===== */
.settings-nav {
  width: 140px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 8px;
  position: sticky;
  top: 40px;
  bottom: 40px;
  align-self: flex-start;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background .2s;
}

.nav-list li.active,
.nav-list li:hover {
  background: rgba(74, 144, 226, .1);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  stroke: currentColor;
  fill: none;
}

/* ===== 右侧内容（桌面） ===== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
  scrollbar-width: thin;
}

/* ===== 通用设置项 ===== */
.settings-group {
  list-style: none;
  padding: 0;
  margin: 0;
}

.setting-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 32px;
  margin: 24px 0;
  padding: 0 24px;
}

.setting-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-ghost,
.btn-publish,
.rename-input {
  padding: 6px 12px;
  border-radius: 4px;
}

.btn-ghost {
  background: #fff;
  border: 1px solid #ccc;
}

.btn-publish {
  background: var(--primary);
  color: #fff;
  border: none;
}

/* ===== 管理员监控面板 ===== */
.admin-monitor {
  padding: 0 24px;
}

.group-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 24px 0 8px;
}

/* ===== 📱 Mobile specific ===== */
.settings-container.mobile {
  flex-direction: column;
  padding: 0;
  height: auto;
  background: var(--detail-bg);
}

.mobile-nav {
  padding: 24px 16px;
}

.mobile-nav .nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-detail .detail-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--accent-bg);
  color: var(--accent-fg);
}

.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-title {
  font-size: 1rem;
  font-weight: 600;
}

.setting-group-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  box-shadow: var(--glass-shadow, 0 1px 4px rgba(0, 0, 0, .08));
}

@media (max-width: 767px) {
  .setting-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* 1. 让 detail header 和 back-btn 都用主题文字色 */
.mobile-detail .detail-header {
  background: var(--accent-bg);
  color: var(--text-color);
  /* ← 从 accent-fg 改为 text-color */
}

/* 2. 确保 back-btn SVG 也跟文字用同一 currentColor */
.mobile-detail .back-btn {
  color: inherit;
  /* 继承上面设置的 --text-color */
}

/* （可选）如果你希望 .mobile-nav 的列表也显式用同一变量：
   其实默认会继承根节点 color，但声明一下更保险 */
.mobile-nav .nav-list li {
  color: var(--text-color);
}

.mobile-nav .nav-list li .nav-icon {
  stroke: currentColor;
}
</style>
