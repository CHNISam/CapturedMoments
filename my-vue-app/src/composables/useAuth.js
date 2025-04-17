// A tiny composable holding *all* auth‑related state & helpers.
// Import what you need from anywhere in the app:
//   import { useAuth, login, logout, getCurrentUser } from "@/composables/useAuth";
// ---- constant -----------------------------------------------------------
export const DEFAULT_PASSWORD = '123456';
import { reactive, readonly } from 'vue';

// ---- private reactive state ---------------------------------------------
const state = reactive({
  /**
   * `currentUser` is *null* when not signed‑in; otherwise it keeps the UID
   * string that LoginModal emits.
   */
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null')
});

// ---- public helpers ------------------------------------------------------
export function login (uid) {
  state.currentUser = uid;
  localStorage.setItem('currentUser', JSON.stringify(uid));
}

export function logout () {
  localStorage.removeItem('currentUser');
  state.currentUser = null;
}

export function getCurrentUser () {
  return state.currentUser;
}

/**
 * `useAuth()` lets Options API or Composition API components *react* to
 * login‑state changes through Vue reactivity.
 */
export function useAuth () {
  return {
    state : readonly(state),
    login,
    logout,
    getCurrentUser
  };
}