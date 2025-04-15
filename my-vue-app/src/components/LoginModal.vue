<template>
  <div id="loginModal" class="modal show">
    <div class="box" style="text-align:center; max-width:340px">
      <h3>选择登录身份</h3>
      <div class="avatar-container" style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
        <div class="avatar" data-user="Furinya" @click="selectUser('Furinya')">
          <img src="https://placehold.co/90x90?text=F" alt="Furinya">
          <div>Furinya</div>
        </div>
        <div class="avatar" data-user="离" @click="selectUser('离')">
          <img src="https://placehold.co/90x90?text=离" alt="离">
          <div>离</div>
        </div>
      </div>
      <div v-if="selectedUser">
        <input type="password" v-model="password" placeholder="请输入密码" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;">
        <button @click="login" class="btn-publish" style="margin-top:12px;">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginModal',
  data() {
    return {
      selectedUser: null,
      password: ''
    }
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user;
      this.password = '';
    },
    login() {
      if (!this.selectedUser) return;
      this.$emit('login', { user: this.selectedUser, password: this.password });
    }
  }
}
</script>
