<template>
  <div id="passwordModal" class="modal show">
    <div class="box" style="text-align:center; max-width:340px">
      <span class="close" @click="$emit('close')">×</span>
      <h3>更改密码</h3>
      <div style="margin-top:16px;">
        <input type="password" v-model="oldPassword" placeholder="旧密码" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;margin-bottom:8px;">
        <input type="password" v-model="newPassword" placeholder="新密码" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;margin-bottom:8px;">
        <input type="password" v-model="confirmPassword" placeholder="确认新密码" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;margin-bottom:8px;">
        <button @click="changePassword" class="btn-publish" style="margin-top:12px;">确认更改</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordModal',
  props: {
    currentUser: String
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    changePassword() {
      this.$emit('changePassword', {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      });
    }
  }
}
</script>
