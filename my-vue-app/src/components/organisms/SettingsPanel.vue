<!-- src/components/organisms/SettingsPanel.vue -->
<template>
  <section id="settings" :class="['settings-container', { mobile: isMobile }]">
    <!-- ====================== 📱 Mobile ====================== -->
    <template v-if="isMobile">
      <!-- ▶ 主导航列表（Mobile） -->
      <div v-if="activeSection === null" class="mobile-nav">
        <ul class="nav-list mobile">
          <li
            class="nav-item"
            :class="{ active: activeSection === 'visual' }"
            @click="toggleSection('visual')"
          >
            <IconVisual class="nav-icon" />
            <span class="nav-label">视觉 / 界面</span>
            <svg
              class="chevron-icon"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              stroke-width="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </li>

          <li
            class="nav-item"
            :class="{ active: activeSection === 'profile' }"
            @click="toggleSection('profile')"
          >
            <IconProfile class="nav-icon" />
            <span class="nav-label">个人资料</span>
            <svg
              class="chevron-icon"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              stroke-width="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </li>

          <li
            class="nav-item"
            :class="{ active: activeSection === 'assistant' }"
            @click="toggleSection('assistant')"
          >
            <IconAssistant class="nav-icon" />
            <span class="nav-label">交互助手</span>
            <svg
              class="chevron-icon"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              stroke-width="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </li>

          <li
            class="nav-item"
            :class="{ active: activeSection === 'publish' }"
            @click="toggleSection('publish')"
          >
            <IconPublish class="nav-icon" />
            <span class="nav-label">发布 与 上传</span>
            <svg
              class="chevron-icon"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              stroke-width="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </li>

          <li
            v-if="isAdmin"
            class="nav-item"
            :class="{ active: activeSection === 'admin' }"
            @click="toggleSection('admin')"
          >
            <IconAdmin class="nav-icon" />
            <span class="nav-label">管理员</span>
            <svg
              class="chevron-icon"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              stroke-width="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </li>
        </ul>
      </div>

      <!-- ▶ Mobile → Detail (二级内容) -->
      <div v-else class="mobile-detail">
        <header class="detail-header">
          <!-- 返回按钮 -->
          <button class="back-btn" @click="activeSection = null" aria-label="返回">
            <svg
              class="icon-back"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              stroke-width="2.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <!-- 二级标题 -->
          <h2 class="detail-title">{{ sectionTitleMap[activeSection] }}</h2>

          <!-- 占位符：为了让标题始终水平居中 -->
          <span class="header-spacer"></span>
        </header>

        <section class="settings-content">
          <!-- —— “视觉 / 界面” 部分 —— -->
          <ul v-show="activeSection === 'visual'" class="settings-group setting-group-card">
            <li class="setting-item">
              <span>主题模式</span>
              <GhostBtn disabled title="已锁定为深色模式">
                <svg v-if="theme === 'light'" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
                </svg>
              </GhostBtn>
            </li>
            <li class="setting-item">
              <span>背景设置</span>
              <GhostBtn @click="showBgModal = true">打开</GhostBtn>
            </li>
          </ul>

          <!-- —— “个人资料” 部分 —— -->
          <ul v-show="activeSection === 'profile'" class="settings-group setting-group-card">
            <li class="setting-item">
              <span>账号 / 安全</span>
              <GhostBtn @click="$emit('open-password-modal')">更改密码</GhostBtn>
            </li>
            <li class="setting-item rename-item">
              <span>我的昵称</span>
              <GhostBtn @click="showRenameModal = true">{{ localDisplayName || '设置昵称' }}</GhostBtn>
            </li>
            <li class="setting-item">
              <span>头像：</span>
              <input type="file" accept="image/*" @change="onAvatarChange" />
              <!-- ★ 在显示头像前先做判空检查 -->
              <img
                v-if="userStore && userStore.avatarMap && userStore.avatarMap[currentUser]"
                :src="userStore.avatarMap[currentUser]"
                alt="头像预览"
                style="width: 60px; height: 60px; border-radius: 50%; margin-left: 8px;"
              />
            </li>
            <li class="setting-item">
              <span>勋章中心</span>
              <GhostBtn @click="$emit('open-badge-modal')">更换勋章</GhostBtn>
            </li>
          </ul>

          <!-- —— “交互助手” 部分 —— -->
          <ul v-show="activeSection === 'assistant'" class="settings-group setting-group-card">
            <li class="setting-item">
              <span>AI</span>
              <ToggleSwitch
                :modelValue="llmEnabled"
                @update:modelValue="$emit('update:llmEnabled', $event)"
              />
            </li>
          </ul>

          <!-- —— “发布 与 上传” 部分 —— -->
          <ul v-show="activeSection === 'publish'" class="settings-group setting-group-card">
            <li class="setting-item">
              <span>图片嵌入正文</span>
              <ToggleSwitch
                :modelValue="imageInsertMode === 'inline'"
                @update:modelValue="val => $emit('update:imageInsertMode', val ? 'inline' : 'preview')"
              />
            </li>
          </ul>

          <!-- —— “管理员” 部分 —— -->
          <ul v-show="activeSection === 'admin' && isAdmin" class="settings-group setting-group-card">
            <li class="setting-item" v-for="uid in allowedUids" :key="uid">
              <span>{{ uid }}</span>
              <AdminControls
                :uid="uid"
                @reset-password="uid => $emit('reset-password', uid)"
                @remove-allowed-uid="uid => $emit('remove-allowed-uid', uid)"
                @open-admin-pwd-modal="uid => $emit('open-admin-pwd-modal', uid)"
              />
            </li>
            <li class="setting-item">
              <input
                v-model="newAdminUid"
                placeholder="新 UID"
                class="rename-input"
                style="background: #1f1f1f; color: #e0e0e0; border: 1px solid #444; border-radius: 4px; padding: 6px 8px; width: 60%;"
              />
              <GhostBtn @click="emitAddUid">新增</GhostBtn>
            </li>
          </ul>
        </section>
      </div>
    </template>

    <!-- ====================== 💻 Desktop ====================== -->
    <template v-else>
      <!-- ▶ 左侧 Desktop 一级导航 -->
      <aside class="settings-nav">
        <ul class="nav-list">
          <li
            class="nav-item"
            :class="{ active: activeSection === 'visual' }"
            @click="toggleSection('visual')"
          >
            <IconVisual class="nav-icon" />
            <span class="nav-label">视觉 / 界面</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSection === 'profile' }"
            @click="toggleSection('profile')"
          >
            <IconProfile class="nav-icon" />
            <span class="nav-label">个人资料</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSection === 'assistant' }"
            @click="toggleSection('assistant')"
          >
            <IconAssistant class="nav-icon" />
            <span class="nav-label">交互助手</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSection === 'publish' }"
            @click="toggleSection('publish')"
          >
            <IconPublish class="nav-icon" />
            <span class="nav-label">发布 与 上传</span>
          </li>
          <li
            v-if="isAdmin"
            class="nav-item"
            :class="{ active: activeSection === 'admin' }"
            @click="toggleSection('admin')"
          >
            <IconAdmin class="nav-icon" />
            <span class="nav-label">管理员</span>
          </li>
        </ul>
      </aside>

      <!-- ▶ 右侧 Desktop 详细内容 -->
      <section class="settings-content">
        <!-- Desktop 标题栏 -->
        <header class="desktop-detail-header">
          {{ sectionTitleMap[activeSection] }}
        </header>

        <!-- —— “视觉 / 界面” —— -->
        <ul v-show="activeSection === 'visual'" class="settings-group setting-group-card">
          <li class="setting-item">
            <span>主题模式</span>
            <GhostBtn disabled title="已锁定为深色模式">
              <svg v-if="theme === 'light'" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
              </svg>
            </GhostBtn>
          </li>
          <li class="setting-item">
            <span>背景设置</span>
            <GhostBtn @click="showBgModal = true">打开</GhostBtn>
          </li>
        </ul>

        <!-- —— “个人资料” —— -->
        <ul v-show="activeSection === 'profile'" class="settings-group setting-group-card">
          <li class="setting-item">
            <span>账号 / 安全</span>
            <GhostBtn @click="$emit('open-password-modal')">更改密码</GhostBtn>
          </li>
          <li class="setting-item rename-item">
            <span>我的昵称</span>
            <GhostBtn @click="showRenameModal = true">{{ localDisplayName || '设置昵称' }}</GhostBtn>
          </li>
          <li class="setting-item">
            <span>头像：</span>
            <input type="file" accept="image/*" @change="onAvatarChange" />
            <!-- ★ 加上空值检查 -->
            <img
              v-if="userStore && userStore.avatarMap && userStore.avatarMap[currentUser]"
              :src="userStore.avatarMap[currentUser]"
              alt="头像预览"
              style="width: 60px; height: 60px; border-radius: 50%; margin-left: 8px;"
            />
          </li>
          <li class="setting-item">
            <span>勋章中心</span>
            <GhostBtn @click="$emit('open-badge-modal')">更换勋章</GhostBtn>
          </li>
        </ul>

        <!-- —— “交互助手” —— -->
        <ul v-show="activeSection === 'assistant'" class="settings-group setting-group-card">
          <li class="setting-item">
            <span>AI</span>
            <ToggleSwitch
              :modelValue="llmEnabled"
              @update:modelValue="$emit('update:llmEnabled', $event)"
            />
          </li>
        </ul>

        <!-- —— “发布 与 上传” —— -->
        <ul v-show="activeSection === 'publish'" class="settings-group setting-group-card">
          <li class="setting-item">
            <span>图片嵌入正文</span>
            <ToggleSwitch
              :modelValue="imageInsertMode === 'inline'"
              @update:modelValue="val => $emit('update:imageInsertMode', val ? 'inline' : 'preview')"
            />
          </li>
        </ul>

        <!-- —— “管理员” —— -->
        <ul v-show="activeSection === 'admin' && isAdmin" class="settings-group setting-group-card">
          <li class="setting-item" v-for="uid in allowedUids" :key="uid">
            <span>{{ uid }}</span>
            <AdminControls
              :uid="uid"
              @reset-password="uid => $emit('reset-password', uid)"
              @remove-allowed-uid="uid => $emit('remove-allowed-uid', uid)"
              @open-admin-pwd-modal="uid => $emit('open-admin-pwd-modal', uid)"
            />
          </li>
          <li class="setting-item">
            <input
              v-model="newAdminUid"
              placeholder="新 UID"
              class="rename-input"
              style="background: #1f1f1f; color: #e0e0e0; border: 1px solid #444; border-radius: 4px; padding: 6px 8px; width: 60%;"
            />
            <GhostBtn @click="emitAddUid">新增</GhostBtn>
          </li>
        </ul>
      </section>
    </template>

    <!-- ===== 昵称修改弹窗 ===== -->
    <Teleport to="body">
      <div v-if="showRenameModal" class="modal show" @click.self="showRenameModal = false">
        <div class="box" style="min-width: 360px; max-width: 480px;">
          <span class="close" @click="showRenameModal = false">×</span>
          <h3 style="margin-bottom: 16px;">修改昵称</h3>
          <div style="margin-bottom: 24px;">
            <input
              v-model="renameDraft"
              placeholder="输入新的 昵称"
              style="width: 100%; padding: 8px; border: 1px solid #444; border-radius: 4px; background: #1f1f1f; color: #e0e0e0;"
            />
          </div>
          <div style="text-align: right; gap: 8px; display: flex; justify-content: flex-end;">
            <GhostBtn @click="showRenameModal = false">取消</GhostBtn>
            <GhostBtn @click="confirmRename">确定</GhostBtn>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== 背景设置弹窗 ===== -->
    <BaseModal v-model="showBgModal" title="背景设置" maxWidth="480px">
      <ul class="setting-list">
        <li class="setting-item">
          <span>上传背景</span>
          <label class="upload-btn">
            <GhostBtn>上传图片</GhostBtn>
            <input
              type="file"
              accept="image/*"
              @change="onBgUpload"
              style="display: none;"
            />
          </label>
        </li>
        <li class="setting-item">
          <span>背景透明度</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            v-model.number="draftOpacity"
          />
        </li>
        <li class="setting-item">
          <span>背景模糊</span>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            v-model.number="draftBlur"
          />
        </li>
        <li class="setting-item">
          <span>清除背景</span>
          <GhostBtn @click="clearBg">清除背景</GhostBtn>
        </li>
      </ul>
      <template #footer="{ close }">
        <GhostBtn @click="cancelBg">取消</GhostBtn>
        <GhostBtn @click="confirmBg">完成</GhostBtn>
      </template>
    </BaseModal>
  </section>
</template>

<script>
import GhostBtn from '@/components/atoms/GhostBtn.vue'
import ToggleSwitch from '@/components/atoms/ToggleSwitch.vue'
import AdminControls from '@/components/molecules/AdminControls.vue'
import BaseModal from '@/components/molecules/BaseModal.vue'
import { useUserStore } from '@/stores/user'

// 新增图标组件 import
import IconAdmin from '@/components/icons/IconAdmin.vue'
import IconAssistant from '@/components/icons/IconAssistant.vue'
import IconProfile from '@/components/icons/IconProfile.vue'
import IconPublish from '@/components/icons/IconPublish.vue'
import IconVisual from '@/components/icons/IconVisual.vue'

export default {
  name: 'SettingsPanel',
  components: {
    GhostBtn,
    ToggleSwitch,
    AdminControls,
    BaseModal,
    IconVisual,
    IconProfile,
    IconAssistant,
    IconPublish,
    IconAdmin
  },
  emits: [
    'update:theme',
    'update:bgSrc',
    'update:bgOpacity',
    'update:bgBlur',
    'update:imageInsertMode',
    'update:llmEnabled',
    'update:localDisplayName',
    'open-password-modal',
    'open-badge-modal',
    'reset-password',
    'add-allowed-uid',
    'remove-allowed-uid',
    'open-admin-pwd-modal'
  ],
  props: {
    theme: String,
    bgOpacity: Number,
    bgBlur: Number,
    bgSrc: String,
    imageInsertMode: String,
    llmEnabled: Boolean,
    localDisplayName: String,
    allowedUids: Array,
    currentUser: [String, Number],
    adminUid: [String, Number]
  },
  data() {
    return {
      activeSection: 'visual', // Desktop 初始进入“视觉 / 界面”
      isMobile: false,
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
      userStore: null
    }
  },
  computed: {
    isAdmin() {
      return String(this.currentUser) === String(this.adminUid)
    },
    sectionTitleMap() {
      return {
        visual: '视觉 / 界面',
        profile: '个人资料',
        assistant: '交互助手',
        publish: '发布 与 上传',
        admin: '管理员'
      }
    }
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
      if (this.showBgModal) {
        this.$emit('update:bgSrc', val)
      }
    },
    draftOpacity(val) {
      if (this.showBgModal) {
        this.$emit('update:bgOpacity', val)
      }
    },
    draftBlur(val) {
      if (this.showBgModal) {
        this.$emit('update:bgBlur', val)
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateMobile, { passive: true })
    this.updateMobile()
    this.userStore = useUserStore()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateMobile)
  },
  methods: {
    updateMobile() {
      this.isMobile = window.innerWidth < 768
      if (this.isMobile && this.activeSection === '') {
        this.activeSection = null
      }
    },
    toggleSection(key) {
      this.activeSection = key
    },
    onAvatarChange(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        this.userStore.setAvatar(this.currentUser, reader.result)
      }
      reader.readAsDataURL(file)
    },
    clearBg() {
      this.$emit('update:bgSrc', '')
      this.$emit('update:bgOpacity', 1)
      this.$emit('update:bgBlur', 0)
      this.draftBgSrc = ''
      this.draftOpacity = 1
      this.draftBlur = 0
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
    confirmRename() {
      this.$emit('update:localDisplayName', this.renameDraft.trim())
      this.showRenameModal = false
    },
    emitAddUid() {
      const u = (this.newAdminUid || '').trim()
      if (!u) {
        alert('请输入有效 UID')
        return
      }
      if (!this.allowedUids.includes(u)) {
        this.$emit('add-allowed-uid', u)
        this.newAdminUid = ''
      } else {
        alert(`UID ${u} 已在白名单中`)
      }
    },
    onBgUpload(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => {
        this.draftBgSrc = ev.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style scoped>
/* ===== 全局深色支持 ===== */
body.dark {
  background: #121212;
  color: #e0e0e0;
}

/* 根容器：深灰背景 */
.settings-container {
  display: flex;
  gap: 24px;
  padding: 40px 16px;
  max-width: 1600px;
  margin: 0 auto;
  height: 80vh;
  box-sizing: border-box;
}

/* ====================== 💻 Desktop Layout ====================== */
.settings-nav {
  width: 240px;
  background: #1e1e1e;
  border-right: 1px solid #303030;
  border-radius: 8px 0 0 8px;
  position: sticky;
  top: 40px;
  bottom: 40px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  color: #bbb;
  cursor: pointer;
  border-bottom: 1px solid #303030;
  transition: background 0.2s, color 0.2s;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav-item.active {
  background: rgba(78, 161, 243, 0.2);
  color: #fff;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 16px;
  stroke: currentColor;
}

.nav-label {
  font-size: 14px;
  flex: 1;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

/* Desktop 右侧 “详细内容” 样式 */
.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
  scrollbar-width: thin;
}

.settings-content::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

/* Desktop 详细区顶部标题 */
.desktop-detail-header {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e0e0e0;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}

/* 通用分组 & 项目样式 */
.settings-group {
  list-style: none;
  padding: 0;
  margin: 0;
}

.setting-group-card {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.rename-item .rename-input {
  background: #1f1f1f;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 8px;
  width: 60%;
}

/* 模态框内部（BaseModal） */
.box {
  background: #1f1f1f !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #e0e0e0 !important;
}

.close {
  color: #e0e0e0;
}

/* 📱 Mobile Layout */
.settings-container.mobile {
  flex-direction: column;
  padding: 0;
  height: auto;
  background: #0f0f0f;
}

.mobile-nav {
  padding: 24px 16px;
  max-height: calc(100vh - 56px);
  overflow-y: auto;
}

.mobile-nav .nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-nav .nav-item {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 20px;
  color: #bbb;
  cursor: pointer;
  border-bottom: 1px solid #303030;
  transition: background 0.2s, color 0.2s;
}

.mobile-nav .nav-item:last-child {
  border-bottom: none;
}

.mobile-nav .nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.mobile-nav .nav-item.active {
  background: rgba(78, 161, 243, 0.2);
  color: #fff;
}

.mobile-nav .nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  stroke: currentColor;
}

.mobile-nav .nav-label {
  font-size: 16px;
  flex: 1;
}

.mobile-nav .chevron-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

/* Mobile 详情头部 */
.detail-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #181818;
  color: #fff;
}

.back-btn,
.header-spacer {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.detail-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  flex: 1;
  user-select: none;
}

/* Mobile 详情区滚动样式 */
.settings-content {
  padding: 0 24px;
}

/* 针对背景设置弹窗里的文案，用浅灰或者更亮的颜色 */
.setting-list .setting-item span {
  color: #e0e0e0;
}
</style>
