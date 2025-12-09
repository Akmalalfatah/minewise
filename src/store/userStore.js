import { create } from "zustand";

export const userStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  setToken: (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    });
  },

  setAccessToken: (access) => {
    localStorage.setItem("accessToken", access);
    set({
      accessToken: access,
      isAuthenticated: true,
    });
  },

  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({
      user: userData,
      isAuthenticated: true,
    });
  },

  updateUser: (newData) => {
    const merged = { ...JSON.parse(localStorage.getItem("user")), ...newData };
    localStorage.setItem("user", JSON.stringify(merged));
    set({ user: merged });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
