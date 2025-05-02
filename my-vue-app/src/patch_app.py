import os
import shutil
import re
from datetime import datetime

# —— 如果在项目根执行，这里改为 'src/App.vue' ——
# —— 如果在 src 文件夹执行，这里就用 'App.vue' ——
FILE = 'App.vue'
BACKUP = f"{FILE}.bak.{datetime.now().strftime('%Y%m%d%H%M%S')}"

# 备份
shutil.copy(FILE, BACKUP)
print(f"已备份原文件到: {BACKUP}")

# 读取并标准化换行
with open(FILE, 'r', encoding='utf-8', newline=None) as f:
    text = f.read().replace('\r\n', '\n')

# 1. 插入节流函数
text = re.sub(
    r'(<script[^>]*>)',
    r"\1\n// —— 自动插入：节流函数 ——\nfunction throttle(fn, wait = 200) {\n"
    r"  let last = 0;\n"
    r"  return function (...args) {\n"
    r"    const now = Date.now();\n"
    r"    if (now - last > wait) {\n"
    r"      last = now;\n"
    r"      fn.apply(this, args);\n"
    r"    }\n"
    r"  };\n"
    r"}\n",
    text,
    count=1
)

# 2. 插入 safeParse
text = re.sub(
    r'(methods\s*:\s*{)',
    r"\1\n    // —— 自动插入：安全 JSON.parse ——\n"
    r"    safeParse(key, defaultVal) {\n"
    r"      try {\n"
    r"        const raw = localStorage.getItem(key);\n"
    r"        return raw !== null ? JSON.parse(raw) : defaultVal;\n"
    r"      } catch (e) {\n"
    r"        console.error(`safeParse failed for ${key}:`, e);\n"
    r"        return defaultVal;\n"
    r"      }\n"
    r"    },\n",
    text,
    count=1
)

# 3. 替换 JSON.parse 调用
pattern = re.compile(
    r"JSON\.parse\(\s*localStorage\.getItem\(\s*'([^']+)'\s*\)\s*\|\|\s*'([^']*)'\s*\)"
)
text = pattern.sub(r"this.safeParse('\1', \2)", text)

# 4. 重命名原 publishPost 并插入包装版
text = re.sub(r'\basync\s+publishPost\s*\(', 'async __OLD_publishPost(', text, count=1)
wrapped = (
    "async publishPost() {\n"
    "      if (!this.newPostText.trim() && this.draftImgs.length === 0) {\n"
    "        return alert('内容不能为空');\n"
    "      }\n"
    "      this.isPublishing = true;\n"
    "      try {\n"
    "        return this.__OLD_publishPost();\n"
    "      } catch (err) {\n"
    "        console.error('发布失败:', err);\n"
    "        alert('发布失败，请稍后再试');\n"
    "      } finally {\n"
    "        this.isPublishing = false;\n"
    "      }\n"
    "    }"
)
text = re.sub(
    r'(async\s+__OLD_publishPost\s*\([^)]*\)\s*{)',
    r"\1\n    " + wrapped,
    text,
    count=1
)

# 5. 替换滚动监听为 throttledScroll
text = text.replace(
    "addEventListener('scroll', this.onScrollLoad",
    "addEventListener('scroll', this.throttledScroll"
)
text = text.replace(
    "removeEventListener('scroll', this.onScrollLoad",
    "removeEventListener('scroll', this.throttledScroll"
)

# 6. 插入 throttledScroll 方法
text = re.sub(
    r"(safeParse\([\s\S]*?\},)",
    r"\1\n    // —— 自动插入：节流版滚动加载 ——\n"
    r"    throttledScroll: throttle(function() {\n"
    r"      this.onScrollLoad();\n"
    r"    }, 200),",
    text,
    count=1
)

# 写回
with open(FILE, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print(f"补丁完成！请检查 {FILE} 并提交：")
print("git add App.vue && git commit -m \"chore: 自动应用健壮性补丁\"")
