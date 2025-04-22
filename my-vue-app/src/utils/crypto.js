/** 计算字符串的 SHA‑256 Hex */
export async function sha256Hex(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  
  /** 双重 Salted 哈希 */
  export async function saltedHash(pwd, salt) {
    const h1 = await sha256Hex(pwd + salt);
    return sha256Hex(h1 + salt);
  }
  
  /** 取或创建一个随机 Salt */
  export function getOrCreateSalt(uid) {
    const key = `salt_${uid}`;
    let salt = localStorage.getItem(key);
    if (!salt) {
      salt = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16).padStart(2,'0')).join('');
      localStorage.setItem(key, salt);
    }
    return salt;
  }