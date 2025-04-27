<!-- src/components/SettingsPanel.vue -->
<template>
    <!-- 两栏布局：左侧导航，右侧内容 -->
    <section id="settings" class="settings-container">
      <!-- ============ 左侧导航 ============ -->
      <aside class="settings-nav">
        <ul class="nav-list">
          <li :class="{active:activeSection==='visual'}" @click="toggleSection('visual')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M2.5 21.5l2-2 4-4L6 15l-4 4v2.5h2.5z"/><path d="M6 15l9-9 3 3-9 9"/><path d="M14.5 5.5l3.5-3.5 3 3-3.5 3.5"/>
            </svg><span>视觉／界面</span>
          </li>
          <li :class="{active:activeSection==='profile'}" @click="toggleSection('profile')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
              <path d="M4 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2"/>
            </svg><span>个人资料</span>
          </li>
          <li :class="{active:activeSection==='assistant'}" @click="toggleSection('assistant')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z"/>
            </svg><span>交互助手</span>
          </li>
          <li :class="{active:activeSection==='publish'}" @click="toggleSection('publish')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 10l5-5m0 0l5 5m-5-5v12"/>
            </svg><span>发布与上传</span>
          </li>
          <li v-if="isAdmin" :class="{active:activeSection==='admin'}" @click="toggleSection('admin')">
            <svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg><span>管理员</span>
          </li>
        </ul>
      </aside>
  
      <!-- ============ 右侧内容 ============ -->
      <section class="settings-content">
        <!-- 视觉／界面 -->
        <ul v-show="activeSection==='visual'" class="settings-group">
          <li class="setting-item">
            <span>主题模式</span>
            <input type="checkbox" :checked="theme==='dark'" @change="toggleTheme" />
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
            <span>动态加载模式</span>
            <select :value="loadMode" @change="saveLoadMode">
              <option value="auto">自动</option><option value="manual">手动</option>
            </select>
          </li>
        </ul>
  
        <!-- 个人资料 -->
        <ul v-show="activeSection==='profile'" class="settings-group">
          <li class="setting-item">
            <span>账号与安全</span>
            <button class="btn-ghost" @click="$emit('open-password-modal')">更改密码</button>
          </li>
          <li class="setting-item rename-item">
            <span>我的昵称</span>
            <input type="text" :value="localDisplayName" placeholder="输入新的昵称"
                   @input="$emit('update:localDisplayName', $event.target.value)" />
          </li>
          <li class="setting-item">
            <span>勋章中心</span>
            <button class="btn-ghost" @click="$emit('open-badge-modal')">更换勋章</button>
          </li>
        </ul>
  
        <!-- 交互助手 -->
        <ul v-show="activeSection==='assistant'" class="settings-group">
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
        <ul v-show="activeSection==='publish'" class="settings-group">
          <li class="setting-item">
            <span>发布设置</span>
          </li>
          <li class="setting-item">
            <span>图片上传方式</span>
            <select :value="imageInsertMode"
                    @change="$emit('update:imageInsertMode', $event.target.value)">
              <option value="preview">预览区</option><option value="inline">正文内嵌</option>
            </select>
          </li>
        </ul>
  
        <!-- 管理员 -->
        <ul v-show="activeSection==='admin' && isAdmin" class="settings-group">
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
    </section>
  </template>
  
  <script>
  export default {
    name: 'SettingsPanel',
    emits:[
      'update:theme','update:bgSrc','update:bgOpacity','update:bgBlur',
      'update:loadMode','update:imageInsertMode',
      'update:petEnabled','update:llmEnabled','update:localDisplayName',
      'open-password-modal','open-badge-modal',
      'reset-password','add-allowed-uid','remove-allowed-uid','open-admin-pwd-modal'
    ],
    props:{
      theme:String,bgOpacity:Number,bgBlur:Number,
      loadMode:String,imageInsertMode:String,
      petEnabled:Boolean,llmEnabled:Boolean,
      localDisplayName:String,
      allowedUids:Array,currentUser:[String,Number],adminUid:[String,Number]
    },
    data(){return{activeSection:'visual',newAdminUid:''};},
    computed:{
      isAdmin(){ return String(this.currentUser)===String(this.adminUid); },
      proxyBgOpacity:{
        get(){return this.bgOpacity;},
        set(v){this.$emit('update:bgOpacity',v);}
      },
      proxyBgBlur:{
        get(){return this.bgBlur;},
        set(v){this.$emit('update:bgBlur',v);}
      }
    },
    methods:{
      toggleSection(k){this.activeSection=k;},
      toggleTheme(){this.$emit('update:theme', this.theme==='light' ? 'dark':'light');},
      changeBackground(e){
        const f=e.target.files[0]; if(!f)return;
        const r=new FileReader();
        r.onload=ev=>this.$emit('update:bgSrc',ev.target.result);
        r.readAsDataURL(f);
      },
      saveLoadMode(e){this.$emit('update:loadMode',e.target.value);}
    }
  };
  </script>
  
  <style scoped>
  /* ===== 布局基础 ===== */
  .settings-container{
    display:flex;
    gap:24px;
    padding:40px 16px;
    max-width:960px;
    margin:0 auto;
    height:80vh;             /* 保证固定高度，内部滚动 */
    box-sizing:border-box;
  }
  
  /* 左侧导航 */
  .settings-nav{
    width:200px;
    border-right:1px solid rgba(0,0,0,0.1);
    position:sticky;         /* 滚动时保持可见 */
    top:40px;
    align-self:flex-start;
  }
  .nav-list{margin:0;padding:0;list-style:none;}
  .nav-list li{
    display:flex;align-items:center;
    padding:12px 16px;cursor:pointer;user-select:none;
    transition:background .2s;
  }
  .nav-list li:hover{background:rgba(0,0,0,0.04);}
  .nav-list li.active{background:rgba(74,144,226,0.1);font-weight:600;}
  .nav-icon{width:20px;height:20px;flex-shrink:0;margin-right:8px;}
  
  /* 右侧内容 */
  .settings-content{
    flex:1;
    overflow-y:auto;         /* 独立滚动区域 */
    padding-right:8px;       /* 给滚动条留空间 */
    scrollbar-width:thin;    /* Firefox */
  }
  
  /* 分组列表 */
  .settings-group{margin:0;padding:0;list-style:none;}
  
  /* 单行项目：两列网格避免挤压 */
  .setting-item{
    display:grid;
    grid-template-columns: auto 1fr;
    align-items:center;
    gap:24px;
    margin:16px 0;
  }
  
  .btn-group{display:flex;gap:8px;flex-wrap:wrap;}
  
  .rename-item input,
  .rename-input{
    width:160px;padding:6px 10px;
    border:1px solid #ccc;border-radius:4px;
  }
  .btn-ghost input[type="file"]{display:none;}
/* 全局按钮基础 */
.settings-container .btn-ghost,
.settings-container .btn-publish {
  display: inline-block;      /* 保证外部宽度随内容浮动 */
  width: fit-content;         /* 根据内容收缩 */
  padding: 6px 12px;          /* 保持一致的水平内边距 */
  min-width: 64px;            /* 最小宽度，避免过短 */
  text-align: center;         /* 文本居中 */
}

/* 在网格/按钮组中靠左对齐 */
.settings-container .btn-group button {
  justify-self: start;
}


  </style>
  