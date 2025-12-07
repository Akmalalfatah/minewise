import apiClient from "./apiClient";
import { userStore } from "../store/userStore";

const authService = {
  async login(email, password) {
    const res = await apiClient.post("/auth/login", { email, password });
    const data = res.data || {};

    if (data.access_token) {
      userStore
        .getState()
        .setToken(data.access_token, data.refresh_token || null);
    }

    if (data.user) {
      userStore.getState().setUser(data.user);
    }

    return data;
  },

  async register(email, password, name) {
    const res = await apiClient.post("/auth/register", {
      email,
      password,
      name,
    });
    return res.data;
  },

  async getProfile() {
    const state = userStore.getState();

    if (state.user) {
      return state.user;
    }

    const res = await apiClient.get("/auth/me");
    const user = res.data?.user || res.data || null;

    if (user) {
      state.setUser(user);
    }

    return user;
  },

  async refreshToken() {
    const { refreshToken } = userStore.getState();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const res = await apiClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    const data = res.data || {};
    if (data.access_token) {
      userStore.getState().setAccessToken(data.access_token);
    }

    return data;
  },

  logout() {
    userStore.getState().clearAuth();
  },
};

export default authService;
