// src/config/auth.js

// 默认的白名单（第一次打开时会用到）
const DEFAULT_ALLOWED_UIDS = [
  '217122260',  // 你的 UID
  '246490729',
  // …可以在这里继续补充默认的 UID
];

/**
 * 获取当前白名单（优先读 localStorage，没有则返回 DEFAULT_ALLOWED_UIDS）
 * @returns {string[]}
 */
export function getAllowedUids() {
  try {
    const raw = localStorage.getItem('allowed_uids');
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
  } catch(e) { /* ignore */ }
  return DEFAULT_ALLOWED_UIDS;
}

/**
 * 覆盖写入白名单
 * @param {string[]} list
 */
export function setAllowedUids(list) {
  localStorage.setItem('allowed_uids', JSON.stringify(list));
}
