<!-- src/AppDesktop.vue -->
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
          <a
            href="#moments"
            @click.prevent="scrollTo('moments')"
            class="nav-item nav-item-moments"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 21"
            class="nav-icon"
            fill="none"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M10 10.743C7.69883 10.743 5.83333 8.87747 5.83333 6.5763C5.83333 4.27512 7.69883 2.40964 10 2.40964V10.743Z"
                stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"
              />
              <path
                d="M10 10.743C10 13.0441 8.1345 14.9096 5.83333 14.9096C3.53217 14.9096 1.66667 13.0441 1.66667 10.743H10Z"
                stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"
              />
              <path
                d="M10 10.743C10 8.44182 11.8655 6.57632 14.1667 6.57632C16.4679 6.57632 18.3333 8.44182 18.3333 10.743H10Z"
                stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"
              />
              <path
                d="M9.99999 10.743C12.3012 10.743 14.1667 12.6085 14.1667 14.9096C14.1667 17.2108 12.3012 19.0763 9.99999 19.0763V10.743Z"
                stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect
                  width="20"
                  height="20"
                  fill="currentColor"
                  transform="matrix(-1 0 0 1 20 0.742981)"
                />
              </clipPath>
            </defs>
          </svg>

            <span class="nav-label">
              动态
              <span class="red" :class="{ hidden: !hasUnread }"></span>
            </span>
          </a>

          <!-- 相册 -->
          <a
            href="#album"
            @click.prevent="scrollTo('album')"
            class="nav-item nav-item-album"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span class="nav-label">相册</span>
          </a>
          <!-- 投稿 -->
          <a
            href="#moments"
            @click.prevent="scrollTo('moments')"
            class="nav-item nav-item-submit"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l-5 5v4h4l5-5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 3a1.5 1.5 0 010 2.121L13.879 12.243a1.5 1.5 0 01-2.121 0L5 5.484a1.5 1.5 0 012.121-2.121l6.758 6.758a1.5 1.5 0 002.121 0L21 3z" />
          </svg>

            <span class="nav-label">投稿</span>
          </a>            
            <!-- ① 在 data() 里新增 navDropdownVisible -->
            <div class="nav-avatar" @click="toggleNavDropdown">
              <img
                  :src="getAvatar(currentUser)"
                  alt="Avatar"
                  class="avatar-img"
              />
              <div v-if="navDropdownVisible" class="nav-dropdown">
                  <button @click="scrollTo('settings')" class="dropdown-item">设置</button>
                  <button @click="logout"                 class="dropdown-item">退出</button>
              </div>
              </div>



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
          <div class="np-input-wrapper">
             <!-- ❶ 直接用一个 contenteditable 的渲染层当输入区 -->
             <div
              class="ta-preview"
              contenteditable="true"
              ref="postInput"
              @input="handleInput"
              @keyup="saveCaret"
              @mouseup="saveCaret"
              @keydown.enter.prevent="handlePostEnter"
              @keydown="handleKeydown"
              data-placeholder="说点什么..."
            ></div>

             <!-- ② 新的“悬浮”上传按钮，圆形、尺寸更小 -->
            <label class="upload-fab">
              <svg viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <input type="file" accept="image/*" multiple @change="handlePostImages"/>
            </label>
            <!-- === ① 触发按钮 === -->
            <button type="button"
                    class="emoji-fab"
                    @click="toggleStickerPicker">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"               
                stroke="currentColor"    
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- 外圆 -->
                <circle cx="12" cy="12" r="10" />
                <!-- 眼睛 -->
                <circle cx="9"  cy="10" r="1" />
                <circle cx="15" cy="10" r="1" />
                <!-- 微笑曲线 -->
                <path d="M8 16c1.333-1 2.667-1 4 0" />
              </svg>
            </button>
            <!-- === ② 贴图网格 === -->
            <div v-if="stickerPickerVisible" class="sticker-picker">
              <img v-for="s in displayedStickers"
                  :key="s.id"
                  :src="s.url"
                  :alt="s.id"
                  @click.stop="selectSticker(s)" />

              <!-- 分页按钮 -->
              <button class="page-btn left"
                      @click="prevStickerPage"
                      :disabled="stickerPage===0"
              >‹</button>
              <button class="page-btn right"
                      @click="nextStickerPage"
                      :disabled="(stickerPage+1)*stickersPerPage>=stickers.length"
              >›</button>
            </div>


          </div>
          <div class="np-toolbar">
            <span class="char-count">{{ newPostCharCount }}/30000</span>
            <select v-model="newPostPlace">
              <option value="">无地点</option>
              <option>蒙德</option><option>璃月</option><option>稻妻</option>
              <option>须弥</option><option>枫丹</option><option>纳塔</option>
            </select>

            <button
              class="btn-publish"
              @click="publishPost"
              :disabled="isPublishing"
            >
              <template v-if="!isPublishing">发布</template>
              <template v-else>
                <span class="spinner"></span> 发布中…
              </template>
            </button>

          </div>
        </div>

        <!-- 图片草稿预览 -->
        <div v-if="draftImgs.length && imageInsertMode==='preview'" class="np-preview">
          <div v-for="(img,i) in draftImgs" :key="i" class="thumb">
            <img :src="img"/><span class="remove" @click="removeDraft(i)">×</span>
          </div>
        </div>

        <!-- 动态列表 -->
        <h2 class="big">动态</h2>
      <!-- 1. 骨架屏，当 isListLoading=true 时显示 -->
      <template v-if="isListLoading">
        <div class="skeleton-list">
          <div class="skeleton-card" v-for="n in 3" :key="n">
            <div class="skeleton-head"></div>
            <div class="skeleton-body"></div>
          </div>
        </div>
      </template>

      <!-- 2. 列表主结构，用 transition-group 加入进场动画 -->
      <transition-group name="post-fade" tag="div" id="moments-list">
        <div v-for="post in visiblePosts" :key="post.id" class="post card">
          <!-- ——— 保留你原来的 post 结构 —— ——— -->
          <div class="head" style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
              <div :style="{width:'34px',height:'34px',borderRadius:'50%',background:'url('+getAvatar(post.uid)+') center/cover'}"></div>
              <b>{{ getDisplayName(post.uid) }}</b>
              <span v-html="badgeHTML(post.uid)"></span>
              <!-- 勋章后面追加日期 -->
              <small class="post-date">
                {{ new Date(post.ts).toLocaleDateString() }}
              </small>
              <span class="red" v-if="!isRead(post.id)&&post.uid!==currentUser"></span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:12px">
                {{ new Date(post.ts).toLocaleTimeString() }}<span v-if="post.place"> · {{ post.place }}</span>
              </span>
              <span   v-if="post.uid === currentUser || currentUser === '217122260'" class="more" @click="postOptionsPost = postOptionsPost===post ? null : post">⋯</span>
              <div v-if="postOptionsPost===post" class="post-options">
                <button @click="openPlaceModal('post', post)">编辑地点</button>
                <button @click="deletePost(post)" class="trash-btn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18M9 6v12m6-12v12M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="body">
            <p v-html="renderText(post.txt)"></p>
          </div>

          <div class="photos">
            <img
              v-for="(img,i) in post.imgs"
              :key="i"
              :src="img"
              @click="openModal(post, i)"
            />
          </div>

          <div class="actions">
            <!-- 观看次数图标 -->
            <svg viewBox="0 0 24 24">
              <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z m0 12a5 5 0 110-10 5 5 0 010 10z"/>
            </svg>
            <span>{{ post.views }}</span>

            <!-- 新增：评论切换按钮 -->
            <svg
              class="comment-toggle"
              @click="toggleComments(post)"
              style="cursor:pointer; margin-left:8px;"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            <span>{{ post.cmts.length }}</span>
          </div>

          <div v-if="visibleComments[post.id]" class="comments">
            <div v-for="(c,idx) in post.cmts" :key="idx" class="comment">
              <div class="comment-left">
                <span class="comment-display">{{ getDisplayName(c.who) }}: {{ c.txt }}</span>
              </div>
              <div class="comment-right">
                <span v-if="c.who===currentUser" class="comment-edit" @click="editComment(post,idx)">✎</span>
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
                  <!-- ———————————————— 结束 ———————————————— -->
                </div>
        </transition-group>
        <div
          v-if="visiblePosts.length < posts.length"
          style="text-align:center;margin:16px 0;"
        >
          <button class="btn-ghost" @click="loadMore">加载更多</button>
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
              @click="openModal(photo.post, photo.post.imgs.indexOf(photo.url))"

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
                <img 
                  :src="getAvatar(currentUser)"
                  alt="Avatar" 
                  style="width:40px;height:40px;border-radius:50%;"/>
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
          <fieldset>
          <legend>上传偏好</legend>
          <div class="setting-item">
            <span>图片插入方式</span>
            <select v-model="imageInsertMode" @change="saveImageInsertMode">
              <option value="preview">插入到预览区</option>
              <option value="inline">插入到正文</option>
            </select>
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

      <!-- 图片 Slider Modal -->
      <div v-if="showModal" class="modal show slider-modal" @click.self="closeInfoSidebar">
        <div class="box">
          <span class="close" @click="closeModal">×</span>
          <!-- Modal 图片菜单按钮 -->
          <span class="more modal-more" @click="showImageOptions = !showImageOptions">⋯</span>
          <!-- Modal 信息按钮 -->
          <span
            class="info-btn"
            @click="toggleInfoSidebar"
            :aria-label="showInfoSidebar ? '收起信息' : '查看信息'"
          >
            <!-- 圆圈里的 i，和 iOS 类似 -->
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
              <line   x1="12" y1="8"  x2="12" y2="8"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line   x1="12" y1="11" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>

          <!-- Modal 图片操作菜单 -->
          <div v-if="showImageOptions" class="modal-options">
            <button @click="openPlaceModal('image', modalPost)">编辑地点</button>
          </div>
          <div class="slider-content">
            <button class="slider-btn left" @click="prevModalImg" :disabled="modalIndex===0">‹</button>
            <!-- 桌面鼠标滚轮 -->
            <img
              class="slider-img"
              :src="modalImgs[modalIndex]"
              :style="{ transform: 'scale(' + modalZoom + ')', transition: 'transform .15s' }"
              @load="handleImgLoad"
              @wheel.prevent="onWheelZoom"
            />

            <button class="slider-btn right" @click="nextModalImg" :disabled="modalIndex===modalImgs.length-1">›</button>
          </div>
          <!-- 新增：固定在右下角的删除按钮 -->
          <button class="modal-delete-btn" @click="deleteImage()">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18M9 6v12m6-12v12M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <!-- 缩放条 + 放大镜 -->
          <div class="zoom-control">
            <svg class="zoom-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
              <line   x1="16" y1="16" x2="22" y2="22" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round"/>
            </svg>
            <input
              type="range"
              :min="minZoom"
              :max="maxZoom"
              step="0.1"
              v-model.number="modalZoom"
            />
          </div>
          <!-- 侧边栏：照片信息 -->
          <transition name="sidebar-slide">
            <div
              v-if="showInfoSidebar"
              class="info-sidebar"
            >
              <p><b>尺寸：</b>{{ infoSize }}</p>
              <p>
                <b>地点：</b>
                {{ modalPost.imgPlaces[modalIndex] || modalPost.place || '未知' }}
              </p>
              <p><b>日期：</b>{{ new Date(modalPost.ts).toLocaleString() }}</p>
            </div>
          </transition>
                    
          <div class="modal-meta">
            {{ modalIndex + 1 }} / {{ modalImgs.length }}
          </div>
        </div>
      </div>
      <!-- 编辑地点 Modal -->
      <div v-if="showPlaceModal" class="modal show">
        <div class="box" style="max-width:320px;padding:16px;position:relative;">
          <span class="close" @click="closePlaceModal">×</span>
          <h3 style="margin-bottom:12px;">编辑地点</h3>
           <!-- 跟发帖区一模一样的 np-toolbar -->
        <div class="np-toolbar" style="margin-bottom:12px;">
          <select v-model="placeModalValue">
            <option value="">无地点</option>
            <option>蒙德</option><option>璃月</option><option>稻妻</option>
            <option>须弥</option><option>枫丹</option><option>纳塔</option>
          </select>
        </div>
          <div style="text-align:right;">
            <button class="btn-ghost" @click="closePlaceModal" style="margin-right:8px;">取消</button>
            <button class="btn-publish" @click="confirmPlaceEdit">确定</button>
          </div>
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

      /* 导航栏 */
      navDropdownVisible: false,

      /* 投稿 */
      newPostText: '',
      newPostPlace: '',
      draftImgs: [],
      isPublishing: false,    // 按钮 loading
      isListLoading: false,   // 列表骨架屏

      
      // —— 分页加载配置 —— 
      loadedCount: 5,  // 初始加载 5 条
      loadStep: 5,     // 每次点击再加载 5 条

      /* 评论 */
      // localDisplayName: localStorage.getItem('displayName_' + (storedUser || '')) || '',
      newComment: {},

      /* Modals */
      showBadgeModal: false,
      showPasswordModal: false,
      showModal: false,
      modalSrc: '',
      modalMeta: '',
      modalImgs: [],     // 本次 Modal 要展示的图片列表
      modalIndex: 0,     // 当前显示的图片下标
      showPlaceModal: false,      // 控制编辑地点弹窗显隐
      placeModalTarget: null,     // 要编辑的对象（post 或 modalPost）
      placeModalType: '',         // 'post' 或 'image'
      showInfoSidebar: false,          // Info 侧边栏显隐
      infoSize: '',                    // "4032 × 3024" 这样的字符串

      /* 图片缩放 */
      modalZoom: 1,          // 当前缩放倍数（1 = 100%）
      minZoom : 0.5,         // 下限
      maxZoom : 3,           // 上限

      /* 设置 */
      petEnabled: true,
      petType: 'cat',
      llmEnabled: true,
      petPrompt: '喵～ 记得喝水喔！',
      localDisplayName: localStorage.getItem('displayName_' + (storedUser || '')) || '',
      imageInsertMode: localStorage.getItem('imageInsertMode') || 'preview',

      /*头像 */ 
      avatarMap: {
      [storedUser]: localStorage.getItem('avatar-' + storedUser)
                     || 'https://placehold.co/60'
       },
      /* 勋章 */
      BADGES: [
        { id: 'none',    name: '不佩戴'        },
        { id: 'best',    name: '最好的大佬'    },
        { id: 'catgirl', name: '你才是猫娘'    }
      ],
      selectedBadge: localStorage.getItem('wear_' + (storedUser || '')) || 'none',
      userBadges: (() => {
        const map = JSON.parse(localStorage.getItem('userBadges') || '{}');
        // 如果有登录用户，且 map 里还没它的记录，就初始化一下
        if (storedUser && !(storedUser in map)) {
          map[storedUser] = localStorage.getItem('wear_' + storedUser) || 'none';
        }
        return map;
      })(),

      editingImgIdx: 0,          // ⑦ 当前在改哪一张
      placeModalValue: '',       // ⑧ <select v-model> 的值

      /* 密码 */
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',

      /* 已读 */
      readIds: new Set(JSON.parse(localStorage.getItem('readIds_' + (storedUser || '')) || '[]')),

      /* 相册 */
      albumMode: 'time',
      
      /* 表情 */
      stickerPickerVisible: false,
      stickers: [],          // ↙ 先给空数组
      stickerPage      : 0,   // 当前页
      stickersPerPage  : 32,  // 每页多少张
      savedRange       : null,   // ⭐︎ 光标缓存

      /* 管理员 */
      adminPwdModalVisible: false,
      adminTargetUid: '',
      adminNewPassword: '',
      newAdminUid: '',
      
      /* 白名单 */
      allowedUids: getAllowedUids(),
      // Modal 内部「⋯」菜单
      showImageOptions: false,   // 控制图片选项菜单显隐
      modalPost: null,           // 当前在 Modal 里编辑的 post 对象

      // 动态列表「⋯」菜单
      postOptionsPost: null,     // 控制哪个 post 的选项菜单显隐

      imageNewPlace: '',  // Modal 编辑时用的 v-model
      postNewPlace: '',   // 动态列表编辑时用的 v-model
      visibleComments: {},   // key: post.id, value: Boolean  
    };
  },

  /* ---------- computed ---------- */
  computed: {
    newPostCharCount() {
      // 把所有 markdown 图片语法替换成单个占位符
      const txt = this.newPostText.replace(/!\[\]\([^)]*\)/g, '□');
      return txt.length;
    },

    displayedStickers () {
      const start = this.stickerPage * this.stickersPerPage
      return this.stickers.slice(start, start + this.stickersPerPage)
    },
    // 只显示已加载的条数
    visiblePosts() {
      return this.posts.slice(0, this.loadedCount);
    },

    displayName() {
      return this.localDisplayName;
    },  
    allPhotos() {
      const out = [];
      this.posts.forEach(post => {
        post.imgs.forEach((url, idx) => {
          out.push({
            url,
            // 1️⃣ 如果这张图有 imgPlaces，就用它；否则 fallback 到 post.place
            place: post.imgPlaces?.[idx] || post.place || '未知',
            date: new Date(post.ts).toISOString().slice(0, 10),
            post,
            idx
          });
        });
      });
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
    bgBlur: 'saveBgBlur',
    // 本地改名时，立刻写入 localStorage
    localDisplayName(newName) {
      localStorage.setItem('displayName_' + (this.currentUser || ''), newName);
      },
      
      selectedBadge(newVal) {
      // 直接赋值给响应式对象
      this.userBadges[this.currentUser] = newVal;
      localStorage.setItem('userBadges', JSON.stringify(this.userBadges));
    }
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
    formatMeta(post) {
      const d = new Date(post.ts);
      const date = d.toLocaleDateString();      // 本地化日期
      const time = d.toLocaleTimeString();      // 本地化时分秒
      return `${date} ${time}${post.place ? ' · ' + post.place : ''}`;
    },

    // —— 关闭贴图面板 —— //
    handleClickToCloseSticker(e) {
      if (this.stickerPickerVisible &&
          !e.target.closest('.sticker-picker') &&
          !e.target.closest('.emoji-fab')) {
        this.stickerPickerVisible = false;
      }
    },

    // —— 关闭头像下拉 —— //
    handleClickToCloseNavDropdown(e) {
      if (this.navDropdownVisible &&
          !e.target.closest('.nav-avatar')) {
        this.navDropdownVisible = false;
      }
    },

    // —— 全局点击统一入口 —— //
    handleGlobalClick(e) {
      this.handleClickToCloseSticker(e);
      this.handleClickToCloseNavDropdown(e);
    },

    badgeHTML(uid) {
    const val = this.userBadges[uid] || 'none';
    // 不佩戴就不渲染
    if (val === 'none') return '';
    // 只有 best 和 catgirl 两种可渲染
    const cls  = val === 'best'    ? 'badge best'
               : /* catgirl */      'badge catgirl';
    const name = this.BADGES.find(b => b.id === val)?.name || '';
    return `<span class="${cls}">${name}</span>`;
  },

    scrollTo(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); },
    getAvatar(uid){
      if (!this.avatarMap[uid]){
        this.avatarMap[uid] = localStorage.getItem('avatar-' + uid) || 'https://placehold.co/60';
      }
      return this.avatarMap[uid];
    },


    getDisplayName(uid){
      if (uid === this.currentUser) {
        return this.displayName;
      } 
      return localStorage.getItem('displayName_' + uid) || uid;
    },
    
    toggleNavDropdown() {
      this.navDropdownVisible = !this.navDropdownVisible;
      },
    toggleComments(post) {
      // Vue3 响应式里直接赋值即可
      this.visibleComments[post.id] = !this.visibleComments[post.id];
    },

    /* ========== 投稿 ========== */
    handleInput(e) {
      const nodes = e.target.childNodes
      let txt = ''
      nodes.forEach(n => {
        if (n.nodeType === 3) {                    // 文本节点
          txt += n.textContent
        } else if (n.tagName === 'IMG' &&
                  n.classList.contains('inline-sticker')) {
          txt += `![](${n.src})`
        } else if (n.tagName === 'BR') {
          txt += '\n'
        }
      })
      this.newPostText = txt
    },
    handlePostImages(e) {
      const files = Array.from(e.target.files).slice(0, 50);

      // ① “正文内嵌” —— 像贴图一样插入 <img>
      if (this.imageInsertMode === 'inline') {
        files.forEach(f => {
          const url = URL.createObjectURL(f);
          this.draftImgs.push(url);

          // —— 在光标处插入一张 <img.inline-sticker> —— 
          this.restoreCaret();
          const sel = window.getSelection();
          if (!sel || !sel.rangeCount) return;
          const range = sel.getRangeAt(0);
          const img = document.createElement('img');
          img.src = url;
          img.className = 'inline-sticker';
          img.contentEditable = false;
          range.insertNode(img);
          range.collapse(false);

          // 在图片后插入一个空格，保持输入流畅
          this.insertAtCaret(' ');
        });

        // DOM 变动后，同步更新 markdown 内容
        this.handleInput({ target: this.$refs.postInput });
      }

      // ② “预览区” —— 传统的图片预览模式
      else {
        this.draftImgs = [];
        files.forEach(f => this.draftImgs.push(URL.createObjectURL(f)));
      }
    },

    removeDraft(i){ this.draftImgs.splice(i,1); },
    autoResize(e) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    },
    /* —— 光标缓存 —— */
    saveCaret () {
      const sel = window.getSelection()
      if (sel && sel.rangeCount) {
        this.savedRange = sel.getRangeAt(0).cloneRange()
      }
    },
    restoreCaret () {
      const box = this.$refs.postInput
      // 1) 没缓存 2) 缓存已经跑到别的元素 → 统一放到文本末尾
      if (!this.savedRange || !box.contains(this.savedRange.startContainer)) {
        this.savedRange = document.createRange()
        this.savedRange.selectNodeContents(box)
        this.savedRange.collapse(false)
      }
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(this.savedRange)
      box.focus()
    },

    publishPost(){
      if (!this.currentUser) return alert('请先登录');
      this.isPublishing = true;
      this.isListLoading = true;
      const txt=this.newPostText.trim();
      if(!txt && !this.draftImgs.length) {
        this.isPublishing = false; 
        this.isListLoading = false;
        return alert('写点文字或选张图片吧~');
        }
      const post={ id:crypto.randomUUID(), uid:this.currentUser, txt, place:this.newPostPlace,imgPlaces: this.draftImgs.map(() => null), imgs:[...this.draftImgs], ts:Date.now(), views:0, cmts:[] };

      this.posts.unshift(post);
      localStorage.setItem('posts', JSON.stringify(this.posts.map(p=>({...p,imgs:[]}))));

      // 清空输入状态
      this.newPostText = '';
      this.newPostPlace = '';
      this.draftImgs = [];

      // 手动清空 contenteditable 区域，否则 Vue 不会重绘
      if (this.$refs.postInput) {
        this.$refs.postInput.innerHTML = '';
      }



      setTimeout(() => {
        this.isPublishing = false;
        this.isListLoading = false;
        // this.scrollTo('post-list');
      }, 300);
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
    saveImageInsertMode() {
      localStorage.setItem('imageInsertMode', this.imageInsertMode);
      },
    /* === 自定义表情 === */
    toggleStickerPicker () {
      if (!this.stickerPickerVisible) {      // 正在“打开”面板
        this.saveCaret();                    // 先记住 Range
      }
      this.stickerPage = 0;
      this.stickerPickerVisible = !this.stickerPickerVisible;
    },

      // 👉 下一页贴图（只有当前页未满时才生效）
    nextStickerPage () {
      if ((this.stickerPage + 1) * this.stickersPerPage < this.stickers.length)
        this.stickerPage++
    },

    // 👉 上一页贴图（第一页时无效）
    prevStickerPage () {
      if (this.stickerPage > 0) this.stickerPage--
    },

    // 👉 在 textarea 光标处插入文本（适用于贴图插入、emoji 插入等）
    insertAtCaret(txt) {
      const sel = window.getSelection()
      if (!sel || !sel.rangeCount) return
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(txt))
      // 把光标移到新插入文本后面
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
      // 同步到数据
      this.newPostText = this.$refs.postInput.innerText
    },


    selectSticker (s) {
      /* ---------- 1. 让光标回到用户刚才的位置 ---------- */
      this.restoreCaret()                 // ← 前面 saveCaret() 过

      const sel   = window.getSelection()
      if (!sel || !sel.rangeCount) return
      const range = sel.getRangeAt(0)

      /* ---------- 2. 插入 <img> 节点 ---------- */
      const img = document.createElement('img')
      img.src              = s.url
      img.className        = 'inline-sticker'
      img.contentEditable  = false        // 不可被直接编辑
      range.deleteContents()              // 把可能的选中内容清掉
      range.insertNode(img)

      /* ---------- 3. 在 <img> 后补一个空格，再把光标放到空格后 ---------- */
      const space = document.createTextNode(' ')
      range.setStartAfter(img)
      range.insertNode(space)

      const newRange = document.createRange()
      newRange.setStart(space, 1)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
      this.savedRange = newRange.cloneRange()   // 更新缓存，方便继续插

      /* ---------- 4. 用现成的 handleInput 把 DOM → markdown ---------- */
      this.handleInput({ target: this.$refs.postInput })

      /* ---------- 5. 关面板 ---------- */
      this.stickerPickerVisible = false
    },


    renderText(raw) {
      // 把换行变 <br>，把 markdown 图片变 <img>
      return raw
        .replace(/!\[\]\((.+?)\)/g, (_, u) => `<img class="inline-sticker" src="${u}">`)
        .replace(/\n/g, '<br>')
    },      

    handleKeydown(event) {
      if (event.key !== 'Backspace') return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;

      let nodeBefore;
      const { startContainer, startOffset } = range;

      // 如果光标在文本节点开头，检查前一个兄弟节点
      if (startContainer.nodeType === Node.TEXT_NODE && startOffset === 0) {
        nodeBefore = startContainer.previousSibling;
      }
      // 如果光标在元素节点中，检查 startOffset 前的子节点
      else if (startContainer.nodeType === Node.ELEMENT_NODE && startOffset > 0) {
        nodeBefore = startContainer.childNodes[startOffset - 1];
      }

      // 检查是否是贴图 IMG，并执行删除
      if (
        nodeBefore &&
        nodeBefore.nodeType === Node.ELEMENT_NODE &&
        nodeBefore.tagName === 'IMG' &&
        nodeBefore.classList.contains('inline-sticker')
      ) {
        event.preventDefault();
        nodeBefore.remove(); // 删除该 IMG

        // 将光标设置到原位置
        const newRange = document.createRange();
        newRange.setStart(startContainer, Math.max(0, startOffset - 1));
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);

        // 触发输入处理，更新 markdown 内容
        this.handleInput({ target: this.$refs.postInput });
      }
    },

    // Modal: 确认修改图片地点
    openPlaceModal(type, target) {
      this.placeModalType   = type;
      this.placeModalTarget = target;
      this.showPlaceModal   = true;
      if (type === 'image') {
        this.editingImgIdx   = this.modalIndex;
        this.placeModalValue = target.imgPlaces[this.modalIndex] ?? target.place ?? '';
      } else {
        this.placeModalValue = target.place ?? '';
      }
    },
    // 取消
    closePlaceModal() {
      this.showPlaceModal = false;
      this.placeModalTarget = null;
    },
    // 确认，保存到 localStorage
    confirmPlaceEdit () {
      const val = this.placeModalValue;
      if (this.placeModalType === 'image') {               // ⑨ 单张
        this.placeModalTarget.imgPlaces[this.editingImgIdx] = val || null;
      } else {                                             // 动态
        const old = this.placeModalTarget.place;
        this.placeModalTarget.place = val || '';
        // 把仍在“继承”旧地点的图片同步到新地点（继承 = imgPlace 为 null）
        this.placeModalTarget.imgPlaces = this.placeModalTarget.imgPlaces.map(p =>
          p === null ? null : p
        );
      }

      // 持久化
      // 只调用一次 setItem，把整个 this.posts 序列化
      localStorage.setItem('posts', JSON.stringify(this.posts));
      this.updateModalMeta();        // 如果正在看 Modal，立即刷新
      this.closePlaceModal();
    },


    isRead(id){ return this.readIds.has(id); },

    /* ========== 图片 Modal ========== */
    openModal (post, startIndex = 0) {               // ③ 只传 post 和索引
      // —— 保底：确保这一条动态带 imgPlaces —— 
      if (!Array.isArray(post.imgPlaces) || post.imgPlaces.length !== post.imgs.length) {
        post.imgPlaces = post.imgs.map(() => null);
      }

      this.modalPost   = post;
      this.modalImgs   = post.imgs;
      this.modalIndex  = startIndex;
      this.modalZoom   = 1;
      this.showModal   = true;
      this.showInfoSidebar = false;
      this.showImageOptions = false;

      this.updateModalMeta();                        // 初始页脚文字
    },
    // ④ 把页脚文字封装成单独函数
    updateModalMeta () {
      if (!this.modalPost) {
        return;
      }
      const p = this.modalPost;
      const place = p.imgPlaces?.[this.modalIndex] ?? p.place ?? '';
      const d = new Date(p.ts);
      const date = d.toLocaleDateString();
      const time = d.toLocaleTimeString();
      this.modalMeta = place ? `${date} ${time} · ${place}` : `${date} ${time}`;
    },

    prevModalImg() {
      if (this.modalIndex > 0) {
        this.modalIndex--;
        this.updateModalMeta(); 
      }
    },
    nextModalImg() {
      if (this.modalIndex < this.modalImgs.length - 1) {
        this.modalIndex++;
        this.updateModalMeta(); 
      }
    },
    closeModal(){ this.showModal=false; },
    // Modal 里：编辑当前 post 的地点
    editImagePlace() {
      const newPlace = prompt('请输入新的地点', this.modalPost.place);
      if (newPlace != null) {
        this.modalPost.place = newPlace;
        // 同步回 localStorage
        localStorage.setItem('posts', JSON.stringify(this.posts));
        this.modalMeta = `${new Date(this.modalPost.ts).toISOString().slice(0,10)} · ${newPlace}`;
      }
      this.showImageOptions = false;
    },

    toggleInfoSidebar () {
      this.showInfoSidebar = !this.showInfoSidebar;
    },

    // 在 <img> load 时记录尺寸
    handleImgLoad (e) {
      const { naturalWidth: w, naturalHeight: h } = e.target;
      this.infoSize = `${w} × ${h}`;
    },

    closeInfoSidebar () {
      this.showInfoSidebar = false;
    },
    /* ========= = 图片缩放 ========== */
    onWheelZoom(e){
      const delta = e.deltaY > 0 ? -0.1 : 0.1;         // 上滚放大、下滚缩小
      this.modalZoom = this.clampZoom(this.modalZoom + delta);
    },
    
    clampZoom(v){                                      // 辅助函数：限制范围
      return Math.min(this.maxZoom, Math.max(this.minZoom, parseFloat(v.toFixed(2))));
    },


    // Modal 里：删除当前图片
    deleteImage() {
      if (!confirm('确定要删除这张图片吗？')) {
        return; // 用户点击“取消”就直接退出
      }
      this.modalPost.imgs.splice(this.modalIndex, 1);
      this.modalPost.imgPlaces.splice(this.modalIndex, 1);   // ⑩ 同步
      this.modalImgs.splice(this.modalIndex, 1);
      // 更新 storage
      localStorage.setItem('posts', JSON.stringify(this.posts));
      if (this.modalIndex >= this.modalImgs.length) this.modalIndex = this.modalImgs.length - 1;
      this.showImageOptions = false;
      if (this.modalImgs.length === 0) {
        this.showModal = false;
      }

    },

    // 动态列表里：编辑 post.place
    editPostPlace(post) {
      const newPlace = prompt('请输入新的地点', post.place);
      if (newPlace != null) {
        post.place = newPlace;
        localStorage.setItem('posts', JSON.stringify(this.posts));
      }
      this.postOptionsPost = null;
    },
    // 点击“加载更多”
    loadMore() {
      this.loadedCount += this.loadStep;
    },


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
    changeAvatar(e) {
      const f = e.target.files[0]
      if (!f) return
      const r = new FileReader()
      r.onload = ev => {
        const url = ev.target.result
        // —— 更新响应式 avatarMap，让所有用到它的地方都自动刷新 —— 
        this.avatarMap[this.currentUser] = url
        // —— 同步到 localStorage，保证刷新或下次登录还能继续用 —— 
        localStorage.setItem('avatar-' + this.currentUser, url)
      }
      r.readAsDataURL(f)
    },


    updateDisplayName(){ localStorage.setItem('displayName_' + this.currentUser, this.localDisplayName); },
    openBadgeModal(){ this.showBadgeModal=true; },
    closeBadgeModal(){ this.showBadgeModal=false; },
    confirmBadge() {
      // 直接赋值，触发响应式
      this.userBadges[this.currentUser] = this.selectedBadge;
      localStorage.setItem('userBadges', JSON.stringify(this.userBadges));
      alert('勋章已更换');
      this.closeBadgeModal();
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

  mounted() {
    const ctx = require.context(
      '@/assets/stickers/原神表情', // 表情图的根目录
      true,                        // 递归子目录
      /\.png$/                     // 匹配所有 .png 文件
    );
    this.stickers = ctx.keys().map((key, idx) => ({
      id : 'sticker-' + idx,
      url: ctx(key)                // ctx(key) 返回图片的 URL
    }));


  // ✅ 统一绑定全局点击事件（只注册一次）
  document.addEventListener('click', this.handleGlobalClick);

    // 同步主题
    document.body.classList.toggle('dark', this.theme === 'dark');

    // 确保所有 post 都初始化好 imgPlaces
    this.posts.forEach(p => {
      if (!Array.isArray(p.imgPlaces) || p.imgPlaces.length !== p.imgs.length) {
        p.imgPlaces = p.imgs.map(() => null);
      }
    });
    

  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleGlobalClick);
  },
  
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
.np-preview {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-top: 8px; /* ← 增加这一句 */
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
.post-options {
  position: absolute; top: 40px; right: 22px;
  background: var(--card-light); padding:4px; border-radius:6px;
  backdrop-filter: blur(calc(var(--blur)/2));
  display:flex; flex-direction:column;
}
body.dark .post-options { background: var(--card-dark); }
.post-options button { background:none; border:none; cursor:pointer; text-align:left; padding:4px 8px;}
#moments-list .post.card {
  width: 65%;
  max-width: 700px;
  min-width: 580px;
  margin: 0 auto;
}



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
/* 1. 固定 Modal 大小：替换原有 .box 定义 */
.box {
  background: var(--card-light);
  backdrop-filter: blur(var(--blur));
  border: var(--glass-border);
  border-radius: var(--radius);

  /* 固定宽度，高度自适应，但在小屏幕时不超出 */
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;

  overflow: auto;
  padding: 20px;
  position: relative;
}

/* 2. 列表里 “删除” 按钮，复用 modal-delete-btn 风格，文本跟随主题 */
.post-options .trash-btn {
  /* 复制 modal-delete-btn 的核心风格 */
  background: rgba(120, 120, 120, 0.15);
  border: 1px solid rgba(200, 200, 200, 0.4);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 6px rgba(120, 120, 120, 0.6);
  transition: transform .1s, box-shadow .2s, background .2s;
  cursor: pointer;

  /* 文字 / 图标 跟随主题色 */
  color: inherit;
}
.post-options .trash-btn:hover {
  background: rgba(120, 120, 120, 0.25);
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(120, 120, 120, 0.8);
}
/* 确保 svg 图标大小合适 */
.post-options .trash-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
}
@media (max-width: 480px) {
  .box {
    width: 95vw;
    padding: 12px;
  }
}

body.dark .box{background:var(--card-dark);border:1px solid rgba(255,255,255,0.2)}
.close{position:absolute;top:10px;right:16px;font-size:24px;cursor:pointer}
/* Slider Modal 箭头按钮 */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.3);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
body.dark .slider-btn {
  background: rgba(255,255,255,0.3);
  color: #333;
}
.slider-btn.left  { left: 10px; }
.slider-btn.right { right: 10px; }
/* 保证 .box 是定位容器 */
.slider-modal .box {
  position: relative;
}

/* 固定页码到底部中央 */
.slider-modal .modal-meta {
  position: absolute;
  bottom: 16px;              /* 距底部 16px，可调 */
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0;             /* 覆盖原 margin-top */
  font-size: 13px;
  padding: 4px 8px;          /* 可选：加点内边距，提高可读性 */
  border-radius: 4px;        /* 可选：圆角框 */
  background: rgba(0,0,0,0.3); /* 可选：半透明底，确保对比度 */
  color: #fff !important;      /* 强制白色文字 */
  z-index: 10;               /* 确保浮在图片之上 */
}

/* 深色模式下调整文字色 */
body.dark .slider-modal .modal-meta {
  color: #ddd !important;
}

.modal-more {
  position: absolute; top: 10px; right: 50px; cursor: pointer;
}
.info-btn{
  position: absolute;
  top: 10px;
  right: 82px;          /* 刚好挨着 ⋯，可自行微调 */
  cursor: pointer;
  font-size: 18px;
  padding: 2px 6px;
  border-radius:50%;
  transition:.2s background;
  color: var(--text-light);
}
body.dark .info-btn{ color: var(--text-dark); }
.info-btn:hover{ background:rgba(0,0,0,0.08); }
body.dark .info-btn:hover{ background:rgba(255,255,255,0.12); }
.info-btn svg{ width:20px; height:20px; display: block;             /* 确保可以用 margin 调整 */
  margin-top: 4px;            /* 向下移动 icon */ }

.modal-options {
  position: absolute; top: 36px; right: 50px;
  background: var(--card-light); padding: 6px; border-radius: 6px;
  backdrop-filter: blur(calc(var(--blur)/2));
  display: flex; flex-direction: column; gap: 4px;
}
body.dark .modal-options { background: var(--card-dark); }
.modal-options button { background: none; border: none; cursor: pointer; }
.post-options,
.modal-options {
  color: var(--text-light);
}
body.dark .post-options,
body.dark .modal-options {
  color: var(--text-dark);
}
/* 按钮文字也要跟随主题 */
.post-options button,
.modal-options button {
  color: inherit;
}
/* 确保 Modal 里的 np-toolbar select 在亮色模式下也用同样的背景 / 文字色 */
.modal .np-toolbar select {
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur)/2));
  border: var(--glass-border);
  border-radius: var(--radius);
  padding: 6px 12px;
  font-size: 14px;
  color: var(--text-light);
  cursor: pointer;
}
.modal-delete-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(120, 120, 120, 0.15);           /* 浅灰半透明背景 */
  border: 1px solid rgba(200, 200, 200, 0.4);      /* 细灰边框 */
  color: #e0e0e0;                                   /* 图标浅灰色 */
  border-radius: 50%;
  backdrop-filter: blur(4px);                       /* 玻璃模糊效果 */
  box-shadow: 0 0 6px rgba(120, 120, 120, 0.6);     /* 科技感微光 */
  transition: transform .1s, box-shadow .2s, background .2s;
  cursor: pointer;
}

.modal-delete-btn:hover {
  background: rgba(120, 120, 120, 0.25);           /* 深一点的灰 */
  transform: scale(1.1);                            /* 放大反馈 */
  box-shadow: 0 0 12px rgba(120, 120, 120, 0.8);    /* 更强的光晕 */
}

.modal-delete-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;                             /* 跟随 color */
  fill: none;
}




/* 桌宠 */
#pet svg{width:100%;animation:breathe 3s ease-in-out infinite}
@keyframes breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}

/* 过渡 */
.fade-enter-active,.fade-leave-active{transition:opacity .3s ease}
.fade-enter,.fade-leave-to{opacity:0}

/* 更多按钮主题自适应 */
.more,
.modal-more {
  color: var(--text-light);
}
body.dark .more,
body.dark .modal-more {
  color: var(--text-dark);
}
/* 小型环形 loading */
.spinner {
  display: inline-block;
  width: 16px; height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin .8s linear infinite;
  vertical-align: middle;
  margin-right: 4px;
}
@keyframes spin { to { transform: rotate(360deg) } }

/* —— 优化后的骨架屏（玻璃 + 流光） —— */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.skeleton-card {
  position: relative;
  border-radius: var(--radius);
  background: var(--card-light);           /* 浅色模式下半透明玻璃 */
  backdrop-filter: blur(calc(var(--blur)/2));
  overflow: hidden;
  padding: 12px;
}
body.dark .skeleton-card {
  background: var(--card-dark);            /* 深色模式下半透明玻璃 */
}

.skeleton-card::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.6),
    transparent
  );
  animation: shimmer 1.2s ease-in-out infinite;
}

.skeleton-head,
.skeleton-body {
  background: rgba(255,255,255,0.2);      /* 统一浅色打底 */
  border-radius: 4px;
  margin-bottom: 8px;
}
body.dark .skeleton-head,
body.dark .skeleton-body {
  background: rgba(0,0,0,0.2);            /* 深色模式调整为暗色调 */
}
.skeleton-head {
  width: 40%;
  height: 16px;
}
.skeleton-body {
  width: 100%;
  height: 60px;
}

/* 流光动画 */
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(100%); }
  100% { transform: translateX(200%); }
}

/* 保留进场动画 */
.post-fade-enter-active  { transition: all .3s ease; }
.post-fade-leave-active  { transition: all .2s ease; }
.post-fade-enter         { opacity:0; transform:translateY(-10px); }

.modal {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.lightbox {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column;
  padding: 16px;
}
.lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.close-btn {
  position: absolute; top: 8px; right: 8px;
  background: none; border: none;
  font-size: 28px; color: #fff;
  cursor: pointer; padding: 4px;
}
.nav-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.2); border: none;
  font-size: 32px; color: #fff;
  width: 48px; height: 48px;
  cursor: pointer; border-radius: 50%;
}
.nav-btn:hover { background: rgba(255,255,255,0.4); }
.prev { left: 16px; }
.next { right: 16px; }
.caption {
  margin-top: 12px; font-size: 14px; color: #eee;
}
/* —— 针对 Slider Modal —— */
/* —— Slider Modal 重写 —— */
.slider-modal .box {
  position: relative;    /* 变为定位容器 */
  display: block;        /* 去掉 flex 布局 */
  width: 80vw;
  max-width: 90vw;
  height: 80vh;
  max-height: 90vh;
  background: var(--card-light);
  border-radius: var(--radius);
  overflow: hidden;
}

.slider-modal .slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* 其它你喜欢的样式… */
}
.slider-modal .slider-btn.left  { left: 16px; }
.slider-modal .slider-btn.right { right: 16px; }

/* —— Slider Modal 最终版 —— */
.slider-modal .slider-content {
  text-align: center;    /* 水平居中 */
  padding: 20px 0;       /* 上下留白 */
}

.slider-modal .slider-img {
  display: inline-block; /* 保持内联块，不要被 flex 或 width:100% 拉伸 */
  width: auto !important;     /* 让浏览器用图片本身宽度 */
  height: auto !important;    /* 让浏览器用图片本身高度 */
  max-width: 90vw;       /* 只有超宽时才缩到 90vw */
  max-height: 80vh;      /* 超高时才缩到 80vh */

}

/* 1. 让 box 继续作 flex column 布局 */
.slider-modal .box {
  display: flex;
  flex-direction: column;
}

/* 2. slider-content 占满剩余空间，并水平/垂直双向居中 */
.slider-modal .slider-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 3. 图片只在过大时缩放，平常按原始大小 */
.slider-modal .slider-img {
  display: block;           /* block 或 inline-block 都可 */
  width: auto !important;
  height: auto !important;
  max-width: 90vw;
  max-height: 80vh;
}
/* ---- Info 侧边栏 ---- */
.info-sidebar{
  position:absolute; left:0; bottom:0;
  width:100%;       /* 占满横向 */
  padding:18px 22px 28px;
  background:var(--card-light);
  backdrop-filter:blur(calc(var(--blur)/2));
  border-top:var(--glass-border);
  border-bottom-left-radius:var(--radius);
  border-bottom-right-radius:var(--radius);
  font-size:14px;
  box-shadow:0 -4px 18px rgba(0,0,0,0.15);
}
body.dark .info-sidebar{ background:var(--card-dark); }

/* Slide-up 过渡 */
.sidebar-slide-enter-from,
.sidebar-slide-leave-to{
  transform:translateY(100%);
  opacity:0;
}
.sidebar-slide-enter-active,
.sidebar-slide-leave-active{
  transition:.25s ease transform, .25s ease opacity;
}
.zoom-control{
  position:absolute;                 /* 右下角贴边 */
  bottom:18px; right:62px;           /* 不挡删除按钮 */
  display:flex; align-items:center;
  gap:6px;
  background:rgba(120,120,120,.15);
  border:1px solid rgba(200,200,200,.4);
  padding:4px 8px;
  border-radius:20px;
  backdrop-filter:blur(4px);
}
body.dark .zoom-control{
  background:rgba(255,255,255,.08);
}
.zoom-control input[type=range]{
  width:100px;      /* 长度随意 */
}
.zoom-icon{
  width:18px; height:18px;
  stroke:currentColor; fill:none;
}

.nav-avatar {
position: relative;      /* 关键：让子元素 .nav-dropdown 参照它定位 */
display: inline-block;   /* 确保宽度包裹头像 */
cursor: pointer;
}

.avatar-img {
width: 32px;
height: 32px;
border-radius: 50%;
object-fit: cover;
}
.nav-dropdown {
/* 让下拉菜单至少宽到能容纳其内容 */
min-width: max-content;
/* 其余保持不变 */
position: absolute;
top: calc(100% + 8px);
left: 0;
background: var(--card-light);
backdrop-filter: blur(calc(var(--blur)/2));
border: var(--glass-border);
border-radius: var(--radius);
display: flex;
flex-direction: column;
padding: 6px 0;
z-index: 200;
}

.dropdown-item {
/* 自动根据自己内容撑宽，不要限制成 100% */
width: auto;
/* 允许文字在需要的时候换行（默认即可） */
white-space: normal;
background: none;
border: none;
padding: 8px 16px;
text-align: left;
cursor: pointer;
font-size: 14px;
color: var(--text-light);
}
.dropdown-item:hover {
background: rgba(0,0,0,0.08);
}
body.dark .nav-dropdown { background: var(--card-dark); }
body.dark .dropdown-item:hover { background: rgba(255,255,255,0.12); }
body.dark .dropdown-item {
color: #fff;
}

.menu .nav-item {
display: flex;
flex-direction: column;
align-items: center;
gap: 4px;
padding: 6px 8px;
border-radius: var(--radius);
transition: background .25s;
}
.menu .nav-item:hover {
background: rgba(0,0,0,0.08);
}
body.dark .menu .nav-item:hover {
background: rgba(255,255,255,0.12);
}

.nav-icon {
width: 20px;
height: 20px;
}

.nav-label {
font-size: 12px;
color: var(--text-light);
}
body.dark .nav-label {
color: var(--text-dark);
}
/* 让 textarea 成为相对定位的参照物 */
.np-input-wrapper{
position: relative;
}
.np-input-wrapper {
  position: relative;
  /* 如果你之前给它加了 overflow:hidden，也请改成 visible */
}

.ta-preview {
  position: relative;      /* 跟普通块一样排版 */
  pointer-events: auto;    /* 能接收点击、聚焦、输入 */
  z-index: 1;              /* 背景层级 */
  min-height: 78px;        /* 和 textarea 原来高度一致 */
  padding: 10px;
  border-radius: var(--radius);
  border: var(--glass-border);
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur)/2));
  white-space: pre-wrap;
  word-break: break-word;
  outline: none;
}

/* 深色模式下底色、文字色 */
body.dark .ta-preview {
  background: var(--card-dark);
  color: var(--text-dark);
}

/* 浮动按钮都放在 ta-preview 之上 */
.upload-fab,
.emoji-fab {
  position: absolute;
  z-index: 2;
  /* 你的 bottom/left/right/top 坐标照旧 */
}

/* 举例： */
.upload-fab {
  bottom: 10px;
  left: 10px;
}
.emoji-fab {
  bottom: 10px;
  left: 48px;
}




/* 圆形玻璃按钮 —— 复用 btn-ghost 的配色 */
.upload-fab{
position: absolute;
bottom: 10px;
left:   10px;
width:  28px;          /* ← 直径调小 */
height: 28px;
border-radius: 50%;
background: var(--card-light);
border: var(--glass-border);
backdrop-filter: blur(calc(var(--blur)/2));
color: var(--text-light);
display:flex;align-items:center;justify-content:center;
cursor:pointer;
transition: background .25s, transform .15s;
box-shadow: 0 2px 6px rgba(0,0,0,.15);
}
body.dark .upload-fab{
background: var(--card-dark);
color: var(--text-dark);
}

/* hover 效果沿用 btn-ghost */
.upload-fab:hover       { background: rgba(0,0,0,0.08); }
body.dark .upload-fab:hover { background: rgba(255,255,255,0.12); }

.upload-fab svg { width:16px; height:16px; }  /* 图标跟着缩小 */
.upload-fab input{ display:none; }            /* 隐藏真正的 file input */

/* —— Emoji 按钮 —— */
.emoji-fab {
position: absolute;
bottom: 10px;
left:   48px;               /* upload-fab（10px） + 宽度28px + 间距10px = 48px */
width:  28px;
height: 28px;
border-radius: 50%;
background: var(--card-light);
border: var(--glass-border);
backdrop-filter: blur(calc(var(--blur)/2));
color: var(--text-light);
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
transition: background .25s, transform .15s;
box-shadow: 0 2px 6px rgba(0,0,0,.15);
}
body.dark .emoji-fab {
background: var(--card-dark);
color: var(--text-dark);
}
.emoji-fab:hover {
background: rgba(0,0,0,0.08);
}
body.dark .emoji-fab:hover {
background: rgba(255,255,255,0.12);
}
/* SVG 图标缩放 */
.emoji-fab svg {
width:16px;
height:16px;
}
/* === Sticker 选择面板 === */
.sticker-picker{
position:absolute;
bottom:48px;                /* 紧贴两个圆钮上方 */
left:48px;
display:grid;
grid-template-columns:repeat(4,40px);
gap:8px;
padding:10px;
background:var(--card-light);
border:var(--glass-border);
backdrop-filter:blur(calc(var(--blur)/2));
border-radius:var(--radius);
box-shadow:0 6px 18px rgba(0,0,0,.18);
z-index:400;
}
body.dark .sticker-picker{background:var(--card-dark);}
.sticker-picker img{
width:40px;height:40px;border-radius:6px;cursor:pointer;
transition:transform .15s;
}
.sticker-picker img:hover{transform:scale(1.15);}
/* 行内贴图：跟随字体，默认≈1行文字高 */
.inline-sticker{
height: 3em;          /* 高度 ≈ 一行字 */
width : auto;            /* 宽度等比缩放 */
vertical-align: -.25em;  /* 略微下沉，使中心对齐文字基线 */
display: inline-block;   /* 防止被视为文本行高 */
}

body.dark .ta-preview {
  background: var(--card-dark);
  color: var(--text-dark);
}
.ta-preview {
  /* —— 日常字体 —— */
  font-family: Arial, sans-serif;

  position: relative;
  pointer-events: auto;
  z-index: 1;
  min-height: 78px;
  padding: 10px;
  border-radius: var(--radius);
  border: var(--glass-border);
  background: var(--card-light);
  backdrop-filter: blur(calc(var(--blur)/2));
  white-space: pre-wrap;
  word-break: break-word;
  outline: none;
}

/* —— 占位文字 —— */
.ta-preview:empty::before {
  content: attr(data-placeholder);
  color: #888;
  pointer-events: none;
}

</style>