// main.js

document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const loginUsers = document.querySelectorAll('.login-users .avatar');
    const loginPasswordDiv = document.getElementById('loginPasswordDiv');
    let selectedUid = null;
  
    // 当点击头像时显示密码框
    loginUsers.forEach(avatar => {
      avatar.addEventListener('click', () => {
        selectedUid = avatar.getAttribute('data-uid');
        loginPasswordDiv.classList.remove('hidden');
      });
    });
  
    // 登录按钮点击
    document.getElementById('loginConfirmBtn').addEventListener('click', () => {
      const password = document.getElementById('loginPassword').value;
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: selectedUid, passcode: password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          loginModal.classList.remove('show');
          loadUserInfo();
          loadPosts();
        }
      });
    });
  
    // 退出登录
    document.getElementById('logout').addEventListener('click', () => {
      fetch('/api/logout', { method: 'POST' }).then(() => location.reload());
    });
  
    // 加载当前登录用户信息
    function loadUserInfo() {
      fetch('/api/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            document.getElementById('header-name').textContent = data.user.username;
            document.getElementById('user-avatar').src = data.user.avatar;
            // 其它设置初始化……
          }
        });
    }
  
    // 修改头像：上传文件
    document.getElementById('avatar-input').addEventListener('change', function() {
      const formData = new FormData();
      formData.append('avatar', this.files[0]);
      fetch('/api/users/avatar', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if(data.avatar) {
          document.getElementById('user-avatar').src = data.avatar;
          // 若需要更新其他页面的头像，可调用 loadUserInfo() 或直接更新对应元素
          loadPosts();
        }
      });
    });
  
    // 更改密码处理
    document.getElementById('changePasswordBtn').addEventListener('click', () => {
      document.getElementById('passwordModal').classList.add('show');
    });
    document.getElementById('closePasswordModal').addEventListener('click', () => {
      document.getElementById('passwordModal').classList.remove('show');
    });
    document.getElementById('confirmChangePasswordBtn').addEventListener('click', () => {
      const oldPwd = document.getElementById('oldPassword').value;
      const newPwd = document.getElementById('newPassword').value;
      const confirmPwd = document.getElementById('confirmPassword').value;
      if(newPwd !== confirmPwd) {
        alert("两次输入的新密码不一致");
        return;
      }
      fetch('/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      })
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          alert(data.error);
        } else {
          alert("密码修改成功！");
          document.getElementById('passwordModal').classList.remove('show');
        }
      });
    });
  
    // 发布动态
    document.getElementById('publish').addEventListener('click', () => {
      const note = document.getElementById('post-text').value;
      const place = document.getElementById('post-place').value;
      if(!note.trim()) {
        alert("请输入动态内容");
        return;
      }
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note, place })
      })
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          alert(data.error);
        } else {
          document.getElementById('post-text').value = "";
          loadPosts();
        }
      });
    });
  
    // 加载动态列表
    function loadPosts() {
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => {
          const list = document.getElementById('moments-list');
          list.innerHTML = "";
          data.posts.forEach(post => {
            const div = document.createElement('div');
            div.className = "post card";
            div.innerHTML = `
              <div class="post-header">
                <img class="avatar-img" src="${post.avatar}" alt="${post.username}">
                <strong>${post.username}</strong>
                <span>${new Date(post.created_at).toLocaleString()}</span>
              </div>
              <div class="post-body">
                <p>${post.note}</p>
              </div>
            `;
            list.appendChild(div);
          });
        });
    }
  
    // 主题切换
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  
    // 初始加载（若已有登录状态则加载数据）
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          loginModal.classList.remove('show');
          loadUserInfo();
          loadPosts();
        }
      });
  });
  