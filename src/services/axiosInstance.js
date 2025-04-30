import axios from "axios";
import Cookies from "js-cookie";

console.log("import.meta.env.VITE_DOMAIN",import.meta.env.VITE_DOMAIN)

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
        domain: import.meta.env.VITE_DOMAIN
    },
});

// ✅ Intercept all requests and attach the access token if available
axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    console.log("req token", token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    } else {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
}, (error) => Promise.reject(error));


// ✅ Handle 401 errors and refresh token if needed
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log("error.response.status", error.response)

        if (error.response && error.response.status === 401) {
            originalRequest._retry = true;
            try {
                const token = Cookies.get("accessToken");
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/refreshtoken`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        domain: import.meta.env.VITE_DOMAIN
                    },
                });

                if (response.data && response.data.data.token) {
                    const newAccessToken = response.data.data.token;
                    Cookies.set("accessToken", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    console.error("Failed to refresh token. Logging out...");
                    Cookies.remove("accessToken");
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                Cookies.remove("accessToken");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
