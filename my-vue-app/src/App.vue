<template>
  <div>
    <!-- 未登录状态下只渲染登录 Modal -->
    <transition name="fade">
      <div v-if="!currentUser" id="loginModal" class="modal show">
        <div class="box" style="text-align:center; max-width:340px">
          <h3>选择登录身份</h3>
          <div class="avatar-container" style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
            <div class="avatar" @click="selectUser('Furinya')">
              <img src="https://placehold.co/90x90?text=F" alt="Furinya">
              <div>Furinya</div>
            </div>
            <div class="avatar" @click="selectUser('离')">
              <img src="https://placehold.co/90x90?text=离" alt="离">
              <div>离</div>
            </div>
          </div>
          <div v-if="selectedUser">
            <input type="password" v-model="loginPassword" placeholder="请输入密码" style="width:100%; padding:8px; border-radius:8px; border:1px solid #ccc;">
            <button id="loginConfirmBtn" class="btn-publish" style="margin-top:12px;" @click="confirmLogin">登录</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 登录后渲染主要内容，退出时 DOM 被销毁 -->
    <div v-if="currentUser">
      <!-- 星空背景，仅在暗黑模式下显示 -->
      <canvas id="starCanvas" ref="starCanvas"></canvas>
      <!-- 落樱背景，仅在明亮模式下显示 -->
      <canvas id="sakuraCanvas" ref="sakuraCanvas"></canvas>
      
      <!-- 导航栏 -->
      <nav>
        <div class="logo">把回忆拼好给你</div>
        <div class="menu">
          <a href="#moments" id="nav-moments" @click.prevent="scrollTo('moments')">
            动态<span id="nav-dot" class="red" :class="{ hidden: !hasUnread }"></span>
          </a>
          <a href="#album" @click.prevent="scrollTo('album')">相册</a>
          <a href="#settings" @click.prevent="scrollTo('settings')">设置</a>
          <span id="header-name" style="font-weight:600;">{{ localDisplayName }}</span>
          <a id="logout" class="btn-ghost" @click="logout">退出</a>
          <button id="themeBtn" class="btn-ghost" @click="toggleTheme">
            <svg v-if="theme==='light'" id="sun" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/>
            </svg>
            <svg v-else id="moon" viewBox="0 0 24 24">
              <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>
            </svg>
          </button>
        </div>
      </nav>
      
      <!-- 投稿区域 -->
      <section id="moments">
        <h2 class="big">投稿</h2>
          <!-- 文本 + 工具栏 -->
          <div class="np-top">
            <textarea
              v-model="newPostText"
              placeholder="说点什么…"
              maxlength="2000"
              @input="autoResize($event)" />

            <div class="np-toolbar">
              <!-- 实时字数 -->
              <span class="char-count">{{ newPostText.length }}/2000</span>

              <!-- 选择地点 -->
              <select v-model="newPostPlace">
                <option value="">无地点</option>
                <option>蒙德</option>
                <option>璃月</option>
                <option>稻妻</option>
                <option>须弥</option>
                <option>枫丹</option>
                <option>纳塔</option>
              </select>

              <!-- 上传按钮 -->
              <label class="btn-ghost upload-btn">
                <svg viewBox="0 0 24 24">
                  <path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <input type="file" accept="image/*" multiple @change="handlePostImages">
              </label>

              <!-- 发布 -->
              <button id="publish" class="btn-publish" @click="publishPost">发布</button>
            </div>
          </div>

          <!-- 预览并可删除 -->
          <div v-if="draftImgs.length" class="np-preview">
            <div v-for="(img, i) in draftImgs" :key="i" class="thumb">
              <img :src="img" />
              <span class="remove" @click="removeDraft(i)">×</span>
            </div>
        </div>

        
        <h2 class="big">动态</h2>
        <div id="moments-list">
          <div v-for="post in posts" :key="post.id" class="post card">
            <div class="head" style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div :style="{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'url(' + getAvatar(post.uid) + ') center/cover'
                }"></div>
                <b>{{ getDisplayName(post.uid) }}</b>
                <span v-html="badgeHTML(post.uid)"></span>
                <span class="red" v-if="!isRead(post.id) && post.uid !== currentUser"></span>
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:12px">{{ new Date(post.ts).toLocaleTimeString() }}</span>
                <span v-if="post.uid === currentUser" class="more" @click="deletePost(post)">⋯</span>
              </div>
            </div>
            <div class="body">
              <p>{{ post.txt }}</p>
              <small>{{ new Date(post.ts).toLocaleDateString() }}{{ post.place ? ' · ' + post.place : '' }}</small>
            </div>
            <div class="photos">
              <img v-for="(img, i) in post.imgs" :key="i" :src="img" @click="openModal(img, formatMeta(post))">
            </div>
            <div class="actions">
              <svg viewBox="0 0 24 24">
                <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z m0 12a5 5 0 110-10 5 5 0 010 10z"/>
              </svg>
              <span>{{ post.views }}</span>
            </div>
            <div class="comments">
              <div v-for="(c, idx) in post.cmts" :key="idx" class="comment">
                <div class="comment-left">
                  <span class="comment-display">{{ c.who }}: {{ c.txt }}</span>
                </div>
                <div class="comment-right">
                  <span v-if="c.who === currentUser" class="comment-edit" @click="editComment(post, idx)">✎</span>
                  <span v-if="c.who === currentUser" class="comment-delete" @click="deleteComment(post, idx)">×</span>
                  <span v-else class="comment-author">{{ c.who }}</span>
                </div>
              </div>
              <div class="c-input">
                <input type="text" v-model="newComment[post.id]" placeholder="评论...">
                <button class="btn-publish" style="font-size:13px" @click="sendComment(post)">发送</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 相册区域 -->
      <section id="album">
        <h2 class="big">相册</h2>
        <div class="album-tabs">
          <button :class="{ on: albumMode==='time' }" @click="albumMode='time'">按时间</button>
          <button :class="{ on: albumMode==='region' }" @click="albumMode='region'">按地区</button>
        </div>
        <div id="album-grid" class="grid">
          <template v-for="(group, key) in groupedPhotos" :key="key">
            <h4 style="grid-column:1/-1; margin:4px 0 6px">{{ key }}</h4>
            <div v-for="(photo, i) in group" :key="i" class="photo" @click="openModal(photo.url, photo.meta)">
              <img :src="photo.url">
              <span>{{ photo.place }}</span>
            </div>
          </template>
        </div>
        <div id="album-empty" class="hidden" style="text-align:center; margin-top:30px; color:#888" v-if="allPhotos.length===0">
          暂无照片，快去上传吧~
        </div>
      </section>
      
      <!-- 设置区域 -->
      <section id="settings">
        <h2 class="big">设置</h2>
        <div class="card">
          <fieldset>
            <legend>外观</legend>
            <div class="setting-item">
              <span>暗黑模式</span>
              <input type="checkbox" id="theme-toggle" :checked="theme==='dark'" @change="toggleTheme">
            </div>
          </fieldset>
          <fieldset>
            <legend>桌宠 / LLM</legend>
            <div class="setting-item">
              <span>显示桌宠</span>
              <input type="checkbox" id="pet-toggle" v-model="petEnabled">
            </div>
            <div class="setting-item">
              <span>桌宠类型</span>
              <!-- 下拉菜单：选择桌宠类型 -->
              <select id="pet-type" v-model="petType">
                <option value="cat">猫娘</option>
                <option value="bird">魈鸟</option>
              </select>
            </div>
            <div class="setting-item">
              <span>启用 LLM</span>
              <input type="checkbox" id="ai-toggle" v-model="llmEnabled">
            </div>
            <div class="setting-item">
              <span id="prompt-label">桌宠 Prompt</span>
              <input id="pet-prompt" v-model="petPrompt">
            </div>
          </fieldset>
          <fieldset>
            <legend>账户</legend>
            <div class="setting-item">
              <span>头像</span>
              <div class="avatar-group">
                <label class="btn-ghost upload-btn">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <input id="avatar-input" type="file" accept="image/*" @change="changeAvatar">
                </label>
                <img :src="getAvatar(currentUser)" alt="Avatar" style="width:40px; height:40px; border-radius:50%;">
              </div>
            </div>
            <div class="setting-item">
              <span>我的昵称</span>
              <input id="name-me" type="text" v-model="localDisplayName" @input="updateDisplayName">
            </div>
            <div class="setting-item">
              <span>更改密码</span>
              <button id="changePasswordBtn" class="btn-ghost" @click="openPasswordModal">更改密码</button>
            </div>
          </fieldset>
          <fieldset id="badge-field">
            <legend>勋章</legend>
            <div id="currentBadgeDisplay" class="setting-item" style="flex-direction: row; align-items: center;">
              <button id="changeBadgeBtn" class="btn-ghost" @click="openBadgeModal">更换勋章</button>
            </div>
          </fieldset>
        </div>
      </section>
      
      <!-- 勋章 Modal -->
      <div v-if="showBadgeModal" id="badgeModal" class="modal show">
        <div class="box">
          <span class="close" @click="closeBadgeModal">×</span>
          <h3>选择勋章</h3>
          <div id="badgeOptions" style="margin:10px 0;">
            <label v-for="badge in allowedBadges" :key="badge.id" style="display:flex; align-items:center; gap:6px; margin:4px 0">
              <input type="radio" name="wear" :value="badge.id" v-model="selectedBadge">
              <span v-if="badge.id==='none'" class="badge badge-none">{{ badge.name }}</span>
              <span v-else-if="badge.id==='best'" class="badge best">{{ badge.name }}</span>
              <span v-else-if="badge.id==='catgirl'" class="badge catgirl">{{ badge.name }}</span>
              <span v-else class="badge">{{ badge.name }}</span>
            </label>
          </div>
          <button id="confirmBadge" class="btn-publish" style="margin-top:12px;" @click="confirmBadge">确认</button>
        </div>
      </div>
      
      <!-- 密码修改 Modal -->
      <div v-if="showPasswordModal" id="passwordModal" class="modal show">
        <div class="box" style="text-align:center; max-width:340px">
          <span class="close" @click="closePasswordModal">×</span>
          <h3>更改密码</h3>
          <div style="margin-top:16px;">
            <input type="password" v-model="oldPassword" placeholder="旧密码" style="width:100%; padding:8px; border-radius:8px; border:1px solid #ccc; margin-bottom:8px;">
            <input type="password" v-model="newPassword" placeholder="新密码" style="width:100%; padding:8px; border-radius:8px; border:1px solid #ccc; margin-bottom:8px;">
            <input type="password" v-model="confirmPassword" placeholder="确认新密码" style="width:100%; padding:8px; border-radius:8px; border:1px solid #ccc; margin-bottom:8px;">
            <button id="confirmChangePasswordBtn" class="btn-publish" style="margin-top:12px;" @click="changePassword">确认更改</button>
          </div>
        </div>
      </div>
      
      <!-- 桌宠 -->
      <div id="pet" ref="pet" v-if="petEnabled"
           style="position: fixed; right: 24px; bottom: 24px; width: 90px; user-select: none; cursor: move; z-index: 90;"
           @mousedown="dragPet">
        <div v-html="petSVG"></div>
      </div>
      
      <footer style="text-align:center; padding:24px 0; font-size:13px; color:#777">
        © 2025 把回忆拼好给你
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      // 全局数据（注意：仅在用户登录后才需要保留）
      posts: JSON.parse(localStorage.getItem('posts') || '[]'),
      currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
      theme: localStorage.getItem('theme') || 'light',
      // 登录相关
      selectedUser: null,
      loginPassword: '',
      // 投稿相关
      newPostText: '',
      newPostPlace: '',
      draftImgs: [],
      // 评论临时存储
      newComment: {},
      // Modal 显示状态
      showBadgeModal: false,
      showPasswordModal: false,
      showModal: false,
      modalSrc: '',
      modalMeta: '',
      // 设置数据
      petEnabled: true,
      petType: 'cat',
      llmEnabled: true,
      petPrompt: '喵～ 记得喝水喔！',
      localDisplayName: '',
      // Badge 及密码部分
      selectedBadge: localStorage.getItem('wear_' + (JSON.parse(localStorage.getItem('currentUser')) || '')) || 'none',
      BADGES: [
        { id: 'none', name: '不佩戴' },
        { id: 'best', name: '最好的大佬' },
        { id: 'catgirl', name: '你才是猫娘' }
      ],
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      // 已读标记
      readIds: new Set(JSON.parse(localStorage.getItem('readIds_' + (JSON.parse(localStorage.getItem('currentUser')) || '')) || '[]')),
      // 相册模式
      albumMode: 'time',
      // 新增安全状态：退出动画标识（可根据需要使用）
      isLoggingOut: false
    }
  },
  computed: {
    displayName() {
      if (!this.currentUser) return '';
      return localStorage.getItem('displayName_' + this.currentUser) || this.currentUser;
    },
    allPhotos() {
      let photos = [];
      this.posts.forEach(post => {
        post.imgs.forEach(url => {
          photos.push({
            url,
            place: post.place || '未知',
            date: new Date(post.ts).toISOString().slice(0,10)
          });
        });
      });
      return photos;
    },
    groupedPhotos() {
      let groups = {};
      this.allPhotos.forEach(photo => {
        const key = this.albumMode === 'time' ? photo.date.slice(0,7) : photo.place;
        if (!groups[key]) groups[key] = [];
        groups[key].push({ ...photo, meta: `${photo.date} · ${photo.place}` });
      });
      return groups;
    },
    allowedBadges() {
      return this.BADGES.filter(b => {
        if (b.id === 'best') return this.currentUser === '离';
        return true;
      });
    },
    petSVG() {
      if (this.petType === 'bird') {
        return `<svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="55" fill="#cdeffd" stroke="#333" stroke-width="3"/>
                  <path d="M40 70 Q60 90 80 70" stroke="#333" stroke-width="5" fill="none" stroke-linecap="round"/>
                  <circle cx="45" cy="55" r="8"/>
                  <circle cx="75" cy="55" r="8"/>
                </svg>`;
      } else {
        return `<svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="55" fill="#ffe4e1" stroke="#333" stroke-width="3"/>
                  <circle cx="45" cy="50" r="10"/>
                  <circle cx="75" cy="50" r="10"/>
                  <path d="M45 80 Q60 95 75 80" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/>
                </svg>`;
      }
    },
    hasUnread() {
      return this.posts.some(post => !this.readIds.has(post.id) && post.uid !== this.currentUser);
    },
     
  },
  methods: {
    badgeHTML(uid) {
      const m = localStorage.getItem('wear_' + uid);
      if (!m || m === '"none"' || m === 'none') return "";
      let badgeValue = m;
      try {
        badgeValue = JSON.parse(m);
      } catch(e) { }
      const badge = this.BADGES.find(b => b.id === badgeValue);
      if (!badge) return "";
      if (badge.id === 'best') {
        return `<span class="badge best">${badge.name}</span>`;
      } else if (badge.id === 'catgirl') {
        return `<span class="badge catgirl">${badge.name}</span>`;
      } else {
        return `<span class="badge">${badge.name}</span>`;
      }
    },
    storeSet(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    scrollTo(section) {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    getAvatar(uid) {
      return uid ? localStorage.getItem('avatar-' + uid) || 'https://placehold.co/60' : '';
    },
    getDisplayName(uid) {
      return localStorage.getItem('displayName_' + uid) || uid;
    },
    logout() {
      // 触发退出动画（如果需要）后再清理敏感数据
      this.isLoggingOut = true;
      setTimeout(() => {
        localStorage.removeItem('currentUser');
        // 可清理更多存储于 localStorage 中的用户相关数据
        // 如：localStorage.removeItem('displayName_' + this.currentUser)
        this.currentUser = null;
        // 清理内存中的敏感数据
        this.posts = [];
        this.localDisplayName = '';
        this.readIds = new Set();
        this.isLoggingOut = false;
      }, 300); // 300 毫秒，与 CSS 过渡时间一致
    },
    selectUser(user) {
      this.selectedUser = user;
      this.loginPassword = '';
    },
    confirmLogin() {
      let storedPwd = localStorage.getItem('password_' + this.selectedUser);
      if (!storedPwd) {
        storedPwd = JSON.stringify("123456");
        localStorage.setItem('password_' + this.selectedUser, storedPwd);
      }
      if (this.loginPassword === JSON.parse(storedPwd)) {
        this.currentUser = this.selectedUser;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.readIds = new Set(JSON.parse(localStorage.getItem('readIds_' + this.currentUser) || '[]'));
      } else {
        alert("密码不正确，请重试！");
      }
    },
    handlePostImages(e) {
      this.draftImgs = [];
      const files = Array.from(e.target.files).slice(0, 3);
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        this.draftImgs.push(url);
      });
    },
    removeDraft(idx) {
      this.draftImgs.splice(idx, 1);
    },
    autoResize(e) {
      // 可选：让 textarea 随输入自动长高
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    },

    publishPost() {
      if (!this.currentUser) return alert('请先登录');
      const txt = this.newPostText.trim();
      if (!txt && this.draftImgs.length === 0) return alert('写点文字或选张图片吧~');
      const post = {
        id: Date.now(),
        uid: this.currentUser,
        txt,
        place: this.newPostPlace,
        imgs: [...this.draftImgs],
        ts: Date.now(),
        views: 0,
        cmts: []
      };
      this.posts.unshift(post);
      this.storeSet('posts', this.posts.map(p => ({ ...p, imgs: [] })));
      this.newPostText = '';
      this.newPostPlace = '';
      this.draftImgs = [];
    },
    deletePost(post) {
      if (confirm('撤回这条动态？')) {
        this.posts = this.posts.filter(x => x.id !== post.id);
        this.storeSet('posts', this.posts.map(p => ({ ...p, imgs: [] })));
      }
    },
    isRead(postId) {
      return this.readIds.has(postId);
    },
    openModal(src, meta) {
      this.modalSrc = src;
      this.modalMeta = meta;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    formatMeta(post) {
      return `${new Date(post.ts).toISOString().slice(0,10)} · ${post.place || '未知'}`;
    },
    sendComment(post) {
      const text = this.newComment[post.id];
      if (!text || !text.trim()) return;
      post.cmts.push({ who: this.currentUser, txt: text.trim() });
      this.newComment[post.id] = '';
    },
    deleteComment(post, idx) {
      if (confirm('确定撤回该评论吗？')) {
        post.cmts.splice(idx, 1);
      }
    },
    editComment(post, idx) {
      const oldText = post.cmts[idx].txt;
      const newText = prompt('编辑评论：', oldText);
      if (newText !== null && newText.trim() !== '' && newText !== oldText) {
        post.cmts[idx].txt = newText.trim();
      }
    },
    openBadgeModal() {
      this.showBadgeModal = true;
    },
    closeBadgeModal() {
      this.showBadgeModal = false;
    },
    confirmBadge() {
      localStorage.setItem('wear_' + this.currentUser, this.selectedBadge);
      alert("勋章已更换");
      this.closeBadgeModal();
    },
    openPasswordModal() {
      this.showPasswordModal = true;
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },
    closePasswordModal() {
      this.showPasswordModal = false;
    },
    changePassword() {
      let storedPwd = localStorage.getItem('password_' + this.currentUser);
      if (!storedPwd) storedPwd = JSON.stringify("123456");
      if (this.oldPassword !== JSON.parse(storedPwd)) {
        alert("旧密码不正确！");
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        alert("两次输入的新密码不一致！");
        return;
      }
      if (!this.newPassword) {
        alert("新密码不能为空！");
        return;
      }
      localStorage.setItem('password_' + this.currentUser, JSON.stringify(this.newPassword));
      alert("密码修改成功！");
      this.closePasswordModal();
    },
    changeAvatar(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        localStorage.setItem('avatar-' + this.currentUser, ev.target.result);
      }
      reader.readAsDataURL(file);
    },
    updateDisplayName() {
      localStorage.setItem('displayName_' + this.currentUser, this.localDisplayName);
    },
    // 桌宠拖拽
    dragPet(e) {
      const pet = this.$refs.pet;
      let ox = e.offsetX, oy = e.offsetY;
      document.onmousemove = (ev) => {
        pet.style.left = (ev.pageX - ox) + 'px';
        pet.style.top = (ev.pageY - oy) + 'px';
      };
      document.onmouseup = () => {
        document.onmousemove = null;
      };
    },
    // 新版星空：分层视差 + 漫天流星
    initStarCanvas() {
      const canvas = this.$refs.starCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      // 配置
      const layerDefs = [
        { count: 80, size: 1.2, speed: 0.02 },   // 最远层
        { count: 60, size: 1.6, speed: 0.04 },
        { count: 40, size: 2.2, speed: 0.06 },   // 最近层
      ];
      let layers = [];
      let meteors = [];
      // 生成星星
      function genStars() {
        layers = layerDefs.map(def => {
          return Array.from({ length: def.count }).map(() => {
            return {
              x: Math.random(),
              y: Math.random(),
              size: (Math.random() * 0.5 + 0.5) * def.size,
              phase: Math.random() * Math.PI * 2,
              speed: (Math.random() * 0.5 + 0.5) * def.speed
            };
          });
        });
      }
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      function spawnMeteor() {
        const dir = Math.random() < 0.5 ? 1 : -1; // 左->右 或 右->左
        const x = dir === 1 ? -200 : canvas.width + 200;
        const y = Math.random() * canvas.height * 0.4;
        const len = Math.random() * 150 + 180;
        meteors.push({ x, y, len, dir, life: 0, speed: Math.random() * 6 + 8 });
      }
      function draw() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        const time = Date.now();
        // 绘制星星
        layers.forEach((stars, layerIdx) => {
          const depth = layerIdx / layerDefs.length; // 0 ~ 1
          stars.forEach(star => {
            star.x += star.speed * (1 - depth) / canvas.width; // 近层移动更快
            if (star.x > 1) star.x = 0;
            const alpha = 0.5 + 0.5 * Math.sin(time * 0.002 + star.phase);
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI*2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          });
        });
        ctx.globalAlpha = 1;
        // 流星
        if (meteors.length < 3 && Math.random() < 0.005) spawnMeteor();
        meteors = meteors.filter(m => m.life < 1.2);
        meteors.forEach(meteor => {
          meteor.life += 0.016;
          meteor.x += meteor.speed * meteor.dir;
          meteor.y += meteor.speed * 0.35;
          const tailX = meteor.x - meteor.dir * meteor.len;
          const tailY = meteor.y - meteor.len * 0.35;
          ctx.lineWidth = 2;
          const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, 'rgba(255,255,255,' + (1 - meteor.life) + ')');
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        });
        requestAnimationFrame(draw);
      }
      window.addEventListener('resize', resize);
      resize();
      genStars();
      draw();
    },
       // 明亮主题下的缓慢落樱
    initSakuraCanvas() {
      const canvas = this.$refs.sakuraCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const petals = [];

      /* ---------- 参数区 ---------- */
      const MAX = 120;            // 同屏最多花瓣
      const SPAWN = 550;          // 每朵生成间隔 ms
      const GRAVITY = 0.04;       // 基础重力
      const WIND_STRENGTH = 0.12; // 最大风速
      const FOCUS_Z = 0.5;        // 0~1，越小越“近景”
      /* --------------------------- */

      function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resize);
      resize();

      /* 生成单片花瓣 */
      function spawn() {
        const z = Math.random();       // 深度
        petals.push({
          x: Math.random() * canvas.width,
          y: -20,
          z,
          size: (10 + Math.random() * 15) * (0.4 + (1 - z) * 0.6),  // 远景更小
          vx: (Math.random() * 2 - 1) * WIND_STRENGTH,
          vy: 0.4 + Math.random() * 0.5,
          ay: GRAVITY * (0.6 + Math.random() * 0.8),
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.03,
          life: 0,
          extend: 1.8 + Math.random()*0.8,        // 长度比例
          bend:   (Math.random()-0.5) * 0.3,      // 左右弯曲
          flip:   Math.random() < 0.4 ? 1 : 0,    // 背面概率
        });
        if (petals.length > MAX) petals.shift();
      }

          /* ----------- 真·单瓣樱花 (tear‑drop + 缺口 + 高光) ----------- */
      function drawPetal(ctx, p) {
        /*
        * p.extend   决定长度 (1.8~2.6)
        * p.bend     决定左右弯 (‑0.3~0.3)
        * p.flip     0 或 1，用来随机区分“背面”
        */

        const w  = p.size;              // 基础宽
        const h  = p.size * p.extend;   // 细长
        const r1 = h * 0.18;            // 缺口半径

        ctx.save();

        /* 1️⃣ 透视 & 弯曲  */
        ctx.scale(1 + p.bend, 1);       // 左右弯
        if (p.flip) ctx.scale(1, -1);   // 翻背面

        /* 2️⃣ 填充渐变（正面更亮、背面暗） */
        const g = ctx.createLinearGradient(0, -h, 0, 0);
        if (!p.flip) {
          g.addColorStop(0,   'rgba(255,215,225,0.96)');
          g.addColorStop(0.7, 'rgba(247,165,195,0.88)');
        } else {
          g.addColorStop(0,   'rgba(240,150,180,0.75)'); // 背面略暗
          g.addColorStop(1,   'rgba(220,130,160,0.70)');
        }
        ctx.fillStyle = g;

        /* 3️⃣ 画瓣身 (两条二次 Bézier) */
        ctx.beginPath();
        ctx.moveTo(0, 0);                              // 底端
        ctx.quadraticCurveTo( w*0.85, -h*0.45, 0, -h); // 右缘
        ctx.quadraticCurveTo(-w*0.85, -h*0.45, 0, 0);  // 左缘
        ctx.closePath();
        ctx.fill();

        /* 4️⃣ 切顶部缺口 */
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(0, -h + r1*0.6, r1, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
      }



      /* 主循环 */
      let last = performance.now();
      function loop(now = performance.now()) {
        const dt = (now - last) / 16.67; // ~ 帧数归一化
        last = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 每隔 SPAWN ms 造一片
        if (now % SPAWN < 16) spawn();

        petals.forEach((p) => {
          // 物理
          p.vy += p.ay * dt;
          p.x  += p.vx * dt * 0.8;
          p.y  += p.vy * dt;
          p.rot += p.spin * dt;
          p.life += dt;

          // 超出底部 -> 回炉
          if (p.y - p.size > canvas.height) Object.assign(p, petals[0]), petals.shift();

          // 绘制，按深度模糊 & 透明
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          const alpha = 0.2 + (1 - p.z) * 0.8;
          ctx.globalAlpha = alpha;
          if (p.z < FOCUS_Z) {
            const blur = (1 - p.z / FOCUS_Z) * 3;
            ctx.filter = `blur(${blur}px)`;
          }
          drawPetal(ctx, p);
          ctx.restore();
        });

        requestAnimationFrame(loop);
      }
      loop();
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.body.classList.toggle('dark', this.theme === 'dark');
      if (this.theme === 'dark') {
        this.initStarCanvas();
        // 清掉落樱
        const sc = this.$refs.sakuraCanvas;
        sc && sc.getContext('2d').clearRect(0,0,sc.width,sc.height);
      } else {
        this.initSakuraCanvas();   // 切到白天就启动落樱
        // 清掉星空
        const st = this.$refs.starCanvas;
        st && st.getContext('2d').clearRect(0,0,st.width,st.height);
      }
    }

  },
    mounted() {
    document.body.classList.toggle('dark', this.theme === 'dark');
    if (this.theme === 'dark') {
      this.initStarCanvas();
    } else {
      this.initSakuraCanvas();   // 初次加载白天就启动落樱
    }
  }
}
</script>
<style>
/****  样式（保持不变，仅补充星空层次感） ****/
/* 全局变量：简约科技风，采用中性灰调 */
:root{--bg-light:#f5f5f5;--bg-dark:#0f0f11;--card-light:#ffffff;--card-dark:#1e1e1f;--text-light:#333;--text-dark:#d2d2d2;--primary:#4a90e2;--accent:#e91e63;--radius:14px;--glass-border:1px solid rgba(0,0,0,0.1);--blur:16px;--login-bg:#f5f5f5;--login-text:#333;--login-border:rgba(0,0,0,0.1);}body.dark{background:var(--bg-dark);color:var(--text-dark);--login-bg:#1c1c1c;--login-text:#d2d2d2;--login-border:rgba(255,255,255,0.1);}html,body{margin:0;padding:0;height:100%;font-family:Inter,"PingFang SC",sans-serif;transition:.3s background-color,.3s color}body{background:var(--bg-light);color:var(--text-light)}body.dark{background:var(--bg-dark);color:var(--text-dark)}a{color:inherit;text-decoration:none;cursor:pointer}
body.dark {
  background: var(--bg-dark);
  color: var(--text-dark);
  --login-bg: #1c1c1c;
  --login-text: #d2d2d2;
  --login-border: rgba(255, 255, 255, 0.1);
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Inter, "PingFang SC", sans-serif;
  transition: 0.3s background-color, 0.3s color;
}
body {
  background: var(--bg-light);
  color: var(--text-light);
}
body.dark {
  background: var(--bg-dark);
  color: var(--text-dark);
}
a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.hidden {
  display: none;
}

#starCanvas,#sakuraCanvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;display:none}body.dark #starCanvas{display:block}body:not(.dark) #sakuraCanvas{display:block}
body.dark #starCanvas {
  display: block;
}

/* 导航栏 */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 22px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(var(--blur));
  border-bottom: var(--glass-border);
}
body.dark nav {
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* LOGO */
.logo {
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.5px;
  text-align: left;
}

/* 菜单 */
.menu {
  display: flex;
  gap: 18px;
  align-items: center;
}
.menu a {
  padding: 6px 12px;
  border-radius: var(--radius);
  transition: 0.25s background;
}
.menu a:hover {
  background: rgba(0, 0, 0, 0.08);
}
body.dark .menu a {
  color: var(--text-dark);
}
.menu a.on {
  font-weight: 700;
  text-decoration: underline;
}

/* 小红点提示 */
.red {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  margin-left: 4px;
}

/* Ghost 按钮 */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 14px;
  border-radius: var(--radius);
  border: var(--glass-border);
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur) / 2));
  color: inherit;
  cursor: pointer;
  transition: 0.25s background;
}
.btn-ghost svg {
  width: 16px;
  height: 16px;
  pointer-events: none;
}
.btn-ghost:hover {
  background: rgba(0, 0, 0, 0.08);
}
body.dark .btn-ghost {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--text-dark);
}
body.dark .btn-ghost:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 发布按钮 */
.btn-publish {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 20px;
  font-size: 14px;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: 0.25s background, 0.25s transform;
  background: #333333;
  color: #ffffff;
}
.btn-publish:hover {
  transform: scale(1.03);
  background: #2a2a2a;
}
body.dark .btn-publish {
  background: #444444;
  color: #ffffff;
}
body.dark .btn-publish:hover {
  background: #3a3a3a;
}

/* 文件上传按钮 */
.upload-btn {
  position: relative;
  overflow: hidden;
}
.upload-btn input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* select 下拉菜单及 option */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 6px 30px 6px 12px;
  font-size: 14px;
  border-radius: var(--radius);
  border: var(--glass-border);
  background: var(--card-light);
  color: var(--text-light);
  max-width: 160px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23666' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px 6px;
  outline: none;
  backdrop-filter: blur(calc(var(--blur) / 2));
}
select::-ms-expand {
  display: none;
}
body.dark select {
  background: #333333;
  color: #f5f5f5;
  border: 1px solid #555;
  border-radius: var(--radius);
  padding: 6px 30px 6px 12px;
  font-size: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23f5f5f5' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px 6px;
  backdrop-filter: blur(calc(var(--blur) / 2));
}
body.dark select option {
  background: #333333;
  color: #f5f5f5;
}
body.dark .upload-btn {
  background: #333333;
  color: #f5f5f5;
  border: 1px solid #555;
  border-radius: var(--radius);
  padding: 6px 14px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(calc(var(--blur) / 2));
  cursor: pointer;
  transition: background 0.25s;
}
body.dark .upload-btn:hover {
  background: #444444;
}

/* 勋章样式 */
.badge {
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 4px;
  color: #fff;
  display: inline-block;
  min-width: 40px;
  text-align: center;
}
.badge.catgirl {
  background: linear-gradient(135deg, #ff87c3, #ffb6c1);
}
.badge.best {
  background: linear-gradient(270deg, #4a90e2, #e91e63, #4a90e2);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
  font-family: 'Orbitron', sans-serif;
  font-weight: normal;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
}
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.badge.badge-none {
  background: none;
  border: 1px dashed #aaa;
  color: #aaa;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 10px;
  min-width: 40px;
  text-align: center;
}

/* 卡片 */
.card {
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur) / 2));
  border-radius: var(--radius);
  border: var(--glass-border);
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  padding: 18px;
}
body.dark .card {
  background: var(--card-dark);
  box-shadow: 0 6px 18px rgba(0,0,0,0.5);
}

/* 页面标题 */
h2.big {
  margin: 70px 0 22px;
  font-size: 26px;
  padding-left: 0;
}

/* 投稿区域 */
#moments {
  padding: 40px 8%;
}
#new-post textarea {
  resize: none;
  height: 78px;
  border-radius: var(--radius);
  border: var(--glass-border);
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur) / 2));
  padding: 10px;
  font-size: 14px;
  width: 100%;
}
body.dark #new-post textarea {
  background: var(--card-dark);
  color: var(--text-dark);
}
#preview img {
  width: 70px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}
/* === 新投稿子组件 === */
.np-top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.np-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.char-count {
  font-size: 12px;
  color: #888;
}
.np-preview {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}
.np-preview .thumb {
  position: relative;
}
.np-preview img {
  width: 70px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}
.np-preview .remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}
.np-preview .remove:hover {
  background: rgba(0,0,0,0.85);
}
#moments-list {
  display: flex;
  flex-direction: column;
  gap: 26px;
}
.post .photos {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  overflow-x: auto;
}
.post .photos img {
  width: 96px;
  height: 68px;
  border-radius: 8px;
  object-fit: cover;
}
.post .body p {
  margin: 0 0 6px;
  white-space: pre-wrap;
  line-height: 1.5;
}
.post small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #888;
}
.actions {
  display: flex;
  gap: 8px;
  font-size: 13px;
  margin-top: 8px;
  align-items: center;
  color: var(--primary);
}
.actions svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
.more {
  cursor: pointer;
  font-size: 18px;
  padding: 2px 6px;
  border-radius: 50%;
  transition: 0.2s background;
}
.more:hover {
  background: rgba(0, 0, 0, 0.08);
}

/* 评论区域 */
.comments {
  margin-top: 8px;
  padding-top: 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.comment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.03);
  font-size: 13px;
}
body.dark .comment {
  background: rgba(255, 255, 255, 0.05);
}
.comment-left {
  flex: 1;
}
.comment-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.comment-author {
  font-weight: 600;
}
.comment-edit,
.comment-delete {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}
.comment-edit:hover,
.comment-delete:hover {
  background: rgba(0, 0, 0, 0.1);
}
.c-input {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.c-input input {
  flex: 1;
  padding: 6px 10px;
  border-radius: var(--radius);
  border: var(--glass-border);
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur) / 2));
  font-size: 14px;
  transition: box-shadow 0.2s;
}
body.dark .c-input input {
  background: var(--card-dark);
  color: var(--text-dark);
}
.c-input input:focus {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}
.c-input button {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: var(--radius);
  border: none;
  background: var(--ai-btn-bg);
  color: var(--ai-btn-color);
  cursor: pointer;
  transition: background 0.25s;
}
.c-input button:hover {
  background: var(--ai-btn-hover-bg);
}

/* 相册区域 */
#album {
  padding: 40px 8%;
}
.album-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
}
.album-tabs button {
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  padding: 6px 10px;
  border-radius: var(--radius);
  transition: 0.25s background;
}
.album-tabs .on {
  background: rgba(0, 0, 0, 0.08);
}
body.dark .album-tabs button {
  color: var(--text-dark);
}
body.dark .album-tabs button:hover {
  background: rgba(255, 255, 255, 0.1);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 18px;
}
.photo {
  border-radius: var(--radius);
  overflow: hidden;
  position: relative;
  cursor: pointer;
}
.photo img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  transition: 0.3s transform;
}
.photo:hover img {
  transform: scale(1.05);
}
.photo span {
  position: absolute;
  bottom: 6px;
  left: 6px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: var(--radius);
}

/* 设置区域 */
#settings {
  padding: 40px 8%;
}
fieldset {
  border: none;
  padding: 0;
  margin: 0 0 24px;
}
legend {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 8px;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}
.setting-item + .setting-item {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
}
body.dark .setting-item + .setting-item {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.setting-item input[type=text],
.setting-item textarea {
  width: 60%;
  max-width: fit-content;
  padding: 6px;
  border-radius: var(--radius);
  border: var(--glass-border);
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur) / 2));
  color: inherit;
}
body.dark .setting-item input[type=text],
body.dark .setting-item textarea {
  background: var(--card-dark);
  color: var(--text-dark);
}

/* Modal 窗口 */
.modal {
  z-index: 9999;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease;
}
.modal.show {
  opacity: 1;
  visibility: visible;
}
.box {
  background: var(--card-light);
  backdrop-filter: blur(var(--blur));
  border: var(--glass-border);
  border-radius: var(--radius);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  padding: 20px;
  position: relative;
}
body.dark .box {
  background: var(--card-dark);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.close {
  position: absolute;
  top: 10px;
  right: 16px;
  font-size: 24px;
  cursor: pointer;
}

/* 桌宠 / LLM */
#pet {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 90px;
  user-select: none;
  cursor: move;
  z-index: 90;
}
#pet svg {
  width: 100%;
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* 表单控件焦点状态 */
body.dark input:focus,
body.dark textarea:focus {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  outline: none;
}
body.dark select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}

/* 登录 Modal */
#loginModal {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}
#loginModal .box {
  background: var(--login-bg);
  color: var(--login-text);
  border: 1px solid var(--login-border);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 30px 20px;
  text-align: center;
  width: 350px;
}
#loginModal h3 {
  color: var(--primary);
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
}
#loginModal .avatar {
  margin: 0 10px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}
#loginModal .avatar:hover {
  border-color: var(--primary);
}
#loginModal .avatar img {
  width: 90px;
  height: 90px;
  object-fit: cover;
}
#loginModal .avatar + .avatar {
  margin-left: 20px;
}
#loginModal [data-user] {
  cursor: pointer;
}
#loginModal #loginPasswordDiv {
  margin-top: 20px;
}
#loginModal input[type="password"] {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  color: #333;
  font-size: 14px;
  margin-bottom: 12px;
}
#loginModal .btn-publish {
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}
#loginModal .btn-publish:hover {
  background: #357abd;
}

/* 勋章 Modal */
#badgeModal .box {
  animation: none;
}

/* 勋章 Toast */
#badgeToast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  display: none;
  z-index: 200;
  font-size: 14px;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 此处不再使用仅靠 blur 实现安全，敏感内容完全在 v-if 控制下销毁 */
</style>