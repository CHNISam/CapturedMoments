<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-backdrop" @click.self="close">
      <div class="modal-box">
        <span class="close-btn" @click="close">×</span>
        <h3 class="modal-title">修改昵称</h3>
        <div class="modal-body">
          <TextInput v-model="localDraft" placeholder="输入新的昵称" />
        </div>
        <div class="modal-footer">
          <GhostBtn @click="close">取消</GhostBtn>
          <ShadowBtn @click="confirm">确定</ShadowBtn>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import GhostBtn from '@/components/atoms/GhostBtn.vue'
import ShadowBtn from '@/components/atoms/ShadowBtn.vue'
import TextInput from '@/components/atoms/TextInput.vue'
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  visible:    { type: Boolean, required: true },
  modelValue: { type: String, required: true }
})
const emit = defineEmits(['update:visible', 'update:modelValue'])

const localDraft = ref(props.modelValue)
watch(() => props.modelValue, v => (localDraft.value = v))

function close() {
  emit('update:visible', false)
}

function confirm() {
  emit('update:modelValue', localDraft.value.trim())
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
.modal-box {
  background: #1f1f1f;
  border-radius: 8px;
  width: 360px;
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
  margin-bottom: 24px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
