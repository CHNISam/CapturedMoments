<template>
  <div class="photos">
    <div v-for="(img,i) in imgs.slice(0,3)"
         :key="i"
         class="thumb"
         @click="$emit('open', i)">
      <img :src="img" />
      <div v-if="i===2 && imgs.length>3" class="thumb-overlay">
        <span>+{{ imgs.length-3 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ imgs:Array })
defineEmits(['open'])
</script>

<style scoped>
.photos{display:flex;gap:6px}
.thumb{position:relative;width:80px;height:80px;cursor:pointer}
.thumb img{width:100%;height:100%;object-fit:cover;border-radius:4px}
.thumb-overlay{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center;color:#fff;border-radius:4px}
</style>
