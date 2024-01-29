import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const isAccessTokenExpired = error.response.status === 401 && error.response.data.error === "Unauthorized, access token expired";
        if(isAccessTokenExpired && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post("/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                console.error("error refreshing token", refreshError);
                throw refreshError;
            }
        }
        return Promise.reject(error);
        }
    )

export default api;

