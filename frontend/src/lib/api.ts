import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends the httpOnly refresh cookie
});

// In-memory access token — never in localStorage, so it isn't reachable by
// an XSS payload. It's lost on full page reload, which is why we refresh
// it on app start via the refresh cookie (see AuthContext).
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// If a request fails with 401, try refreshing the access token once, then
// retry the original request. Prevents users from getting logged out just
// because their 15-minute access token expired mid-session.
let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        await new Promise<void>((resolve) => queue.push(resolve));
        return api(originalRequest);
      }

      isRefreshing = true;
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        queue.forEach((resolve) => resolve());
        queue = [];
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
