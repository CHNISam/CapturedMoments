import os

# 项目结构定义
structure = {
    "myapp": {
        "app.js": "",
        "database.sql": "",
        "package.json": '''{
  "name": "myapp",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}''',
        "public": {
            "index.html": '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <h1>Hello World</h1>
  <script src="/js/main.js"></script>
</body>
</html>''',
            "css": {
                "style.css": "body { font-family: sans-serif; background: #f9f9f9; }"
            },
            "js": {
                "main.js": 'console.log("Hello from main.js");'
            }
        },
        "uploads": {}  # 用户上传头像的目录
    }
}

# 递归创建文件和目录
def create_structure(base_path, struct):
    for name, content in struct.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            print(f"📁 目录创建：{path}")
            create_structure(path, content)
        else:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"📄 文件创建：{path}")

# 执行创建
if __name__ == "__main__":
    create_structure(".", structure)
