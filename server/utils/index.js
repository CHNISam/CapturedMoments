const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// 简化上传接口：只返回上传后的图片地址
app.post('/upload', upload.single('image'), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(req.file.path)}`;
  res.json({ url: fileUrl });
});

// 静态资源托管，让浏览器能访问 /uploads 下的图片
app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`📂 Image upload server running at http://localhost:${PORT}`);
});
