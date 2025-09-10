import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Needed for refresh token cookie
});

// Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Request new access token using refresh token
        const { data } = await api.post("/auth/refresh-token");
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user or redirect to login
        localStorage.removeItem("authToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
