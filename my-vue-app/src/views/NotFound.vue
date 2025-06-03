<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <div class="not-found-card">
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，你访问的页面不存在。</p>
      <router-link to="/" class="home-link">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background: var(--bg-dark);
  color: var(--text-dark);
  align-items: center;
  justify-content: center;
}

.not-found-card {
  text-align: center;
  background: var(--card-dark);
  padding: 40px 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.error-code {
  font-size: 6rem;
  margin: 0;
  color: var(--accent);
}

.error-message {
  font-size: 1.25rem;
  margin: 16px 0;
  color: var(--text-dark);
}

.home-link {
  display: inline-block;
  margin-top: 24px;
  padding: 10px 20px;
  background: var(--primary);
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.home-link:hover {
  background: darken(var(--primary), 10%);
}
</style>
