<!-- src/components/ImageUploader.vue -->
<template>
  <div class="image-uploader">
    <button @click="triggerFile">📷 选图</button>
    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileChange" />

    <div v-if="previewUrl" class="preview">
      <p>预览：</p>
      <img :src="previewUrl" alt="预览图" />
    </div>

    <button @click="uploadImage" :disabled="!selectedFile || isUploading">
      {{ isUploading ? '上传中…' : '上传图片' }}
    </button>

    <div v-if="uploadedUrl" class="result">
      <p>上传成功：</p>
      <a :href="uploadedUrl" target="_blank">{{ uploadedUrl }}</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      uploadedUrl: '',
      isUploading: false,
    };
  },
  methods: {
    triggerFile() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    async uploadImage() {
      if (!this.selectedFile) return;
      this.isUploading = true;
      try {
        const form = new FormData();
        form.append('image', this.selectedFile);
        const res = await axios.post('http://localhost:3002/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        this.uploadedUrl = res.data.url.startsWith('/')
          ? `http://localhost:3002${res.data.url}`
          : res.data.url;
        this.$emit('uploaded', this.uploadedUrl); // 可供父组件监听
      } catch (err) {
        console.error('上传失败', err);
        alert('上传失败');
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
.preview img {
  max-width: 200px;
  margin-top: 8px;
  border-radius: 4px;
}
.result {
  margin-top: 10px;
}
</style>
