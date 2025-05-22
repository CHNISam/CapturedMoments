<!-- ===========================================
     src/views/settings/SettingsLayout.vue
     双栏（桌面）+ 顶部 Tabs（移动）
=========================================== -->
<template>
  <section id="settings" class="settings-page">

    <!-- ========= 📱 Mobile：顶部 Tabs ========= -->
    <template v-if="isMobile">
      <nav class="mobile-tabs">
        <button
          v-for="item in navItems"
          :key="item.key"
          :class="['tab-btn', { active: $route.path.endsWith(item.key) }]"
          @click="goto(item.key)"
        >
          <span class="tab-icon" v-html="item.icon" />
          {{ item.label }}
        </button>
      </nav>
      <router-view class="mobile-content" />
    </template>

    <!-- ========= 💻 Desktop：左栏 + 内容 ========= -->
    <template v-else>
      <div class="desktop-wrapper">
        <!-- ─── 左侧导航 ─── -->
        <aside class="settings-nav">
          <ul class="nav-list">
            <li
              v-for="item in navItems"
              :key="item.key"
              :class="['nav-item', { active: $route.path.endsWith(item.key) }]"
              @click="goto(item.key)"
            >
              <span class="nav-icon" v-html="item.icon" />
              <span class="nav-label">{{ item.label }}</span>
            </li>
          </ul>
        </aside>

        <!-- ─── 右侧内容 ─── -->
        <div class="settings-content">
          <router-view />
        </div>
      </div>
    </template>

  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route  = useRoute();

/* ===== 判断移动端（可替换为 CSS @media / matchMedia） ===== */
const isMobile = computed(() => window.innerWidth < 768);
function handleResize() { isMobile.value = window.innerWidth < 768; }
onMounted(() => window.addEventListener('resize', handleResize));
onBeforeUnmount(() => window.removeEventListener('resize', handleResize));

/* ===== 左侧 / 顶部导航配置 ===== */
const navItems = [
  {
    key: 'visual',
    label: '🎨 视觉',
    icon: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
             <path d="M2.5 21.5l2-2 4-4L6 15l-4 4v2.5h2.5z"/>
             <path d="M6 15l9-9 3 3-9 9"/>
             <path d="M14.5 5.5l3.5-3.5 3 3-3.5 3.5"/>
           </svg>`
  },
  {
    key: 'account',
    label: '👤 账户',
    icon: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
             <path d="M4 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2"/>
           </svg>`
  },
  {
    key: 'ai',
    label: '🤖 AI',
    icon: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z"/>
           </svg>`
  }
];

function goto(key) { router.push(`/settings/${key}`); }
</script>

<style scoped>
/* ===== 基础布局 ===== */
.settings-page { display: flex; flex-direction: column; height: 100%; }

/* ===== Mobile Tabs ===== */
.mobile-tabs { display: flex; overflow-x: auto; }
.tab-btn {
  flex: 1 0 auto; padding: .75rem 1rem; font-size: .9rem;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  border-bottom: 2px solid transparent; background: none;
}
.tab-btn.active { border-color: var(--accent-color, #42b883); }
.mobile-content { padding: 1rem; }

/* ===== Desktop 双栏 ===== */
.desktop-wrapper { display: flex; height: 100%; }
.settings-nav { width: 200px; border-right: 1px solid #e5e7eb; }
.nav-list { margin: 0; padding: 0; list-style: none; }
.nav-item {
  display: flex; align-items: center; gap: 8px;
  padding: .75rem 1rem; cursor: pointer; user-select: none;
}
.nav-item.active { background: rgba(66, 184, 131, .12); }
.settings-content { flex: 1; padding: 1.5rem 2rem; overflow-y: auto; }

/* SVG 尺寸统一 */
.nav-icon, .tab-icon { width: 20px; height: 20px; line-height: 0; }
</style>
