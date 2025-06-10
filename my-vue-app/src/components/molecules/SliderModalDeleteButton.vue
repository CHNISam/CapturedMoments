<!-- src/components/molecules/SliderModalDeleteButton.vue -->
<template>
  <button class="slider-modal__delete-btn" @click="$emit('click')">
    <svg viewBox="0 0 24 24" class="icon">
      <path d="M3 6h18M9 6v12m6-12v12M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6"/>
    </svg>
  </button>
</template>

<script>
export default { name: 'SliderModalDeleteButton' }
</script>

<style scoped>
.slider-modal__delete-btn {
  position: absolute; bottom:16px; right:16px;
  background: rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.12);
  width:36px; height:36px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:background .2s,transform .2s,border .2s;
  z-index:5;
}
.slider-modal__delete-btn:hover {
  background: rgba(255,255,255,0.15);
  transform: scale(1.1);
  border-color: rgba(255,255,255,0.2);
}
.icon { stroke:#fff; width:20px; height:20px; }
</style>
