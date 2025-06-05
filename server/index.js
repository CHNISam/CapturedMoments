// server/index.js

// —— 依赖模块 —— 
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// —— 初始化 Express 应用 —— 
const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// —— 中间件 —— 
app.use(cors());
app.use(express.json());

// —— 静态资源目录，用于托管上传后的文件 —— 
app.use('/uploads', express.static(uploadDir));

// —— 配置 multer 存储 ——
// 1. 确保在项目根目录下已创建名为 uploads 的文件夹
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 使用 时间戳-原文件名 保证文件名唯一
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// —— 上传接口 —— 
// 前端/客户端通过 `-F image=@...` 将文件字段名设为 "image"
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  // 返回一个可访问的 URL 路径
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// —— 启动服务 —— 
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
