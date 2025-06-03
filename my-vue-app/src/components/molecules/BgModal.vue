<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-backdrop" @click.self="close">
      <div class="modal-box bg-modal">
        <span class="close-btn" @click="close">×</span>
        <h3 class="modal-title">背景设置</h3>
        <div class="modal-body">
          <SettingItem>
            <template #label><span>上传背景</span></template>
            <template #control>
              <FileUploadButton
                label="上传图片"
                accept="image/*"
                @fileSelected="onFileSelected"
              />
            </template>
          </SettingItem>
          <SettingItem>
            <template #label><span>背景透明度</span></template>
            <template #control>
              <RangeSlider v-model="localOpacity" :min="0" :max="1" :step="0.05" />
            </template>
          </SettingItem>
          <SettingItem>
            <template #label><span>背景模糊</span></template>
            <template #control>
              <RangeSlider v-model="localBlur" :min="0" :max="20" :step="1" />
            </template>
          </SettingItem>
          <SettingItem>
            <template #label><span>清除背景</span></template>
            <template #control>
              <GhostBtn @click="clearBg">清除背景</GhostBtn>
            </template>
          </SettingItem>
        </div>
        <div class="modal-footer">
          <GhostBtn @click="close">取消</GhostBtn>
          <ShadowBtn @click="confirm">完成</ShadowBtn>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import FileUploadButton from '@/components/atoms/FileUploadButton.vue'
import GhostBtn from '@/components/atoms/GhostBtn.vue'
import RangeSlider from '@/components/atoms/RangeSlider.vue'
import ShadowBtn from '@/components/atoms/ShadowBtn.vue'
import SettingItem from '@/components/molecules/SettingItem.vue'
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  visible:     { type: Boolean, required: true },
  bgSrc:       { type: String, default: '' },
  bgOpacity:   { type: Number, default: 0.35 },
  bgBlur:      { type: Number, default: 4 }
})
const emit = defineEmits(['update:visible', 'update:bgSrc', 'update:bgOpacity', 'update:bgBlur'])

const localOpacity = ref(props.bgOpacity)
const localBlur    = ref(props.bgBlur)

watch(() => props.bgOpacity, v => (localOpacity.value = v))
watch(() => props.bgBlur, v => (localBlur.value = v))

function onFileSelected(file) {
  const reader = new FileReader()
  reader.onload = ev => {
    emit('update:bgSrc', ev.target.result)
  }
  reader.readAsDataURL(file)
}

function clearBg() {
  emit('update:bgSrc', '')
  localOpacity.value = 1
  localBlur.value = 0
  emit('update:bgOpacity', 1)
  emit('update:bgBlur', 0)
}

function confirm() {
  emit('update:bgOpacity', localOpacity.value)
  emit('update:bgBlur', localBlur.value)
  emit('update:visible', false)
}

function close() {
  // 恢复到打开前的值
  emit('update:bgOpacity', props.bgOpacity)
  emit('update:bgBlur', props.bgBlur)
  emit('update:visible', false)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box.bg-modal {
  background: #1f1f1f;
  border-radius: 8px;
  width: 480px;
  max-width: 90%;
  padding: 24px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 18px;
  color: #e0e0e0;
  cursor: pointer;
}
.modal-title {
  margin: 0 0 16px;
  color: #e0e0e0;
  font-size: 18px;
  font-weight: 600;
}
.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 24px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
