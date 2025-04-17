<template>
  <div id="badgeModal" class="modal show">
    <div class="box">
      <span class="close" @click="$emit('close')">×</span>
      <h3>选择勋章</h3>
      <div id="badgeOptions" style="margin: 10px 0;">
        <label v-for="badge in allowedBadges" :key="badge.id" style="display:flex;align-items:center;gap:6px;margin:4px 0">
          <input type="radio" name="wear" :value="badge.id" v-model="selectedBadge">
          <span v-if="badge.id==='none'" class="badge badge-none">{{ badge.name }}</span>
          <span v-else-if="badge.id==='best'" class="badge best">{{ badge.name }}</span>
          <span v-else-if="badge.id==='catgirl'" class="badge catgirl">{{ badge.name }}</span>
          <span v-else class="badge">{{ badge.name }}</span>
        </label>
      </div>
      <button id="confirmBadge" class="btn-publish" style="margin-top:12px;" @click="confirmBadge">确认</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BadgeModal',
  props: {
    currentUser: String
  },
  data() {
    return {
      selectedBadge: localStorage.getItem('wear_' + this.currentUser) || 'none',
      BADGES: [
        { id: 'none', name: '不佩戴' },
        { id: 'best', name: '最好的大佬' },
        { id: 'catgirl', name: '你才是猫娘' }
      ]
    }
  },
  computed: {
    allowedBadges() {
      return this.BADGES.filter(b => {
        if (b.id === 'best') {
          return this.currentUser === '离';
        }
        return true;
      });
    }
  },
  methods: {
    confirmBadge() {
      this.$emit('updateBadge', this.selectedBadge);
      this.$emit('close');
    }
  }
}
</script>
