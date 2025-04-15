<template>
  <div>
    <h2 class="big">设置</h2>
    <div class="card">
      <fieldset>
        <legend>外观</legend>
        <div class="setting-item">
          <span>暗黑模式</span>
          <input type="checkbox" :checked="theme==='dark'" @change="$emit('toggle-theme')">
        </div>
      </fieldset>
      <fieldset>
        <legend>桌宠 / LLM</legend>
        <div class="setting-item">
          <span>显示桌宠</span>
          <input type="checkbox" v-model="localPetEnabled">
        </div>
        <div class="setting-item">
          <span>桌宠类型</span>
          <select v-model="localPetType">
            <option value="cat">猫娘</option>
            <option value="bird">魈鸟</option>
          </select>
        </div>
        <div class="setting-item">
          <span>启用 LLM</span>
          <input type="checkbox" v-model="localLLMEnabled">
        </div>
        <div class="setting-item">
          <span>桌宠 Prompt</span>
          <input v-model="localPetPrompt">
        </div>
      </fieldset>
      <fieldset>
        <legend>账户</legend>
        <div class="setting-item">
          <span>头像</span>
          <label class="btn-ghost upload-btn">
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input type="file" accept="image/*" @change="changeAvatar">
          </label>
          <img :src="avatar" alt="Avatar" style="width:40px; height:40px; border-radius:50%;">
        </div>
        <div class="setting-item">
          <span>我的昵称</span>
          <input type="text" v-model="localDisplayName">
        </div>
        <div class="setting-item">
          <span>更改密码</span>
          <button @click="$emit('open-password-modal')" class="btn-ghost">更改密码</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>勋章</legend>
        <div class="setting-item" style="flex-direction: row; align-items: center;">
          <button @click="$emit('open-badge-modal')" class="btn-ghost">更换勋章</button>
          <span v-if="badge !== 'none'" class="badge" 
                :class="{'best': badge==='best', 'catgirl': badge==='catgirl'}">
            {{ badgeName }}
          </span>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  props: {
    theme: String,
    petEnabled: Boolean,
    petType: String,
    llmEnabled: Boolean,
    petPrompt: String,
    avatar: String,
    displayName: String,
    badge: String
  },
  data() {
    return {
      localPetEnabled: this.petEnabled,
      localPetType: this.petType,
      localLLMEnabled: this.llmEnabled,
      localPetPrompt: this.petPrompt,
      localDisplayName: this.displayName
    }
  },
  watch: {
    localPetEnabled(newVal) {
      this.emitSettings();
    },
    localPetType(newVal) {
      this.emitSettings();
    },
    localLLMEnabled(newVal) {
      this.emitSettings();
    },
    localPetPrompt(newVal) {
      this.emitSettings();
    },
    localDisplayName(newVal) {
      this.$emit('update-displayName', newVal);
    }
  },
  computed: {
    badgeName() {
      if (this.badge === 'best') return '最好的大佬';
      if (this.badge === 'catgirl') return '你才是猫娘';
      return '';
    }
  },
  methods: {
    emitSettings() {
      this.$emit('update-settings', {
        petEnabled: this.localPetEnabled,
        petType: this.localPetType,
        llmEnabled: this.localLLMEnabled,
        petPrompt: this.localPetPrompt
      });
    },
    changeAvatar(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.$emit('update-avatar', ev.target.result);
      }
      reader.readAsDataURL(file);
    }
  }
}
</script>
