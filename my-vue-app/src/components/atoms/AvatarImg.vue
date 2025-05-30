<script setup>
defineProps({ src:String, size:{type:Number,default:32} })
</script>

<template>
  <img :src="src" :style="{width:size+'px',height:size+'px'}"
       class="avatar-img" alt="avatar" />
</template>

<style scoped>
.avatar-img{ border-radius:50%; object-fit:cover; }
</style>
