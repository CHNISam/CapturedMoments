// app.js

const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// 创建上传头像的存储目录（确保目录存在）
const uploadDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 配置 multer，头像文件以当前日期时间命名，保存在 uploads 文件夹
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // 注意：确保 req.session.user 存在，否则需检查登录状态
    cb(null, 'avatar_' + req.session.user.id + '_' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// 建立数据库连接池，请根据你的实际数据库信息进行修改：
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',             // 替换为你的数据库用户名
  password: 'mypassword',   // 替换为你的数据库密码
  database: 'captured_moments', // 替换为你创建的数据库名称
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 使用 session 保存登录状态
app.use(session({
  secret: 'secret_key_change_me',
  resave: false,
  saveUninitialized: false
}));

// 设置静态文件目录（前端文件存放在 public，头像保存在 uploads 目录）
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

/* --------------------- 用户接口 ----------------------- */

// 初始化预设用户：Furinya 与 离（如果不存在则插入）
async function initUsers() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM Users WHERE uid IN ('Furinya', '离')`);
    if (rows.length < 2) {
      const users = [
        { uid: 'Furinya', username: 'Furinya', passcode: '123456' },
        { uid: '离', username: '离', passcode: '123456' }
      ];
      for (const u of users) {
        await conn.query(
          'INSERT IGNORE INTO Users (uid, username, passcode, avatar) VALUES (?, ?, ?, ?)',
          [u.uid, u.username, u.passcode, 'default.png']
        );
        // 插入默认设置
        const [userRow] = await conn.query('SELECT id FROM Users WHERE uid=?', [u.uid]);
        if (userRow.length > 0) {
          const userId = userRow[0].id;
          await conn.query(
            'INSERT IGNORE INTO Settings (user_id) VALUES (?)',
            [userId]
          );
        }
      }
    }
  } finally {
    conn.release();
  }
}
initUsers();

// 登录接口：验证 uid 和 passcode
app.post('/api/login', async (req, res) => {
  const { uid, passcode } = req.body;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM Users WHERE uid=?', [uid]);
    if (rows.length === 0) {
      return res.status(400).json({ error: '用户不存在' });
    }
    const user = rows[0];
    if (user.passcode !== passcode) {
      return res.status(400).json({ error: '密码错误' });
    }
    req.session.user = user;
    res.json({ message: '登录成功', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// 获取当前登录用户信息
app.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '未登录' });
  res.json({ user: req.session.user });
});

// 退出登录接口
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: '退出成功' });
});

// 修改密码接口
app.put('/api/users/password', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '未登录' });
  const { oldPassword, newPassword } = req.body;
  const user = req.session.user;
  if (user.passcode !== oldPassword) {
    return res.status(400).json({ error: '旧密码错误' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE Users SET passcode=? WHERE id=?', [newPassword, user.id]);
    user.passcode = newPassword;
    req.session.user = user;
    res.json({ message: '密码修改成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// 上传头像接口
app.post('/api/users/avatar', upload.single('avatar'), async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '未登录' });
  const fileName = req.file.filename;
  const avatarUrl = '/uploads/' + fileName;
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE Users SET avatar=? WHERE id=?', [avatarUrl, req.session.user.id]);
    req.session.user.avatar = avatarUrl;
    res.json({ message: '头像更新成功', avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

/* --------------------- 动态和相册接口 ----------------------- */

// 获取动态列表接口
app.get('/api/posts', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT p.*, u.uid, u.username, u.avatar 
       FROM Posts p JOIN Users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.json({ posts: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// 发布动态接口
app.post('/api/posts', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '未登录' });
  const { note, place } = req.body;
  const user = req.session.user;
  const post_date = new Date();
  const conn = await pool.getConnection();
  try {
    // 查询国家 id（假设 Countries.name 与 place 完全匹配）
    let countryId = null;
    if (place) {
      const [countryRows] = await conn.query('SELECT id FROM Countries WHERE name=?', [place]);
      if (countryRows.length > 0) {
        countryId = countryRows[0].id;
      }
    }
    const [result] = await conn.query(
      'INSERT INTO Posts (user_id, post_date, country_id, note) VALUES (?, ?, ?, ?)',
      [user.id, post_date, countryId, note]
    );
    res.json({ message: '动态发布成功', postId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

/* --------------------- 启动服务 ----------------------- */

// 使用端口号（可通过环境变量 PORT 指定，否则默认 3000）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
