// src/views/AlbumsPage.vue
<template>
  <div class="albums-page">
    <h2 class="page-title">相册 (本地上传测试)</h2>
    <div class="upload-area">
      <label class="upload-label">
        <svg class="icon upload-icon" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5"/></svg>
        选择本地照片
        <input type="file" accept="image/*" multiple @change="onFileChange" />
      </label>
    </div>

    <div v-if="photos.length" class="photo-grid">
      <div
        v-for="(url, idx) in photos"
        :key="idx"
        class="photo-item"
        @click="openSlider(idx)"
      >
        <img :src="url" alt="photo" class="photo-thumb" />
      </div>
    </div>
    <div v-else class="empty-state">暂无照片，快去上传吧~</div>

    <ImageSliderModal
      :images="photos"
      :initial-index="sliderIndex"
      v-model:visible="sliderVisible"
      @delete-image="onDeleteImage"
    />
  </div>
</template>

<script>
import ImageSliderModal from '@/components/organisms/ImageSliderModal.vue';
export default {
  name: 'AlbumsPage',
  components: { ImageSliderModal },
  data() {
    return {
      photos: [],
      sliderVisible: false,
      sliderIndex: 0,
    };
  },
  methods: {
    onFileChange(e) {
      Array.from(e.target.files).forEach(f => {
        this.photos.push(URL.createObjectURL(f));
      });
    },
    openSlider(idx) {
      this.sliderIndex = idx;
      this.sliderVisible = true;
    },
    onDeleteImage(idx) {
      this.photos.splice(idx, 1);
      if (!this.photos.length) this.sliderVisible = false;
      else if (idx >= this.photos.length) this.sliderIndex = this.photos.length - 1;
    }
  }
};
</script>

<style scoped>
.albums-page { padding: 24px; max-width: 900px; margin: 0 auto; }
.page-title { font-size: 24px; text-align: center; margin-bottom: 16px; }
.upload-area { text-align: center; margin-bottom: 24px; }
.upload-label { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; color: var(--primary); font-weight: 500; }
.upload-label input { display: none; }
.upload-icon { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 2; }
.photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 18px; justify-items: center; }
.photo-item { width: 100%; cursor: pointer; overflow: hidden; border-radius: 8px; transition: transform .2s; }
.photo-item:hover { transform: scale(1.05); }
.photo-thumb { width: 100%; height: 120px; object-fit: cover; display: block; }
.empty-state { text-align: center; color: #888; margin-top: 40px; }
</style>
