import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
(error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/refresh`,null, {
                    params: { refreshToken: refreshToken }
                });

                if (res.status === 200) {
                    const { accessToken } = res.data;
                    localStorage.setItem("accessToken", accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token expired or invalid", refreshError);
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error);
    }
);

export default api;