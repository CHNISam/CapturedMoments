<script setup>
defineProps({
  aria:  { type:String, default:'' },
  size:  { type:Number, default:40 }
})
</script>

<template>
  <button class="icon-btn" :aria-label="aria">
    <slot />
  </button>
</template>

<style scoped>
.icon-btn{
  width: var(--btn-size,40px);
  height: var(--btn-size,40px);
  display:flex;align-items:center;justify-content:center;
  background:none;border:none;border-radius:4px;cursor:pointer;
}
.icon-btn:hover{ background:#383838; }
</style>
