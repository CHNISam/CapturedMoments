-- database.sql

-- 创建国家表
CREATE TABLE IF NOT EXISTS Countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 创建用户表
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(50) NOT NULL UNIQUE,          -- 登录账号（自动生成，如 "Furinya" 或 "离"）
    username VARCHAR(100) NOT NULL,             -- 显示用户名
    passcode VARCHAR(255) NOT NULL,             -- 存储密码（建议实际生产中存储哈希值）
    avatar VARCHAR(255) DEFAULT 'default.png',  -- 用户头像（存放头像文件名/URL）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建动态表
CREATE TABLE IF NOT EXISTS Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,          -- 对应 Users.id
    post_date DATE NOT NULL,       
    country_id INT,                -- 可为 NULL
    note TEXT,                     -- 动态内容
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (country_id) REFERENCES Countries(id)
);

-- 创建照片表（如果一条动态含多张图片）
CREATE TABLE IF NOT EXISTS Photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,         -- 对应 Posts.id
    photo_url VARCHAR(255) NOT NULL,    -- 图片文件名或 URL
    uploaded_date DATE,
    country_id INT,               -- 可为 NULL
    FOREIGN KEY (post_id) REFERENCES Posts(id),
    FOREIGN KEY (country_id) REFERENCES Countries(id)
);

-- 创建设置表（每个用户一条记录）
CREATE TABLE IF NOT EXISTS Settings (
    user_id INT PRIMARY KEY,      -- 与 Users.id 一一对应
    showPet BOOLEAN DEFAULT TRUE,
    petType VARCHAR(50) DEFAULT 'cat',
    LLMstatus BOOLEAN DEFAULT TRUE,
    prompt VARCHAR(255) DEFAULT '喵～ 记得喝水喔！',
    badges TEXT,                  -- 存放 JSON 格式的勋章数组
    displayBadge VARCHAR(50) DEFAULT 'none',
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
