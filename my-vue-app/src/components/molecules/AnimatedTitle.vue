<!-- src/components/molecules/AnimatedTitle.vue -->
<template>
  <transition name="fade-scale">
    <!-- 在这里加上 v-bind="$attrs"，让 class、style 等 attrs 都能穿透进来 -->
    <h3
      v-if="visible"
      class="animated-title"
      v-bind="$attrs"
    >
      {{ displayedText }}<span class="typing-cursor"></span>
    </h3>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  text:           { type: String, required: true },
  speedFirst:     { type: Number, default: 120 },
  speedMid:       { type: Number, default: 60 },
  speedLast:      { type: Number, default: 40 },
  fadeDuration:   { type: Number, default: 150 },
  pauseDuration:  { type: Number, default: 150 }
})

const displayedText = ref('')
const visible       = ref(false)
let timerId

function startTyping(text) {
  displayedText.value = ''
  visible.value       = true
  let i = 0

  function typeChar() {
    if (i < text.length) {
      displayedText.value += text[i++]
      const delay =
        i === 1               ? props.speedFirst :
        i === text.length     ? props.speedLast  :
                                props.speedMid
      timerId = setTimeout(typeChar, delay)
    }
  }

  typeChar()
}

function fadeOutThenType(text) {
  visible.value = false
  clearTimeout(timerId)
  setTimeout(() => startTyping(text), props.fadeDuration + props.pauseDuration)
}

watch(
  () => props.text,
  newText => fadeOutThenType(newText),
  { immediate: true }
)
</script>

<style scoped>
.animated-title {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  /* 这里的 var(--text-primary) 会被外部的 .dark-title 覆盖掉 */
  color: var(--text-primary);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.typing-cursor {
  display: inline-block;
  width: 1px;
  height: 1em;
  background-color: currentColor;
  margin-left: 4px;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
</style>
