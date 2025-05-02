<template>
    <transition name="fade">
        <h3 v-if="visible" class="animated-title">{{ displayedText }}</h3>
    </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    text: { type: String, required: true },
    speed: { type: Number, default: 50 }
})

const displayedText = ref('')
const visible = ref(false)
let timer = null

// 在这里定义一个复用的打字函数
function startTyping(text) {
    clearInterval(timer)
    displayedText.value = ''
    visible.value = true
    let idx = 0
    timer = setInterval(() => {
        displayedText.value += text[idx++] || ''
        if (idx > text.length) clearInterval(timer)
    }, props.speed)
}

function fadeOutThenType(text) {
  visible.value = false
  setTimeout(() => {
    startTyping(text)
  }, 300 + 200) // 300ms fade + 200ms停顿
}

// 监视 text 变化，并且首次也触发
watch(
    () => props.text,
    (newText) => startTyping(newText),
    { immediate: true }
)

</script>

<style scoped>
.animated-title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    color: var(--text-primary);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>