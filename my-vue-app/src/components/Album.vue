<template>
  <div>
    <h2 class="big">相册</h2>
    <div class="album-tabs">
      <button :class="{ on: albumMode==='time' }" @click="albumMode='time'">按时间</button>
      <button :class="{ on: albumMode==='region' }" @click="albumMode='region'">按地区</button>
    </div>
    <div id="album-grid" class="grid">
      <template v-for="(group, key) in groupedPhotos" :key="key">
        <h4 style="grid-column:1/-1; margin:4px 0 6px">{{ key }}</h4>
        <div 
          v-for="(photo, index) in group" 
          :key="index" 
          class="photo" 
          @click="openPhoto(photo)"
        >
          <img :src="photo.url">
          <span>{{ photo.place }}</span>
        </div>
      </template>
    </div>
    <div id="album-empty" class="hidden" style="text-align:center;margin-top:30px;color:#888" v-if="allPhotos.length === 0">
      暂无照片，快去上传吧~
    </div>
  </div>
</template>

<script>
export default {
  name: 'Album',
  props: {
    posts: Array
  },
  data() {
    return {
      albumMode: 'time'
    }
  },
  computed: {
    allPhotos() {
      const photos = [];
      this.posts.forEach(post => {
        post.imgs.forEach(url => {
          photos.push({
            url: url,
            place: post.place || '未知',
            date: new Date(post.ts).toISOString().slice(0,10)
          });
        });
      });
      return photos;
    },
    groupedPhotos() {
      const groups = {};
      this.allPhotos.forEach(photo => {
        const key = this.albumMode === 'time' ? photo.date.slice(0,7) : photo.place;
        if (!groups[key]) groups[key] = [];
        groups[key].push(photo);
      });
      return groups;
    }
  },
  methods: {
    openPhoto(photo) {
      const meta = `${photo.date} · ${photo.place}`;
      this.$emit('open-photo', photo.url, meta);
    }
  }
}
</script>
