import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0    // ← 这里定义了一个响应式的 state 属性 count，初始值为 0
  }),
  actions: {
    increment() {
      console.log('→ increment called, before:', this.count)
      this.count++                   // ← 通过 this.count++ 修改了 state
      console.log('→ after:', this.count)
    }
  }
})
