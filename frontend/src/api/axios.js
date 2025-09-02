import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

// This interceptor will no longer force a page reload.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // The hard redirect is removed to prevent the refresh loop.
    // The useAuth hook will catch the 401 error and set the user state to null,
    // allowing React Router to handle the redirect declaratively.
    return Promise.reject(err);
  }
);

export default api;
