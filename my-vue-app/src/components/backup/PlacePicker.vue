<template>
    <div class="place-picker" @click.stop>
      <button class="place-btn" @click="toggle">
        <!-- default slot for custom icon -->
        <slot name="icon">
          <svg class="location-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" style="width:24px;height:24px;">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </slot>
        <span class="place-label">{{ modelValue || placeholder }}</span>
      </button>
      <div v-show="visible" class="place-options">
        <button
          v-for="opt in options"
          :key="opt"
          class="place-item"
          @click="select(opt)">
          {{ opt || '无' }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PlacePicker',
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        default: '选择地点'
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      toggle() {
        this.visible = !this.visible;
      },
      select(opt) {
        this.$emit('update:modelValue', opt);
        this.visible = false;
      }
    }
  }
  </script>
  
  <style scoped>
  .place-picker {
    position: relative;
    display: inline-block;
  }
  .place-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px;
    background: none;
    border: none;
    cursor: pointer;
  }
  .place-options {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--card-light);
    border: var(--glass-border);
    backdrop-filter: blur(calc(var(--blur)/2));
    border-radius: var(--radius);
    margin-top: 4px;
    padding: 6px 0;
    z-index: 300;
    display: flex;
    flex-direction: column;
  }
  .place-item {
    padding: 6px 12px;
    font-size: 14px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
  }
  .place-item:hover {
    background: rgba(74, 144, 226, 0.1);
  }
  body.dark .place-options {
    background: var(--card-dark);
    border-color: rgba(255, 255, 255, 0.15);
  }
  body.dark .place-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  </style>
  