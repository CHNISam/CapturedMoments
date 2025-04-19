// src/composables/useAuth.js

import { reactive, readonly } from 'vue';

// 私有的可响应状态
const state = reactive({
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null')
});

/**
 * 获取已存密码（或 null）
 */
export function getStoredPassword(uid) {
  const raw = localStorage.getItem(`password_${uid}`);
  return raw ? JSON.parse(raw) : null;
}

/**
 * 存储密码
 */
export function setStoredPassword(uid, pwd) {
  localStorage.setItem(`password_${uid}`, JSON.stringify(pwd));
}

/**
 * 登录函数：首次登录自动保存密码，后续登录校验
 * @param {string} uid 用户 UID
 * @param {string} pwd 输入的密码
 * @returns {boolean} 是否登录成功
 */
export function login(uid, pwd) {
  const stored = getStoredPassword(uid);

  if (!stored) {
    // 首次登录：允许使用用户提供的 pwd
    setStoredPassword(uid, pwd); 
  } else if (pwd !== stored) {
    // 密码不匹配，则登录失败
    return false;
  }

  // 登录成功，更新状态并持久化
  state.currentUser = uid;
  localStorage.setItem('currentUser', JSON.stringify(uid));
  return true;
}

/**
 * 登出：清除状态与存储
 */
export function logout() {
  localStorage.removeItem('currentUser');
  state.currentUser = null;
}

/**
 * 获取当前登录用户
 */
export function getCurrentUser() {
  return state.currentUser;
}

/**
 * 组合函数：组件内部使用，可响应地访问登录状态与方法
 */
export function useAuth() {
  return {
    state: readonly(state),
    login,
    logout,
    getCurrentUser
  };
}
