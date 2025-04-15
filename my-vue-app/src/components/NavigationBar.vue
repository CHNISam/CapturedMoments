<template>
  <nav>
    <div class="logo">把回忆拼好给你</div>
    <div class="menu">
      <a href="#moments" @click.prevent="scroll('moments')">
        动态<span class="red" v-if="showNavDot"></span>
      </a>
      <a href="#album" @click.prevent="scroll('album')">相册</a>
      <a href="#settings" @click.prevent="scroll('settings')">设置</a>
      <span id="header-name" style="font-weight:600;">{{ displayName }}</span>
      <a @click="logout" class="btn-ghost">退出</a>
      <button @click="toggleTheme" class="btn-ghost">
        <svg v-if="theme==='light'" id="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/></svg>
        <svg v-else id="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    currentUser: String,
    displayName: String,
    theme: String
  },
  data() {
    return {
      showNavDot: false
    }
  },
  methods: {
    toggleTheme() {
      this.$emit('toggle-theme');
    },
    logout() {
      this.$emit('logout');
    },
    scroll(section) {
      this.$emit('scroll-to', section);
    }
  }
}
</script>
