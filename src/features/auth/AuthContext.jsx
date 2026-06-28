import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  saveSession,
  loadSession,
  clearSession,
  touchSession,
  updateSessionUser,
} from './sessionManager';

const AuthContext = createContext(null);

// Tần suất kiểm tra phiên còn hợp lệ (idle / TTL).
const CHECK_INTERVAL = 30 * 1000;
// Các sự kiện coi là "người dùng đang hoạt động".
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

/**
 * Wraps the app and provides auth state globally.
 * Phiên đọc qua sessionManager: có TTL + idle timeout nên KHÔNG còn tự
 * đăng nhập vô thời hạn như khi đọc thẳng localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());

  /** Call after a successful API login. Lưu phiên (kèm tuỳ chọn remember me). */
  const login = (userData, rememberMe = false) => {
    const safeUser = saveSession(userData, rememberMe);
    setUser(safeUser);
  };

  /** Clears session from state and storage. */
  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  /** Merges updated fields into the current user and re-persists the session. */
  const updateUser = (partial) => {
    const next = updateSessionUser(partial);
    if (next) setUser(next);
  };

  // Tự đăng xuất khi hết hạn (idle hoặc TTL) + ghi nhận hoạt động của người dùng.
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => touchSession();
    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, handleActivity, { passive: true })
    );

    // Định kỳ kiểm tra: loadSession trả null nếu phiên đã hết hạn.
    const timer = setInterval(() => {
      if (!loadSession()) {
        clearSession();
        setUser(null);
      }
    }, CHECK_INTERVAL);

    // Đồng bộ giữa các tab: tab này logout thì tab khác cũng cập nhật.
    const handleStorage = () => {
      if (!loadSession()) setUser(null);
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, handleActivity)
      );
      clearInterval(timer);
      window.removeEventListener('storage', handleStorage);
    };
  }, [user]);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook — throws if used outside <AuthProvider>. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
