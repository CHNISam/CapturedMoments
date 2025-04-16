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
        <div id="new-post" class="card" style="display:flex; flex-direction:column; gap:12px;">
          <textarea v-model="newPostText" placeholder="说点什么…"></textarea>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <!-- 下拉菜单：选择地点 -->
            <select v-model="newPostPlace">
              <option value="">无地点</option>
              <option>蒙德</option>
              <option>璃月</option>
              <option>稻妻</option>
              <option>须弥</option>
              <option>枫丹</option>
              <option>纳塔</option>
            </select>
            <label class="btn-ghost upload-btn">
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input type="file" accept="image/*" multiple @change="handlePostImages">
            </label>
            <button id="publish" class="btn-publish" @click="publishPost">发布</button>
          </div>
          <div id="preview" style="display:flex; gap:8px; overflow-x:auto;">
            <img v-for="(img, i) in draftImgs" :key="i" :src="img">
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
                  <span class="comment-text">{{ c.txt }}</span>
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
    }
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
    // 初始化星空 canvas 及动画
    initStarCanvas() {
      const canvas = this.$refs.starCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let stars = [];
      let meteor = null;
      let lastMeteorTime = Date.now();
      let astronomyBlend = 0;
      let targetAstronomy = 0;
      const rotationSpeed = 0.00015;
      function initStars(numStars = 400) {
        stars = [];
        const width = canvas.width;
        const height = canvas.height;
        const gridCount = Math.round(Math.sqrt(numStars));
        const cellW = width / gridCount;
        const cellH = height / gridCount;
        const astroCenter = { x: width / 2, y: height * 0.25 };
        for (let i = 0; i < gridCount; i++) {
          for (let j = 0; j < gridCount; j++) {
            let rx = j * cellW + Math.random() * cellW;
            let ry = i * cellH + Math.random() * cellH;
            const randomX = rx;
            const randomY = ry;
            const dx = (Math.random() - 0.5) * 0.005;
            const dy = (Math.random() - 0.5) * 0.005;
            const dX = rx - astroCenter.x, dY = ry - astroCenter.y;
            const distance = Math.sqrt(dX * dX + dY * dY);
            const astroAngle = Math.atan2(dY, dX);
            stars.push({
              randomX,
              randomY,
              dx,
              dy,
              distance,
              astroAngle,
              x: randomX,
              y: randomY,
              radius: Math.random() * 1.5 + 0.5,
              baseAlpha: Math.random() * 0.5 + 0.5,
              amplitude: Math.random() * 0.3,
              phase: Math.random() * Math.PI * 2,
              brightnessSpeed: Math.random() * 0.001 + 0.0005
            });
          }
        }
        meteor = null;
        lastMeteorTime = Date.now();
      }
      function spawnMeteor() {
        const width = canvas.width, height = canvas.height;
        const x0 = Math.random() * width;
        const y0 = Math.random() * height * 0.2;
        const angle = (Math.random() * 20 + 20) * Math.PI / 180;
        meteor = {
          x: x0,
          y: y0,
          len: Math.random() * 80 + 80,
          speed: Math.random() * 5 + 12,
          acceleration: Math.random() * 0.15 + 0.1,
          angle,
          life: 0,
          maxLife: Math.random() * 300 + 500,
          curveAmplitude: Math.random() * 1 + 0.5,
          curveFrequency: Math.random() * 0.002 + 0.001,
          curvePhase: Math.random() * Math.PI * 2
        };
      }
      function resize() {
        if (!canvas || !canvas.parentElement) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        initStars(400);
      }
      window.addEventListener('resize', resize);
      resize();
      function updateMode() {
        if (Math.random() < 0.0005) {
          targetAstronomy = 1;
        } else if (Math.random() < 0.0005) {
          targetAstronomy = 0;
        }
        const blendSpeed = 0.002;
        astronomyBlend += (targetAstronomy - astronomyBlend) * blendSpeed;
      }
      function animate() {
        const width = canvas.width, height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        const time = Date.now();
        updateMode();
        const astroCenter = { x: width / 2, y: height * 0.25 };
        stars.forEach(star => {
          star.randomX += star.dx;
          star.randomY += star.dy;
          if (star.randomX < 0) star.randomX = width;
          if (star.randomX > width) star.randomX = 0;
          if (star.randomY < 0) star.randomY = height;
          if (star.randomY > height) star.randomY = 0;
          star.astroAngle += rotationSpeed;
          let astroX = astroCenter.x + star.distance * Math.cos(star.astroAngle);
          let astroY = astroCenter.y + star.distance * Math.sin(star.astroAngle);
          star.x = (1 - astronomyBlend) * star.randomX + astronomyBlend * astroX;
          star.y = (1 - astronomyBlend) * star.randomY + astronomyBlend * astroY;
          const alpha = star.baseAlpha + star.amplitude * Math.sin(time * star.brightnessSpeed + star.phase);
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
          gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
          gradient.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        if (!meteor && time - lastMeteorTime > 15000 && Math.random() < 0.005) {
          spawnMeteor();
          lastMeteorTime = time;
        }
        if (meteor) {
          meteor.life += 16.67;
          const progress = meteor.life / meteor.maxLife;
          if (progress > 1) {
            meteor = null;
          } else {
            meteor.speed += meteor.acceleration;
            meteor.x += Math.cos(meteor.angle) * meteor.speed;
            meteor.y += Math.sin(meteor.angle) * meteor.speed;
            const offset = meteor.curveAmplitude * Math.sin(meteor.life * meteor.curveFrequency + meteor.curvePhase);
            meteor.x += -Math.sin(meteor.angle) * offset;
            meteor.y += Math.cos(meteor.angle) * offset;
            ctx.beginPath();
            const tailX = meteor.x - Math.cos(meteor.angle) * meteor.len;
            const tailY = meteor.y - Math.sin(meteor.angle) * meteor.len;
            const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255,255,255,${1 - progress})`);
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
          }
        }
        requestAnimationFrame(animate);
      }
      animate();
    },
    // 修复主题切换：更新 theme 变量并同步修改 body.classList
    toggleTheme() {
      this.theme = (this.theme === 'light') ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
      document.body.classList.toggle('dark', this.theme === 'dark');
    }
  },
  mounted() {
    // 仅当用户已登录时初始化敏感内容
    if (this.currentUser) {
      this.localDisplayName = this.displayName;
      document.body.classList.toggle('dark', this.theme === 'dark');
      this.initStarCanvas();
    }
  }
}
</script>

<style>
/* 全局变量：简约科技风，采用中性灰调 */
:root {
  --bg-light: #f5f5f5;              /* 明亮背景 */
  --bg-dark: #1c1c1c;               /* 暗黑背景 */
  --card-light: #ffffff;            /* 卡片明亮背景 */
  --card-dark: #2c2c2c;             /* 卡片暗黑背景 */
  --text-light: #333333;            /* 明亮文字色 */
  --text-dark: #cccccc;             /* 暗黑文字色 */
  --primary: #4a90e2;              /* 少量使用：科技蓝色 */
  --accent: #e91e63;               /* 辅助色（只做点缀，不作为主要元素） */
  --radius: 14px;
  --glass-border: 1px solid rgba(0, 0, 0, 0.1);
  --blur: 16px;
  --login-bg: #f5f5f5;
  --login-text: #333333;
  --login-border: rgba(0, 0, 0, 0.1);
}
body.dark {
  background: var(--bg-dark);
  color: var(--text-dark);
  --login-bg: #1c1c1c;
  --login-text: #cccccc;
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

/* 星空 Canvas */
#starCanvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  display: none;
}
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
