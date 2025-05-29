<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="counter.increment()">Increment</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'; // 根据你的路径实际调整
import { storeToRefs } from 'pinia'

const counter = useCounterStore()
const { count } = storeToRefs(counter)  // ✅ 解构成响应式的 count
</script>
