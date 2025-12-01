import apiClient from "./apiClient";
import { userStore } from "../store/userStore";

const authService = {
    async login(email, password) {
        const res = await apiClient.post("/auth/login", { email, password });
        userStore.getState().setToken(res.data.access_token, res.data.refresh_token);
        userStore.getState().setUser(res.data.user);
        return res;
    },

    async register(email, password, name) {
        const res = await apiClient.post("/auth/register", {
            email,
            password,
            name
        });
        return res;
    },

    async getProfile() {
        const res = await apiClient.get("/auth/me");
        const user = res.data.user || res.data;
        userStore.getState().setUser(user);
        return user;
    },

    async refreshToken() {
        const refreshToken = userStore.getState().refreshToken;
        const res = await apiClient.post("/auth/refresh", {
            refresh_token: refreshToken
        });

        userStore.getState().setAccessToken(res.data.access_token);
        return res.data;
    },

    logout() {
        userStore.getState().clearAuth();
    }
};

export default authService;
