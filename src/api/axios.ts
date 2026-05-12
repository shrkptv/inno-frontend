import axios, {AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig} from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const params = new URLSearchParams();
                params.append('grant_type', 'refresh_token');
                params.append('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT_ID);
                params.append('refresh_token', refreshToken || '');

                const res = await axios.post(
                    `${import.meta.env.VITE_KEYCLOAK_URL}`,
                    params
                );

                if (res.status === 200) {
                    const { access_token, refresh_token } = res.data;
                    localStorage.setItem("accessToken", access_token);
                    localStorage.setItem("refreshToken", refresh_token);

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token expired or invalid", refreshError);
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

