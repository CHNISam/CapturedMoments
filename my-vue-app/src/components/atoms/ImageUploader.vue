<template>
  <div class="image-uploader">
    <input
      type="file"
      accept="image/*"
      @change="onChange"
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['select'])
function onChange(e) {
  const file = e.target.files && e.target.files[0]
  if (file) emit('select', file)
}
</script>

<style scoped>
.image-uploader input {
  cursor: pointer;
}
</style>
