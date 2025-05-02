<template>
  <div class="uploader">
    <input type="file" @change="onFileChange" accept="image/*"/>
    <button :disabled="!file" @click="upload">上传</button>

    <div v-if="previewUrl" class="preview">
      <p>上传成功，预览：</p>
      <img :src="previewUrl" style="max-width:300px"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { file: null, previewUrl: '' };
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async upload() {
      if (!this.file) return;
      const form = new FormData();
      form.append('image', this.file);
      try {
        // 🔥 注意：这里一定写明端口 3001
        const res = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: form
        });
        const json = await res.json();
        // 从 variants 里任选一个展示
        this.previewUrl = json.variants['640w-med'] || Object.values(json.variants)[0];
      } catch (e) {
        console.error(e);
        alert('上传失败，请检查控制台');
      }
    }
  }
};
</script>
