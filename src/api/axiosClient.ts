import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// request interceptor (add auth header here if needed)
axiosClient.interceptors.request.use((config) => {
  // e.g., const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response interceptor: unwrap response.data and centralize error shape
axiosClient.interceptors.response.use(
  (res) => res, // we'll access res.data in userApi for clarity
  (error) => {
    const message = error?.response?.data || error.message || "Network error";
    return Promise.reject(message);
  }
);

export default axiosClient;
