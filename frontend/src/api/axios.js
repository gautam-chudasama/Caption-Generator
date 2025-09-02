import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

// Optional: response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Not authenticated; redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
