<!-- src/components/organisms/PostEditor.vue -->
<template>
  <div class="editor-page">
    <div class="np-input-wrapper">
      <!-- 文本编辑区 -->
      <EditorArea
        ref="editor"
        v-model:html="content"
        @enter="publish"
        @save-caret="saveCaret" />

      <!-- 上传按钮 -->
      <FabButton class="upload-fab" @click="triggerUpload">
        <!-- 直接放 SVG -->
        <svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"/>
        </svg>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          @change="onFilesChange"
          style="display:none"
        />
      </FabButton>

      <!-- 表情按钮 -->
      <FabButton class="emoji-fab" @click="togglePicker">
        <!-- 直接放表情 SVG -->
        <svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <circle cx="12" cy="12" r="10" />
          <circle cx="9" cy="10" r="1" />
          <circle cx="15" cy="10" r="1" />
          <path d="M8 16c1.333-1 2.667-1 4 0" />
        </svg>
      </FabButton>

      <!-- 贴图面板 -->
      <StickerPicker
        v-if="pickerVisible"
        :stickers="displayedStickers"
        :prevDisabled="stickerPage===0"
        :nextDisabled="(stickerPage+1)*stickersPerPage>=stickers.length"
        @select="insertSticker"
        @prev="prevPage"
        @next="nextPage" />

      <!-- 发布控件 -->
      <PublishControls @publish="publish" />
    </div>
  </div>
</template>

<script setup>
import EditorArea from '@/components/atoms/EditorArea.vue';
import FabButton from '@/components/atoms/FabButton.vue';
import PublishControls from '@/components/molecules/PublishControls.vue';
import StickerPicker from '@/components/molecules/StickerPicker.vue';
import { computed, onMounted, ref } from 'vue';

const content = ref('');
const savedRange = ref(null);
const pickerVisible = ref(false);
const stickerPage = ref(0);
const stickersPerPage = 32;
const stickers = ref([]);

onMounted(() => {
  const ctx = require.context('@/assets/stickers/原神表情', true, /\.png$/);
  stickers.value = ctx.keys().map((key,i)=>({id:i, url:ctx(key)}));
});

const displayedStickers = computed(() => {
  const start = stickerPage.value * stickersPerPage;
  return stickers.value.slice(start, start + stickersPerPage);
});
function nextPage() { if ((stickerPage.value+1)*stickersPerPage < stickers.value.length) stickerPage.value++; }
function prevPage() { if (stickerPage.value>0) stickerPage.value--; }

function saveCaret() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount) savedRange.value = sel.getRangeAt(0).cloneRange();
}
function restoreCaret() {
  const range = savedRange.value;
  if (!range) return;
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function triggerUpload() {
  const fi = /** @type {HTMLInputElement} */(document.querySelector('.upload-fab input'));
  fi.click();
}
function onFilesChange(e) {
  Array.from(e.target.files).forEach(f => {
    const url = URL.createObjectURL(f);
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    insertNode(img);
  });
  e.target.value = '';
}

function togglePicker() {
  if (!pickerVisible.value) saveCaret();
  pickerVisible.value = !pickerVisible.value;
}
function insertSticker(url) {
  const img = document.createElement('img');
  img.src = url;
  img.className = 'inline-sticker';
  insertNode(img);
  pickerVisible.value = false;
}

function insertNode(node) {
  restoreCaret();
  const sel = window.getSelection();
  if (!sel.rangeCount) {
    document.querySelector('.ta-preview').appendChild(node);
  } else {
    const r = sel.getRangeAt(0);
    r.deleteContents();
    r.insertNode(node);
    r.setStartAfter(node);
    sel.removeAllRanges();
    sel.addRange(r);
  }
  document.querySelector('.ta-preview').focus();
}

function publish() {
  if (!content.value.trim()) {
    alert('请输入内容后再发布');
    return;
  }
  console.log('发布内容：', content.value);
  alert('发布成功');
  // router.back() 或者其他跳转
}
</script>

<style scoped>
.np-input-wrapper {
  position: relative;
  margin-top: 56px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 16px;
}
.inline-sticker {
  display: inline-block;
  height: 1em;
  vertical-align: 0.1em;
}
</style>
