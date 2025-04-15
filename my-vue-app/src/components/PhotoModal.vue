<template>
  <div class="modal show" @click.self="close">
    <div class="box">
      <span class="close" @click="close">×</span>
      <img :src="src">
      <p style="margin-top:8px;font-size:14px;color:#888">{{ meta }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoModal',
  props: {
    src: String,
    meta: String
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>
