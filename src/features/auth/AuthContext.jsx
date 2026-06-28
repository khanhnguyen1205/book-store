import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/**
 * Wraps the app and provides auth state globally.
 * Reads initial user from localStorage so sessions persist on refresh.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  /** Call after a successful API login. Persists user to localStorage. */
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /** Clears session from state and storage. */
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  /** Merges updated fields into the current user and re-persists the session. */
  const updateUser = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

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
