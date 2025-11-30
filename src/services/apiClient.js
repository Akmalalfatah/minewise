import axios from "axios";
import { userStore } from "../store/userStore";
import authService from "./authService";

const apiClient = axios.create({
    baseURL: "https://your-api-url.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use((config) => {
    const token = userStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    failedQueue = [];
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = "Bearer " + token;
                        return apiClient(originalRequest);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await authService.refreshToken();
                const newToken = res.access_token;
                userStore.getState().setAccessToken(newToken);
                processQueue(null, newToken);
                originalRequest.headers.Authorization = "Bearer " + newToken;
                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                userStore.getState().clearAuth();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
