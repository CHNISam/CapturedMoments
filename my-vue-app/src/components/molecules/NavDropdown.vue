<template>
  <div class="nav-avatar" @mouseenter="open=true" @mouseleave="open=false">
    <AvatarImg :src="src" :size="32" />
    <transition name="dropdown-fade">
      <div v-if="open" class="nav-dropdown">
        <button class="dropdown-item" @click="$emit('settings')">
          <!-- 齿轮 SVG -->
          ...
          设置
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" @click="$emit('logout')">
          <!-- 退出 SVG -->
          退出
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import AvatarImg from '@/components/atoms/AvatarImg.vue'
import { ref } from 'vue'
defineProps({ src:String })
const open = ref(false)
</script>
