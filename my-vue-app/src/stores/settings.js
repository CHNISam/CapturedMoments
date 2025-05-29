import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'dark',
    bgSrc: localStorage.getItem('bgSrc') || '',
    bgOpacity: parseFloat(localStorage.getItem('bgOpacity') || '0.35'),
    bgBlur: parseInt(localStorage.getItem('bgBlur') || '4', 10),
    loadMode: localStorage.getItem('loadMode') || 'manual',
    imageInsertMode: localStorage.getItem('imageInsertMode') || 'preview'
  }),

  actions: {
    setTheme(val) {
      this.theme = val;
      document.body.classList.toggle('dark', val === 'dark');
      localStorage.setItem('theme', val);
    },

    setBackground(src) {
      this.bgSrc = src;
      localStorage.setItem('bgSrc', src);
    },

    setBgOpacity(val) {
      this.bgOpacity = val;
      localStorage.setItem('bgOpacity', String(val));
    },

    setBgBlur(val) {
      this.bgBlur = val;
      localStorage.setItem('bgBlur', String(val));
    },

    setLoadMode(mode) {
      this.loadMode = mode;
      localStorage.setItem('loadMode', mode);
    },

    setImageInsertMode(mode) {
      this.imageInsertMode = mode;
      localStorage.setItem('imageInsertMode', mode);
    }
  }
});
