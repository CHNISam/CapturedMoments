<template>
  <div>
    <!-- 登录 Modal -->
    <LoginModal :show="!currentUser" @login-success="handleLogin" />

    <!-- ================== 已登录主界面 ================== -->
    <div v-if="currentUser">
      <!-- 用户自定义背景 -->
      <div id="bgLayer" :style="bgStyle"></div>

      <!-- 顶部导航 -->
      <nav>
        <div class="logo">把回忆拼好给你</div>
        <div class="menu">
          <a href="#moments"  @click.prevent="scrollTo('moments')">动态 <span class="red" :class="{ hidden: !hasUnread }"></span></a>
          <a href="#album"    @click.prevent="scrollTo('album')">相册</a>
          <a href="#settings" @click.prevent="scrollTo('settings')">设置</a>
          <span style="font-weight:600">{{ currentUser }}</span>
          <a class="btn-ghost" @click="logout">退出</a>
          <button class="btn-ghost" @click="toggleTheme">
            <svg v-if="theme==='light'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/></svg>
            <svg v-else                viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>
          </button>
        </div>
      </nav>

      <!-- ======================== 投稿区 ======================== -->
      <section id="moments">
        <h2 class="big">投稿</h2>
        <div class="np-top">
          <textarea
            v-model="newPostText"
            placeholder="说点什么…"
            maxlength="2000"
            @input="autoResize($event)"
            @keydown.enter="handlePostEnter($event)"
          ></textarea>

          <div class="np-toolbar">
            <span class="char-count">{{ newPostText.length }}/2000</span>
            <select v-model="newPostPlace">
              <option value="">无地点</option>
              <option>蒙德</option><option>璃月</option><option>稻妻</option>
              <option>须弥</option><option>枫丹</option><option>纳塔</option>
            </select>

            <label class="btn-ghost upload-btn">
              <svg viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <input type="file" accept="image/*" multiple @change="handlePostImages"/>
            </label>

            <button class="btn-publish" @click="publishPost">发布</button>
          </div>
        </div>

        <!-- 图片草稿预览 -->
        <div v-if="draftImgs.length" class="np-preview">
          <div v-for="(img,i) in draftImgs" :key="i" class="thumb">
            <img :src="img"/><span class="remove" @click="removeDraft(i)">×</span>
          </div>
        </div>

        <!-- 动态列表 -->
        <h2 class="big">动态</h2>
        <div id="moments-list">
          <div v-for="post in posts" :key="post.id" class="post card">
            <div class="head" style="display:flex;justify-content:space-between;align-items:center;">
              <div style="display:flex;align-items:center;gap:8px;">
                <div :style="{width:'34px',height:'34px',borderRadius:'50%',background:'url('+getAvatar(post.uid)+') center/cover'}"></div>
                <b>{{ getDisplayName(post.uid) }}</b>
                <span v-html="badgeHTML(post.uid)"></span>
                <span class="red" v-if="!isRead(post.id)&&post.uid!==currentUser"></span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:12px">{{ new Date(post.ts).toLocaleTimeString() }}</span>
                <span v-if="post.uid===currentUser" class="more" @click="deletePost(post)">⋯</span>
              </div>
            </div>

            <div class="body">
              <p>{{ post.txt }}</p>
              <small>{{ new Date(post.ts).toLocaleDateString() }}{{ post.place?' · '+post.place:'' }}</small>
            </div>

            <div class="photos">
              <img v-for="(img,i) in post.imgs" :key="i" :src="img" @click="openModal(img, formatMeta(post))"/>
            </div>

            <div class="actions">
              <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z m0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
              <span>{{ post.views }}</span>
            </div>

            <div class="comments">
              <div v-for="(c,idx) in post.cmts" :key="idx" class="comment">
                <div class="comment-left">
                  <span class="comment-display">{{ getDisplayName(c.who) }}: {{ c.txt }}</span>
                </div>
                <div class="comment-right">
                  <span v-if="c.who===currentUser" class="comment-edit"   @click="editComment(post,idx)">✎</span>
                  <span v-if="c.who===currentUser" class="comment-delete" @click="deleteComment(post,idx)">×</span>
                  <span v-else class="comment-author">{{ getDisplayName(c.who) }}</span>
                </div>
              </div>

              <div class="c-input">
                <input
                  type="text"
                  v-model="newComment[post.id]"
                  placeholder="评论..."
                  @keydown.enter.prevent="handleCommentEnter($event, post)"
                />
                <button class="btn-publish" style="font-size:13px" @click="sendComment(post)">发送</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================== 相册 ======================== -->
      <section id="album">
        <h2 class="big">相册</h2>
        <div class="album-tabs">
          <button :class="{on:albumMode==='time'}"   @click="albumMode='time'">按时间</button>
          <button :class="{on:albumMode==='region'}" @click="albumMode='region'">按地区</button>
        </div>

        <div id="album-grid" class="grid">
          <template v-for="(group,key) in groupedPhotos" :key="key">
            <h4 style="grid-column:1/-1;margin:4px 0 6px">{{ key }}</h4>
            <div
              v-for="(photo,i) in group"
              :key="i"
              class="photo"
              @click="openModal(photo.url,photo.meta)"
            >
              <img :src="photo.url"/><span>{{ photo.place }}</span>
            </div>
          </template>
        </div>

        <div v-if="allPhotos.length===0" style="text-align:center;margin-top:30px;color:#888">暂无照片，快去上传吧~</div>
      </section>

      <!-- ======================== 设置 ======================== -->
      <section id="settings">
        <h2 class="big">设置</h2>
        <div class="card">
          <fieldset>
            <legend>外观</legend>
            <div class="setting-item">
              <span>暗黑模式</span><input type="checkbox" :checked="theme==='dark'" @change="toggleTheme"/>
            </div>
            <div class="setting-item">
              <span>上传背景</span>
              <label class="btn-ghost upload-btn">
                <svg viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2"/></svg>
                <input type="file" accept="image/*" @change="changeBackground"/>
              </label>
            </div>
            <div class="setting-item"><span>背景透明度</span><input type="range" min="0" max="1" step="0.05" v-model.number="bgOpacity"/></div>
            <div class="setting-item"><span>背景模糊</span><input type="range" min="0" max="20" step="1" v-model.number="bgBlur"/></div>
          </fieldset>

          <fieldset>
            <legend>桌宠 / LLM</legend>
            <div class="setting-item"><span>显示桌宠</span><input type="checkbox" v-model="petEnabled"/></div>
            <div class="setting-item"><span>桌宠类型</span>
              <select v-model="petType">
                <option value="cat">猫娘</option><option value="bird">魈鸟</option>
              </select>
            </div>
            <div class="setting-item"><span>启用 LLM</span><input type="checkbox" v-model="llmEnabled"/></div>
            <div class="setting-item"><span>桌宠 Prompt</span><input v-model="petPrompt"/></div>
          </fieldset>

          <fieldset>
            <legend>账户</legend>
            <div class="setting-item">
              <span>头像</span>
              <div class="avatar-group">
                <label class="btn-ghost upload-btn">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2"/></svg>
                  <input type="file" accept="image/*" @change="changeAvatar"/>
                </label>
                <img :src="getAvatar(currentUser)" alt="Avatar" style="width:40px;height:40px;border-radius:50%;"/>
              </div>
            </div>
            <div class="setting-item"><span>我的昵称</span><input type="text" v-model="localDisplayName" @input="updateDisplayName"/></div>
            <div class="setting-item"><span>更改密码</span><button class="btn-ghost" @click="openPasswordModal">更改密码</button></div>
          </fieldset>

          <fieldset id="badge-field">
            <legend>勋章</legend>
            <div class="setting-item" style="flex-direction:row;align-items:center;">
              <button class="btn-ghost" @click="openBadgeModal">更换勋章</button>
            </div>
          </fieldset>
          <!-- —— Admin 管理面板 —— -->
          <fieldset v-if="currentUser === '217122260'">
            <legend>账号管理（Admin）</legend>
            <div v-for="uid in allowedUids" :key="uid" class="setting-item admin-row">
              <span class="admin-uid">{{ uid }}</span>
              <div class="admin-buttons">
                <button class="btn-ghost" @click="resetPassword(uid)">重置密码</button>
                <button class="btn-ghost" @click="removeAllowedUid(uid)">移除白名单</button>
                <button class="btn-ghost" @click="openAdminPwdModal(uid)">设定密码</button>
              </div>
            </div>

            <div class="setting-item">
              <input v-model="newAdminUid" placeholder="新 UID" class="setting-item__input"/>
              <button class="btn-publish" @click="addAllowedUid">新增</button>
            </div>
          </fieldset>
          <!-- —— Admin 密码 Modal —— -->
          <div v-if="adminPwdModalVisible" class="modal show">
            <div class="box" style="max-width:360px;">
              <span class="close" @click="closeAdminPwdModal">×</span>
              <h3>为 {{ adminTargetUid }} 设置密码</h3>
              <div style="margin:16px 0;">
                <input
                  v-model="adminNewPassword"
                  type="password"
                  placeholder="新密码（至少4位）"
                  class="setting-item__input"
                />
              </div>
              <button class="btn-publish" @click="confirmAdminSetPassword">确定</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 勋章 Modal -->
      <div v-if="showBadgeModal" class="modal show">
        <div class="box">
          <span class="close" @click="closeBadgeModal">×</span>
          <h3>选择勋章</h3>
          <div style="margin:10px 0;">
            <label v-for="badge in allowedBadges" :key="badge.id" style="display:flex;align-items:center;gap:6px;margin:4px 0">
              <input type="radio" name="wear" :value="badge.id" v-model="selectedBadge"/>
              <span :class="['badge', badge.id==='best'?'best':badge.id==='catgirl'?'catgirl':badge.id==='none'?'badge-none':'']">
                {{ badge.name }}
              </span>
            </label>
          </div>
          <button class="btn-publish" style="margin-top:12px" @click="confirmBadge">确认</button>
        </div>
      </div>

      <!-- 图片 Modal -->
      <div v-if="showModal" class="modal show">
        <div class="box" style="max-width:90%;text-align:center;">
          <span class="close" @click="closeModal">×</span>
          <img :src="modalSrc" style="max-width:100%;max-height:80vh"/>
          <div style="margin-top:6px;font-size:13px;color:#888">{{ modalMeta }}</div>
        </div>
      </div>

      <!-- 密码 Modal -->
      <div v-if="showPasswordModal" class="modal show">
        <div class="box" style="text-align:center;max-width:340px;">
          <span class="close" @click="closePasswordModal">×</span>
          <h3>更改密码</h3>
          <div style="margin-top:16px;">
            <input type="password" v-model="oldPassword"     placeholder="旧密码"     style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;margin-bottom:8px;"/>
            <input type="password" v-model="newPassword"     placeholder="新密码"     style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;margin-bottom:8px;"/>
            <input type="password" v-model="confirmPassword" placeholder="确认新密码" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;margin-bottom:8px;"/>
            <button class="btn-publish" style="margin-top:12px" @click="changePassword">确认更改</button>
          </div>
        </div>
      </div>

      <!-- 桌宠 -->
      <div
        id="pet"
        v-if="petEnabled"
        ref="pet"
        style="position:fixed;right:24px;bottom:24px;width:90px;user-select:none;cursor:move;z-index:90;"
        @mousedown="dragPet"
      >
        <div v-html="petSVG"></div>
      </div>

      <footer style="text-align:center;padding:24px 0;font-size:13px;color:#777">
        © 2025 把回忆拼好给你
      </footer>
    </div>
  </div>
</template>

<script>
/* ===== 登录白名单 & 常量 ===== */
const BEST_BADGE_UID    = '246490729';                 // 佩戴「最好的大佬」勋章的 UID
import LoginModal from '@/components/LoginModal.vue';
import { getAllowedUids, setAllowedUids } from '@/config/auth';
import { getOrCreateSalt, saltedHash } from '@/utils/crypto';

export default {
  name: 'App',
  components: { LoginModal },
  /* ---------- data ---------- */
  data() {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    return {
      // 当前登录 UID；null 代表未登录
      currentUser: storedUser,

      /* 业务数据 */
      posts: JSON.parse(localStorage.getItem('posts') || '[]'),

      /* 主题 / 外观 */
      theme: localStorage.getItem('theme') || 'light',
      bgSrc: localStorage.getItem('bgSrc') || '',
      bgOpacity: parseFloat(localStorage.getItem('bgOpacity') || 0.35),
      bgBlur: parseInt(localStorage.getItem('bgBlur') || 4),

      /* 投稿 */
      newPostText: '',
      newPostPlace: '',
      draftImgs: [],

      /* 评论 */
      newComment: {},

      /* Modals */
      showBadgeModal: false,
      showPasswordModal: false,
      showModal: false,
      modalSrc: '',
      modalMeta: '',

      /* 设置 */
      petEnabled: true,
      petType: 'cat',
      llmEnabled: true,
      petPrompt: '喵～ 记得喝水喔！',
      localDisplayName: localStorage.getItem('displayName_' + (storedUser || '')) || '',

      /* 勋章 */
      BADGES: [
        { id: 'none',    name: '不佩戴'        },
        { id: 'best',    name: '最好的大佬'    },
        { id: 'catgirl', name: '你才是猫娘'    }
      ],
      selectedBadge: localStorage.getItem('wear_' + (storedUser || '')) || 'none',

      /* 密码 */
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',

      /* 已读 */
      readIds: new Set(JSON.parse(localStorage.getItem('readIds_' + (storedUser || '')) || '[]')),

      /* 相册 */
      albumMode: 'time',

      /* 管理员 */
      adminPwdModalVisible: false,
      adminTargetUid: '',
      adminNewPassword: '',
      newAdminUid: '',
      
      /* 白名单 */
      allowedUids: getAllowedUids(),
    };
  },

  /* ---------- computed ---------- */
  computed: {
    displayName() {
      if (!this.currentUser) return '';
      return localStorage.getItem('displayName_' + this.currentUser) || this.currentUser;
    },
    allPhotos() {
      const out = [];
      this.posts.forEach(p => p.imgs.forEach(url => out.push({
        url, place: p.place || '未知', date: new Date(p.ts).toISOString().slice(0, 10)
      })));
      return out;
    },
    groupedPhotos() {
      const g = {};
      this.allPhotos.forEach(p => {
        const key = this.albumMode === 'time' ? p.date.slice(0, 7) : p.place;
        if (!g[key]) g[key] = [];
        g[key].push({ ...p, meta: `${p.date} · ${p.place}` });
      });
      return g;
    },
    allowedBadges() {
      return this.BADGES.filter(b => (b.id === 'best' ? this.currentUser === BEST_BADGE_UID : true));
    },
    hasUnread() {
      return this.posts.some(p => !this.readIds.has(p.id) && p.uid !== this.currentUser);
    },
    bgStyle() {
      return {
        backgroundImage: this.bgSrc ? `url(${this.bgSrc})` : 'none',
        opacity: this.bgOpacity,
        filter: `blur(${this.bgBlur}px)`
      };
    },
    petSVG() {
      return this.petType === 'bird'
        ? `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="#cdeffd" stroke="#333" stroke-width="3"/><path d="M40 70 Q60 90 80 70" stroke="#333" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="45" cy="55" r="8"/><circle cx="75" cy="55" r="8"/></svg>`
        : `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="#ffe4e1" stroke="#333" stroke-width="3"/><circle cx="45" cy="50" r="10"/><circle cx="75" cy="50" r="10"/><path d="M45 80 Q60 95 75 80" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
    },
  },

  watch: {
    bgOpacity: 'saveBgOpacity',
    bgBlur: 'saveBgBlur'
  },

  /* ---------- methods ---------- */
  methods: {
    /* ========== 登录 ========== */
    /* 登录成功后的回调 */
    handleLogin (uid) {
      this.currentUser   = uid;
      localStorage.setItem('currentUser', JSON.stringify(uid));
      this.readIds       = new Set(JSON.parse(localStorage.getItem('readIds_' + uid) || '[]'));
      this.localDisplayName = localStorage.getItem('displayName_' + uid) || '';
      this.posts         = JSON.parse(localStorage.getItem('posts') || '[]');
    },
    logout () {
      localStorage.removeItem('currentUser');
      this.currentUser    = null;
      this.posts          = [];
      this.localDisplayName = '';
      this.readIds        = new Set();
    },
    /* ========== 工具函数 ========== */
    formatMeta(post) { return `${new Date(post.ts).toISOString().slice(0,10)} · ${post.place || '未知'}`; },
    badgeHTML(uid) {
      const raw = localStorage.getItem('wear_' + uid);
      if (!raw || raw === '"none"' || raw === 'none') return '';
      const val  = (() => { try { return JSON.parse(raw); } catch { return raw; } })();
      const cls  = val === 'best' ? 'badge best'
                 : val === 'catgirl' ? 'badge catgirl'
                 : val === 'none' ? 'badge-none' : 'badge';
      const name = this.BADGES.find(b => b.id === val)?.name || '';
      return `<span class="${cls}">${name}</span>`;
    },
    scrollTo(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); },
    getAvatar(uid){ return uid ? localStorage.getItem('avatar-' + uid) || 'https://placehold.co/60' : '' },
    getDisplayName(uid){ return localStorage.getItem('displayName_' + uid) || uid },

    /* ========== 投稿 ========== */
    handlePostImages(e){ this.draftImgs=[]; Array.from(e.target.files).slice(0,30).forEach(f=>this.draftImgs.push(URL.createObjectURL(f))); },
    removeDraft(i){ this.draftImgs.splice(i,1); },
    autoResize(e){ e.target.style.height='auto'; e.target.style.height=e.target.scrollHeight+'px'; },
    publishPost(){
      if(!this.currentUser) return alert('请先登录');
      const txt=this.newPostText.trim();
      if(!txt && !this.draftImgs.length) return alert('写点文字或选张图片吧~');

      const post={ id:Date.now(), uid:this.currentUser, txt, place:this.newPostPlace,
                   imgs:[...this.draftImgs], ts:Date.now(), views:0, cmts:[] };

      this.posts.unshift(post);
      localStorage.setItem('posts', JSON.stringify(this.posts.map(p=>({...p,imgs:[]}))));

      this.newPostText=''; this.newPostPlace=''; this.draftImgs=[];
    },
    handlePostEnter(e){
      if (!e.shiftKey) { e.preventDefault(); this.publishPost(); }
    },
    deletePost(p){
      if(confirm('撤回这条动态？')){
        this.posts=this.posts.filter(x=>x.id!==p.id);
        localStorage.setItem('posts', JSON.stringify(this.posts.map(q=>({...q,imgs:[]}))));
      }
    },
    isRead(id){ return this.readIds.has(id); },

    /* ========== 图片 Modal ========== */
    openModal(src,meta){ this.modalSrc=src; this.modalMeta=meta; this.showModal=true; },
    closeModal(){ this.showModal=false; },

    /* ========== 评论 ========== */
    sendComment(p){
      const t=this.newComment[p.id];
      if(t && t.trim()){ p.cmts.push({who:this.currentUser,txt:t.trim()}); this.newComment[p.id]=''; }
    },
    deleteComment(p,i){ if(confirm('确定撤回该评论吗？')) p.cmts.splice(i,1); },
    editComment(p,i){
      const old=p.cmts[i].txt, neo=prompt('编辑评论：',old);
      if(neo!==null && neo.trim() && neo!==old) p.cmts[i].txt = neo.trim();
    },
    handleCommentEnter(e, post){
      if (e.shiftKey) return;
      this.sendComment(post);
    },

    /* ========== 背景 ========== */
    changeBackground(e){
      const f=e.target.files[0]; if(!f) return;
      const r=new FileReader();
      r.onload=ev=>{ this.bgSrc=ev.target.result; localStorage.setItem('bgSrc', this.bgSrc); };
      r.readAsDataURL(f);
    },
    saveBgOpacity(){ localStorage.setItem('bgOpacity', this.bgOpacity); },
    saveBgBlur(){ localStorage.setItem('bgBlur', this.bgBlur); },

    /* ========== 个人资料 / 勋章 ========== */
    changeAvatar(e){
      const f=e.target.files[0]; if(!f) return;
      const r=new FileReader(); r.onload=ev=>localStorage.setItem('avatar-'+this.currentUser, ev.target.result); r.readAsDataURL(f);
    },
    updateDisplayName(){ localStorage.setItem('displayName_' + this.currentUser, this.localDisplayName); },
    openBadgeModal(){ this.showBadgeModal=true; },
    closeBadgeModal(){ this.showBadgeModal=false; },
    confirmBadge(){
      localStorage.setItem('wear_' + this.currentUser, this.selectedBadge);
      alert('勋章已更换'); this.closeBadgeModal();
    },

    /* ========== 密码修改 ========== */
    openPasswordModal(){ this.showPasswordModal=true; this.oldPassword=this.newPassword=this.confirmPassword=''; },
    closePasswordModal(){ this.showPasswordModal=false; },
    async changePassword() {
      const key     = `password_${this.currentUser}`;
      const saltKey = `salt_${this.currentUser}`;
      const oldPwd  = this.oldPassword;
      const newPwd  = this.newPassword;
      const confirm = this.confirmPassword;

      const storedHash = localStorage.getItem(key);
      const salt       = localStorage.getItem(saltKey);
      if (!storedHash || !salt) {
        return alert('请先登录并设置密码');
      }

      const sha256Hex = async (str) => {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2,'0')).join('');
      };

      const saltedHash = async (pwd) => {
        const h1 = await sha256Hex(pwd + salt);
        return sha256Hex(h1 + salt);
      };

      const oldHash = await saltedHash(oldPwd);
      if (oldHash !== storedHash) {
        return alert('旧密码不正确！');
      }

      if (newPwd !== confirm) {
        return alert('两次输入的新密码不一致！');
      }
      if (newPwd.length < 4) {
        return alert('新密码长度至少 4 位！');
      }

      const newHash = await saltedHash(newPwd);
      localStorage.setItem(key, newHash);
      alert('密码修改成功！');
      this.closePasswordModal();
    },

    /* ========== Admin 密码设置 ========== */
    openAdminPwdModal(uid) {
      this.adminTargetUid      = uid;
      this.adminNewPassword    = '';
      this.adminPwdModalVisible = true;
    },
    closeAdminPwdModal() {
      this.adminPwdModalVisible = false;
    },
    addAllowedUid() {
      const u = this.newAdminUid.trim();
      if (!u) return alert('请输入 UID');
      const list = Array.from(new Set([...this.allowedUids, u])); // ← 用当前响应式数据
      setAllowedUids(list);              // 写入 localStorage
      this.allowedUids = list;           // 更新本地响应式变量（自动刷新模板）
      this.newAdminUid = '';             // 清空输入框
      alert(`已添加 UID：${u}`);
    },

    removeAllowedUid(uid) {
      if (!confirm(`确认移除 ${uid}？`)) return;
      const list = this.allowedUids.filter(u => u !== uid); // ← 用当前响应式数据
      setAllowedUids(list);              // 写入 localStorage
      this.allowedUids = list;           // 更新本地响应式变量
      alert(`已移除 ${uid}`);
    },

    resetPassword(uid) {
      if (!confirm(`将清除 ${uid} 的本地密码，下次登录需重设？`)) return;
      localStorage.removeItem(`password_${uid}`);
      localStorage.removeItem(`salt_${uid}`);
      alert(`已清除 ${uid} 的本地密码`);
    },


    async confirmAdminSetPassword() {
      if (this.adminNewPassword.length < 4) {
        return alert('新密码长度至少 4 位');
      }
      // 假设你已有 getOrCreateSalt(uid) 和 saltedHash(pwd, salt) 工具
      const salt = getOrCreateSalt(this.adminTargetUid);
      const hash = await saltedHash(this.adminNewPassword, salt);
      localStorage.setItem(`password_${this.adminTargetUid}`, hash);
      alert('管理员密码已设置');
      this.closeAdminPwdModal();
    },


    /* ========== 桌宠拖拽 ========== */
    dragPet(e){
      const pet=this.$refs.pet;
      const ox=e.offsetX, oy=e.offsetY;
      document.onmousemove=ev=>{ pet.style.left = (ev.pageX - ox) + 'px'; pet.style.top = (ev.pageY - oy) + 'px'; };
      document.onmouseup  =()=> document.onmousemove = null;
    },

    /* ========== 主题 ========== */
    toggleTheme(){
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.body.classList.toggle('dark', this.theme === 'dark');
      localStorage.setItem('theme', this.theme);
    }
  },

  mounted(){
    document.body.classList.toggle('dark', this.theme === 'dark');
  }
};
</script>
<style>
:root{
  --bg-light:#f5f5f5;--bg-dark:#0f0f11;
  --card-light:rgba(255,255,255,.75);--card-dark:rgba(30,30,31,.55);
  --text-light:#333;--text-dark:#d2d2d2;
  --primary:#4a90e2;--accent:#e91e63;
  --radius:14px;--blur:16px;--glass-border:1px solid rgba(0,0,0,0.1);
  --login-bg:#f5f5f5;--login-text:#333;--login-border:rgba(0,0,0,0.1);
  --bg-opacity:.35;--bg-blur:4px;
}
body.dark{
  background:var(--bg-dark);color:var(--text-dark);
  --login-bg:#1c1c1c;--login-text:#d2d2d2;--login-border:rgba(255,255,255,0.1);
}
html,body{margin:0;padding:0;height:100%;font-family:Inter,\"PingFang SC\",sans-serif;transition:.3s background-color,.3s color}
a{color:inherit;text-decoration:none;cursor:pointer}
.hidden{display:none}

/* 背景层 */
#bgLayer{position:fixed;inset:0;z-index:-1;pointer-events:none;background:center/cover no-repeat;
  opacity:var(--bg-opacity);filter:blur(var(--bg-blur));transition:.3s opacity,.3s filter}

/* 导航栏 */
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;
  padding:10px 22px;background:rgba(255,255,255,0.15);backdrop-filter:blur(var(--blur));border-bottom:var(--glass-border)}
body.dark nav{background:rgba(0,0,0,0.18);border-bottom:1px solid rgba(255,255,255,0.1)}
.logo{font-weight:700;font-size:20px}
.menu{display:flex;gap:18px;align-items:center}
.menu a{padding:6px 12px;border-radius:var(--radius);transition:.25s background}
.menu a:hover{background:rgba(0,0,0,0.08)}
body.dark .menu a:hover{background:rgba(255,255,255,0.12)}
.red{width:8px;height:8px;border-radius:50%;background:var(--accent);margin-left:4px}
/* ---------- 玻璃背景·系统原生下拉 ---------- */
.np-toolbar select,
.setting-item select{
  /* 半透明卡片背景 + 毛玻璃，别动箭头 */
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur)/2));
  border: var(--glass-border);
  border-radius: var(--radius);

  padding: 6px 12px;          /* 正常左右内边距 */
  font-size: 14px;
  color: var(--text-light);   /* 白天深灰字 */
  cursor: pointer;
}

/* 深色主题：保持同色系即可，别再灰白 */
body.dark .np-toolbar select,
body.dark .setting-item select{
  background: var(--card-dark);  /* 半透明黑 */
  color: var(--text-dark);       /* 亮灰字（易读） */
}
/* 深色模式：给 option 单行上色 */
body.dark .np-toolbar select option,
body.dark .setting-item select option {
  background-color: rgba(30,30,31,0.9);  /* 深底 */
  color: #f0f0f0;                         /* 浅字 */
}


/* 获得焦点时给 1px 黑边就够 */
.np-toolbar select:focus,
.setting-item select:focus{
  outline: none;
  border: 1px solid #000;
}

/* 按钮 */
.btn-ghost,.btn-publish{display:inline-flex;align-items:center;gap:6px;padding:6px 20px;
  font-size:14px;border-radius:var(--radius);cursor:pointer;transition:.25s background,.2s transform}
.btn-ghost{background:var(--card-light);border:var(--glass-border);backdrop-filter:blur(calc(var(--blur)/2))}
body.dark .btn-ghost{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.15)}
.btn-ghost:hover{background:rgba(0,0,0,0.08)}
body.dark .btn-ghost:hover{background:rgba(255,255,255,0.15)}
.btn-publish{background:#333;color:#fff;border:none}
.btn-publish:hover{transform:scale(1.03);background:#2a2a2a}
body.dark .btn-publish{background:#444}
body.dark .btn-publish:hover{background:#3a3a3a}

/* 统一卡片 */
.card{background:var(--card-light);backdrop-filter:blur(calc(var(--blur)/2));
  border-radius:var(--radius);border:var(--glass-border);box-shadow:0 6px 18px rgba(0,0,0,0.1);padding:18px}
body.dark .card{background:var(--card-dark);box-shadow:0 6px 18px rgba(0,0,0,0.45)}

/* 页面标题 */
h2.big{margin:70px 0 22px;font-size:26px}

/* 投稿 */
#moments{padding:40px 8%}
.np-top{display:flex;flex-direction:column;gap:8px}
.np-toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.np-top textarea{resize:none;height:78px;border-radius:var(--radius);border:var(--glass-border);
  background:var(--card-light);backdrop-filter:blur(calc(var(--blur)/2));padding:10px;font-size:14px;width:100%}
body.dark .np-top textarea{background:var(--card-dark);color:var(--text-dark)}
.char-count{font-size:12px;color:#888}
.np-preview{display:flex;gap:8px;overflow-x:auto}
.np-preview img{width:70px;height:50px;border-radius:8px;object-fit:cover}
.np-preview .remove{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;
  background:rgba(0,0,0,0.6);color:#fff;font-size:14px;line-height:18px;text-align:center;cursor:pointer;
  transition:background .2s}
.np-preview .remove:hover{background:rgba(0,0,0,0.85)}
.np-preview .thumb {
  position: relative;
}

/* 动态列表 */
#moments-list{display:flex;flex-direction:column;gap:26px}
.post .photos{display:flex;gap:8px;margin-top:8px;overflow-x:auto}
.post .photos img{width:96px;height:68px;border-radius:8px;object-fit:cover}
.post .body p{margin:0 0 6px;white-space:pre-wrap;line-height:1.5}
.post small{display:block;margin-top:4px;font-size:12px;color:#888}
.actions{display:flex;gap:8px;font-size:13px;margin-top:8px;align-items:center;color:var(--primary)}
.actions svg{width:18px;height:18px;fill:currentColor}
.more{cursor:pointer;font-size:18px;padding:2px 6px;border-radius:50%;transition:.2s background}
.more:hover{background:rgba(0,0,0,0.08)}

/* 评论 */
.comments{margin-top:8px;padding-top:4px;border-top:1px solid rgba(0,0,0,0.1)}
.comment{display:flex;justify-content:space-between;align-items:center;margin:4px 0;padding:6px 8px;
  border-radius:6px;background:rgba(0,0,0,0.03);font-size:13px}
body.dark .comment{background:rgba(255,255,255,0.05)}
.comment-edit,.comment-delete{cursor:pointer;padding:2px 6px;border-radius:4px;transition:background .2s}
.comment-edit:hover,.comment-delete:hover{background:rgba(0,0,0,0.1)}
.c-input{display:flex;gap:8px;margin-top:8px}
.c-input input{flex:1;padding:6px 10px;border-radius:var(--radius);border:var(--glass-border);
  background:var(--card-light);backdrop-filter:blur(calc(var(--blur)/2));font-size:14px;transition:box-shadow .2s}
body.dark .c-input input{background:var(--card-dark);color:var(--text-dark)}
.c-input input:focus {
  outline: none;        /* 去掉浏览器默认的白色 outline */
  box-shadow: none;     /* 关闭原来的阴影 */
  border: 1px solid #000; /* 只要 1px 黑色边框 */
}

/* 相册 */
#album{padding:40px 8%}
.album-tabs{display:flex;gap:16px;margin-bottom:18px}
.album-tabs button{background:none;border:none;font-weight:600;cursor:pointer;font-size:15px;padding:6px 10px;border-radius:var(--radius);transition:.25s background}
.album-tabs .on{background:rgba(0,0,0,0.08)}
body.dark .album-tabs button:hover{background:rgba(255,255,255,0.1)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:18px}
.photo{border-radius:var(--radius);overflow:hidden;position:relative;cursor:pointer}
.photo img{width:100%;height:120px;object-fit:cover;transition:.3s transform}
.photo:hover img{transform:scale(1.05)}
.photo span{position:absolute;bottom:6px;left:6px;background:rgba(0,0,0,0.45);color:#fff;font-size:12px;padding:2px 6px;border-radius:var(--radius)}

/* 设置 */
#settings{padding:40px 8%}
fieldset{border:none;padding:0;margin:0 0 24px}
legend{font-weight:600;font-size:15px;margin-bottom:8px}
.setting-item{display:flex;justify-content:space-between;align-items:center;margin:12px 0}
.setting-item + .setting-item{border-top:1px solid rgba(0,0,0,0.1);padding-top:12px}
body.dark .setting-item + .setting-item{border-top:1px solid rgba(255,255,255,0.1)}
.setting-item input[type=text]{width:60%;padding:6px;border-radius:var(--radius);border:var(--glass-border);
  background:var(--card-light);backdrop-filter:blur(calc(var(--blur)/2))}
body.dark .setting-item input[type=text]{background:var(--card-dark);color:var(--text-dark)}
/* 重写所有文字输入框和多行输入框的聚焦效果 */
.setting-item input[type="text"]:focus,
.np-top textarea:focus {
  outline: none;        /* 去掉默认 outline */
  box-shadow: none;     /* 去掉阴影 */
  border: 1px solid #000; /* 1px 黑色实线边框 */
}

/* Badge */
.badge{font-size:10px;padding:2px 4px;border-radius:4px;margin-left:4px;display:inline-block;min-width:40px;text-align:center;color:#fff}
.badge.best{background:linear-gradient(270deg,#4a90e2,#e91e63,#4a90e2);background-size:400% 400%;animation:gradient 10s ease infinite}
.badge.catgirl{background:linear-gradient(135deg,#ff87c3,#ffb6c1)}
.badge.badge-none{background:none;border:1px dashed #aaa;color:#aaa}
@keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.admin-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-uid {
  min-width: 100px;
  font-weight: bold;
}

.admin-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Modal 通用 */
.modal{z-index:9999;position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;justify-content:center;align-items:center;opacity:0;visibility:hidden;transition:opacity .25s ease}
.modal.show{opacity:1;visibility:visible}
.box{background:var(--card-light);backdrop-filter:blur(var(--blur));border:var(--glass-border);border-radius:var(--radius);max-width:600px;width:90%;max-height:90vh;overflow:auto;padding:20px;position:relative}
body.dark .box{background:var(--card-dark);border:1px solid rgba(255,255,255,0.2)}
.close{position:absolute;top:10px;right:16px;font-size:24px;cursor:pointer}

/* 桌宠 */
#pet svg{width:100%;animation:breathe 3s ease-in-out infinite}
@keyframes breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}

/* 过渡 */
.fade-enter-active,.fade-leave-active{transition:opacity .3s ease}
.fade-enter,.fade-leave-to{opacity:0}
</style>
