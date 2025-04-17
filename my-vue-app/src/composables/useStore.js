import { computed, reactive } from 'vue'

const state = reactive({
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  posts:       JSON.parse(localStorage.getItem('posts')) || [],
  theme:       localStorage.getItem('theme') || 'light',
  /* ……其余字段同你原来的 data() …… */
})

export function useStore () {
  // 常用派生数据直接在这里做 computed，所有组件共用
  const hasUnread = computed(() =>
    state.posts.some(p => !state.readIds?.has?.(p.id) && p.uid !== state.currentUser)
  )

  return { ...state, hasUnread }
}
