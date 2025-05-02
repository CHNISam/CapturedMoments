// Express 入口
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 监听端口
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
