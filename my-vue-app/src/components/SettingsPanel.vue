<!-- src/components/SettingsPanel.vue -->
<template>
    <!-- ======================== 设置 ======================== -->
    <section id="settings">
      <h2 class="big">设置</h2>
      <div class="card settings-tree">
        <ul class="tree-root">
          <!-- 视觉／界面设置 -->
          <li>
            <div class="tree-node" @click="collapsedSections.visual = !collapsedSections.visual">
              <svg class="tree-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M2.5 21.5l2-2 4-4L6 15l-4 4v2.5h2.5z"/>
                <path d="M6 15l9-9 3 3-9 9"/>
                <path d="M14.5 5.5l3.5-3.5 3 3-3.5 3.5"/>
              </svg>
              <span class="tree-label">视觉／界面设置</span>
              <svg class="icon" viewBox="0 0 24 24">
                <path v-if="collapsedSections.visual" d="M9 6l6 6-6 6"/>
                <path v-else               d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            <transition name="slide-fade">
              <ul v-show="!collapsedSections.visual" class="settings-group">
                <li class="setting-item">
                  <span>主题模式</span>
                  <input type="checkbox" :checked="theme==='dark'" @change="toggleTheme" />
                </li>
                <li class="setting-item">
                  <span>背景设置</span>
                  <label class="btn-ghost upload-btn">
                    上传背景
                    <input type="file" accept="image/*" @change="changeBackground" />
                  </label>
                </li>
                <li class="setting-item">
                  <span>背景透明度</span>
                  <input type="range" min="0" max="1" step="0.05" :value="bgOpacity" @input="saveBgOpacity($event.target.value)" />
                </li>
                <li class="setting-item">
                  <span>背景模糊</span>
                  <input type="range" min="0" max="20" step="1" :value="bgBlur" @input="saveBgBlur($event.target.value)" />
                </li>
                <li class="setting-item">
                  <span>动态加载模式</span>
                  <select :value="loadMode" @change="saveLoadMode">
                    <option value="auto">自动</option>
                    <option value="manual">手动</option>
                  </select>
                </li>
              </ul>
            </transition>
          </li>
  
          <!-- 个人资料 -->
          <li>
            <div class="tree-node" @click="collapsedSections.profile = !collapsedSections.profile">
              <svg class="tree-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                <path d="M4 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2"/>
              </svg>
              <span class="tree-label">个人资料</span>
              <svg class="icon" viewBox="0 0 24 24">
                <path v-if="collapsedSections.profile" d="M9 6l6 6-6 6"/>
                <path v-else                     d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            <transition name="slide-fade">
              <ul v-show="!collapsedSections.profile" class="settings-group">
                <li class="setting-item">
                  <span>账号与安全</span>
                  <button class="btn-ghost" @click="$emit('open-password-modal')">更改密码</button>
                </li>
                <li class="setting-item rename-item">
                  <span>我的昵称</span>
                  <input
                    type="text"
                    :value="localDisplayName"
                    @input="$emit('update:localDisplayName', $event.target.value)"
                    placeholder="输入新的昵称"
                  />
                </li>
                <li class="setting-item">
                  <span>勋章中心</span>
                  <button class="btn-ghost" @click="$emit('open-badge-modal')">更换勋章</button>
                </li>
              </ul>
            </transition>
          </li>
  
          <!-- 交互助手 -->
          <li>
            <div class="tree-node" @click="collapsedSections.assistant = !collapsedSections.assistant">
              <svg class="tree-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z"/>
              </svg>
              <span class="tree-label">交互助手</span>
              <svg class="icon" viewBox="0 0 24 24">
                <path v-if="collapsedSections.assistant" d="M9 6l6 6-6 6"/>
                <path v-else                         d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            <transition name="slide-fade">
              <ul v-show="!collapsedSections.assistant" class="settings-group">
                <li class="setting-item">
                  <span>桌宠</span><input type="checkbox" :checked="petEnabled" @change="$emit('update:petEnabled', $event.target.checked)" />
                </li>
                <li class="setting-item">
                  <span>AI</span><input type="checkbox" :checked="llmEnabled" @change="$emit('update:llmEnabled', $event.target.checked)" />
                </li>
              </ul>
            </transition>
          </li>
  
          <!-- 发布与上传 -->
          <li>
            <div class="tree-node" @click="collapsedSections.publish = !collapsedSections.publish">
              <svg class="tree-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 10l5-5m0 0l5 5m-5-5v12"/>
              </svg>
              <span class="tree-label">发布与上传</span>
              <svg class="icon" viewBox="0 0 24 24">
                <path v-if="collapsedSections.publish" d="M9 6l6 6-6 6"/>
                <path v-else                 d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            <transition name="slide-fade">
              <ul v-show="!collapsedSections.publish" class="settings-group">
                <li class="setting-item">
                  <span>发布设置</span>
                </li>
                <li class="setting-item">
                  <span>图片上传方式</span>
                  <select :value="imageInsertMode" @change="$emit('update:imageInsertMode', $event.target.value)">
                    <option value="preview">预览区</option>
                    <option value="inline">正文内嵌</option>
                  </select>
                </li>
              </ul>
            </transition>
          </li>
  
          <!-- 管理员 -->
          <li v-if="isAdmin">
            <div class="tree-node" @click="collapsedSections.admin = !collapsedSections.admin">
              <svg class="tree-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              <span class="tree-label">账号管理（Admin）</span>
              <svg class="icon" viewBox="0 0 24 24">
                <path v-if="collapsedSections.admin" d="M9 6l6 6-6 6"/>
                <path v-else                 d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            <transition name="slide-fade">
              <ul v-show="!collapsedSections.admin" class="settings-group">
                <li class="setting-item" v-for="uid in allowedUids" :key="uid">
                  <span>{{ uid }}</span>
                  <button class="btn-ghost" @click="$emit('reset-password', uid)">重置密码</button>
                  <button class="btn-ghost" @click="$emit('remove-allowed-uid', uid)">移除白名单</button>
                  <button class="btn-ghost" @click="$emit('open-admin-pwd-modal', uid)">设定密码</button>
                </li>
                <li class="setting-item">
                  <input v-model="newAdminUid" placeholder="新 UID" class="rename-input" />
                  <button class="btn-publish" @click="$emit('add-allowed-uid', newAdminUid)">新增</button>
                </li>
              </ul>
            </transition>
          </li>
  
        </ul>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'SettingsPanel',
    emits: [
        // —— 下面这行负责响应父组件的 v-model:selectedBadge —— 
        'update:selectedBadge',
        /* v-model */
        'update:theme','update:bgSrc','update:bgOpacity','update:bgBlur',
        'update:loadMode','update:imageInsertMode',
        'update:petEnabled','update:llmEnabled','update:localDisplayName',
        /* 各种按钮 */
        'open-password-modal','open-badge-modal',
        'reset-password','add-allowed-uid','remove-allowed-uid',
        'open-admin-pwd-modal'
    ],
    props: {
      theme: String,
      bgSrc: String,
      bgOpacity: Number,
      bgBlur: Number,
      loadMode: String,
      imageInsertMode: String,
      petEnabled: Boolean,
      llmEnabled: Boolean,
      localDisplayName: String,
      allowedUids: Array,
      currentUser  : [String, Number],
      bestBadgeUid : [String, Number],
      adminUid      : [String, Number],  // 新增：管理员用
      selectedBadge: String,    
      allowedBadges: Array      
    },
    data() {
      return {
        collapsedSections: {
          visual: true,
          profile: true,
          assistant: true,
          publish: true,
          admin: true
        },
        newAdminUid: ''
      };
    },
    computed: {
        isAdmin () {
            // 现在拿 currentUser 跟 adminUid 去比
            return String(this.currentUser) === String(this.adminUid)
        }
    },
    methods: {
      toggleTheme() {
        this.$emit('update:theme', this.theme === 'light' ? 'dark' : 'light');
      },
      changeBackground(e) {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = ev => this.$emit('update:bgSrc', ev.target.result);
        r.readAsDataURL(f);
      },
      saveBgOpacity(val) {
        this.$emit('update:bgOpacity', parseFloat(val));
      },
      saveBgBlur(val) {
        this.$emit('update:bgBlur', parseInt(val));
      },
      saveLoadMode(e) {
        this.$emit('update:loadMode', e.target.value);
      },
      
    }
  };
  </script>
  
<style scoped>
  #settings {
    padding: 40px 16px;
    margin: 0 auto;
    max-width: 680px;
  }
  .settings-tree {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .tree-root {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .tree-node {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
  }
  .tree-icon,
  .icon {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    flex-shrink: 0;
  }
  .tree-label {
    font-size: 15px;
    font-weight: 600;
  }
  .settings-group {
    overflow: hidden;
  }
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
  }
  .rename-item input {
    width: 140px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-5px);
  }
  .slide-fade-enter-to,
  .slide-fade-leave-from {
    max-height: 400px;
    opacity: 1;
    transform: translateY(0);
  }
  

/* 重命名输入框 */
.rename-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}
.rename-item input {
  width: 140px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.rename-item input:focus {
  border-color: var(--primary);
  outline: none;
}
.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tree-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.tree-label {
  font-size: 15px;
  font-weight: 600;
}


/* 让列表自然一列排开，每张卡占满宽度 */
.settings-tree > ul {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片风格 + 拉满宽度 */
.settings-tree > ul > li {
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur)/2));
  border: var(--glass-border);
  border-radius: var(--radius);
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  padding: 24px 20px;
  width: 100%;
  transition: 
    background 0.3s ease, 
    box-shadow 0.3s ease, 
    transform 0.3s ease;
  /* 确保盒模型一致 */
  box-sizing: border-box;
}

/* 深色模式 */
body.dark .settings-tree > ul > li {
  background: var(--card-dark);
  box-shadow: 0 6px 18px rgba(0,0,0,0.45);
}
.settings-tree > ul > li:hover {
  /* 整体轻微提亮 */
  background: var(--card-hover-light);
  /* 深色模式下替换 */
}
body.dark .settings-tree > ul > li:hover {
  background: var(--card-hover-dark);
}

.settings-tree > ul > li:hover {
  /* 轻微上浮，制造“悬浮感” */
  transform: translateY(-2px);
  /* 阴影加强，让卡片更有层次 */
  box-shadow: 
    0 8px 24px rgba(0,0,0,0.12),
    0 4px 12px rgba(0,0,0,0.06);
}
/* 使用 flex + gap 统一管理卡片之间的距离 */
#settings .settings-tree .tree-root {
  display: flex;
  flex-direction: column;
  gap: 24px;    /* 24px = 3 × 8px 基准栅格，既不太密也不过疏 */
  padding: 0;   /* 去掉额外的内边距 */
  margin: 0;
  list-style: none;
}
/* 去掉原先单独给 li 加的 margin-bottom */
#settings .settings-tree .tree-root > li {
  margin: 0;
  width: 100%;  /* 让 li 适应容器宽度 */
}
/* 卡片内部内容与边框保持一致的呼吸感 */
#settings .settings-tree > .tree-root > li {
  padding: 24px 20px;   /* 上下 24px，左右 20px */
  box-sizing: border-box;
}
/* 树状结构基础 */
.settings-tree ul { list-style: none; padding-left: 0; margin: 0; }
.settings-tree .tree-root > li { margin-bottom: 16px; }

/* 一级节点 */
.tree-node {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  transition: background .2s;
}
.tree-node:hover {
  background: transparent;
}
/* 二级列表 */
.settings-tree ul ul {
  margin-top: 6px;
  padding-left: 20px;
  border-left: 2px dashed rgba(0,0,0,0.1);
}
/* 2. 给二级列表加个专用 class，必要时做内边距收缩 */
.settings-group {
  overflow: hidden;
}
</style>
  