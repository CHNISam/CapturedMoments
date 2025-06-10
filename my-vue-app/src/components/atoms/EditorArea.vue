<template>
  <div
    ref="editor"
    class="ta-preview"
    contenteditable="true"
    @input="onInput"
    @keydown.enter.prevent="onEnter"
    @mouseup="saveCaret"
    @keyup="saveCaret"
    data-placeholder="说点什么..."
  ></div>
</template>

<script setup>
import { ref } from 'vue';

// 引出三个事件：input、enter、save-caret
const emit = defineEmits(['input','enter','save-caret']);
const editor = ref(null);

function onInput()    { emit('input',    editor.value.innerHTML); }
function onEnter()    { emit('enter'); }
function saveCaret()  { emit('save-caret'); }
</script>

<style scoped>
.ta-preview {
  min-height: 200px;
  padding: 10px;
  color: #eee;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  outline: none;
  overflow: auto;
}
.ta-preview:empty::before {
  content: attr(data-placeholder);
  color: #888;
}
</style>
