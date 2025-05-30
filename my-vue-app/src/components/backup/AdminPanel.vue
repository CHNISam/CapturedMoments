<template>
    <div class="admin-panel">
      <h2>管理员面板</h2>
  
      <!-- 防护模式开关 -->
      <section class="panel-section lock-section">
        <label class="toggle-label">
          <input type="checkbox" v-model="locked" @change="toggleLock" />
          <span>防护模式：<strong>{{ locked ? '已启用' : '已禁用' }}</strong></span>
        </label>
      </section>
  
      <!-- 搜索过滤 -->
      <section class="panel-section search-section">
        <input
          type="text"
          v-model.trim="filterKeyword"
          placeholder="搜索 UID 或 IP"
          class="filter-input"
        />
      </section>
  
      <!-- 日志统计 -->
      <section class="panel-section stats-section">
        <p>总记录：{{ filteredLogs.length }} 条，当前页：{{ currentPage }} / {{ totalPages }} 页</p>
      </section>
  
      <!-- 攻击日志 -->
      <section class="panel-section logs-section">
        <table class="log-table">
          <thead>
            <tr>
              <th @click="sort('time')">
                时间 <span>{{ sortKey==='time' ? (sortOrder==='asc' ? '↑' : '↓') : '' }}</span>
              </th>
              <th @click="sort('uid')">
                UID <span>{{ sortKey==='uid' ? (sortOrder==='asc' ? '↑' : '↓') : '' }}</span>
              </th>
              <th @click="sort('ip')">
                来源 IP <span>{{ sortKey==='ip' ? (sortOrder==='asc' ? '↑' : '↓') : '' }}</span>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in paginatedLogs" :key="entry.id">
              <td>{{ formatTime(entry.time) }}</td>
              <td>{{ entry.uid }}</td>
              <td>{{ entry.ip || '未知' }}</td>
              <td>
                <button @click="blockIp(entry.ip)">封禁 IP</button>
              </td>
            </tr>
            <tr v-if="paginatedLogs.length === 0">
              <td colspan="4">暂无匹配记录</td>
            </tr>
          </tbody>
        </table>
  
        <!-- 分页控制 -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage===1">上一页</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage===totalPages">下一页</button>
        </div>
  
        <button @click="clearLogs" class="clear-btn">清除所有日志</button>
      </section>
  
      <!-- 已封禁 IP 列表 -->
      <section class="panel-section blocked-section">
        <h3>已封禁 IP ({{ blockedIps.length }})</h3>
        <ul class="blocked-list">
          <li v-for="ip in blockedIps" :key="ip">
            <span>{{ ip }}</span>
            <button @click="unblockIp(ip)">解封</button>
          </li>
          <li v-if="blockedIps.length===0">暂无封禁 IP</li>
        </ul>
      </section>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, ref } from 'vue'
  
  const ADMIN_UID = '217122260'
  const currentUser = sessionStorage.getItem('currentUser') || ''
  const isAdmin = computed(() => currentUser === ADMIN_UID)
  
  // 防护模式状态
  const locked = ref(false)
  
  // 日志及封禁列表
  const attackLogs = ref([])
  const blockedIps = ref([])
  
  // 搜索与排序
  const filterKeyword = ref('')
  const sortKey = ref('time')
  const sortOrder = ref('desc')
  
  // 分页
  const currentPage = ref(1)
  const pageSize = ref(10)
  
  // 过滤
  const filteredLogs = computed(() => attackLogs.value.filter(entry =>
    !filterKeyword.value || entry.uid.includes(filterKeyword.value) || (entry.ip && entry.ip.includes(filterKeyword.value))
  ))
  
  // 排序
  const sortedLogs = computed(() => {
    const arr = [...filteredLogs.value]
    return arr.sort((a, b) => {
      const order = sortOrder.value === 'asc' ? 1 : -1
      if (sortKey.value === 'time') return (a.time - b.time) * order
      return String(a[sortKey.value]).localeCompare(String(b[sortKey.value])) * order
    })
  })
  
  // 分页数据
  const totalPages = computed(() => Math.max(1, Math.ceil(sortedLogs.value.length / pageSize.value)))
  const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return sortedLogs.value.slice(start, start + pageSize.value)
  })
  
  // 初始化读取
  onMounted(() => {
    try { locked.value = JSON.parse(localStorage.getItem('auth_locked') || 'false') } catch { locked.value = true }
    try { attackLogs.value = JSON.parse(localStorage.getItem('attack_logs') || '[]') } catch { attackLogs.value = [] }
    try { blockedIps.value = JSON.parse(localStorage.getItem('blocked_ips') || '[]') } catch { blockedIps.value = [] }
  })
  
  // 方法
  function toggleLock() {
    localStorage.setItem('auth_locked', JSON.stringify(locked.value))
  }
  function sort(key) {
    if (sortKey.value === key) sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    else { sortKey.value = key; sortOrder.value = 'asc' }
    currentPage.value = 1
  }
  function prevPage() { if (currentPage.value > 1) currentPage.value-- }
  function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
  function formatTime(ts) { return new Date(ts).toLocaleString('zh-CN', { hour12: false }) }
  function clearLogs() { attackLogs.value = []; localStorage.removeItem('attack_logs'); currentPage.value = 1 }
  function blockIp(ip) {
    if (!ip || blockedIps.value.includes(ip)) return
    blockedIps.value.push(ip)
    localStorage.setItem('blocked_ips', JSON.stringify(blockedIps.value))
  }
  function unblockIp(ip) {
    blockedIps.value = blockedIps.value.filter(i => i !== ip)
    localStorage.setItem('blocked_ips', JSON.stringify(blockedIps.value))
  }
  </script>
  
  <style scoped>
  .admin-panel { padding: 16px; background: var(--panel-bg); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .panel-section { margin-bottom: 24px; }
  .toggle-label { display: flex; align-items: center; gap: 8px; }
  .filter-input { width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
  .stats-section p { margin: 0; }
  .log-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .log-table th, .log-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  .log-table th { cursor: pointer; background: var(--table-header-bg); }
  .pagination { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
  .clear-btn { padding: 6px 12px; border: none; background: var(--primary); color: #fff; border-radius: 4px; cursor: pointer; }
  .blocked-list { list-style: none; padding: 0; }
  .blocked-list li { display: flex; justify-content: space-between; padding: 4px 0; }
  button { padding: 4px 8px; border: none; background: var(--primary); color: #fff; border-radius: 4px; cursor: pointer; }
  button:hover { opacity: 0.9; }
  </style>