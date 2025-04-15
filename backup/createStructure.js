const fs = require('fs');
const path = require('path');

const baseDir = 'D:/Desktop/WorkSpace/CapturedMoments/my-vue-app';

const folders = [
  'public',
  'src',
  'src/components'
];

const files = [
  'public/index.html',
  'src/main.js',
  'src/App.vue',
  'src/components/NavigationBar.vue',
  'src/components/Moments.vue',
  'src/components/Album.vue',
  'src/components/Settings.vue',
  'src/components/PhotoModal.vue',
  'src/components/LoginModal.vue',
  'src/components/BadgeModal.vue',
  'src/components/PasswordModal.vue',
  'src/components/Pet.vue',
  'src/components/StarCanvas.vue',
  'package.json'
];

folders.forEach(folder => {
  const fullPath = path.join(baseDir, folder);
  fs.mkdirSync(fullPath, { recursive: true });
});

files.forEach(file => {
  const fullPath = path.join(baseDir, file);
  fs.writeFileSync(fullPath, '');
});

console.log('Vue 项目结构已创建 ✔');
