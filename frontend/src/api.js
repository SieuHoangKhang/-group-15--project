import axios from "axios";

// Xác định baseURL theo môi trường chạy:
// - Nếu có REACT_APP_API_URL thì dùng trực tiếp
// - Nếu đang chạy CRA dev ở cổng 3001 thì trỏ thẳng sang backend 3000
// - Ngược lại dùng same-origin ('') để dùng chung cổng khi backend phục vụ build
const inferBaseURL = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== "undefined") {
    const { hostname, port, protocol } = window.location;
    if (hostname === "localhost" && port === "3001") {
      return `${protocol}//${hostname}:3000`;
    }
  }
  return "";
};

const BASE_URL = inferBaseURL();
 backend-admin
const api = axios.create({
  baseURL: BASE_URL,

// Use /api prefix so frontend calls go to backend API namespace and avoid SPA catch-all
const API_BASE = BASE_URL ? (BASE_URL.replace(/\/$/, '') + '/api') : '/api';
const api = axios.create({
  baseURL: API_BASE,
 main
  headers: { "Content-Type": "application/json" },
});

// Log baseURL ở dev để kiểm tra đúng đích
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.debug('API baseURL:', BASE_URL || '(same-origin)');
}

// Đính kèm Authorization header nếu có token lưu trong localStorage
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) { /* ignore */ }
  return config;
});

export default api;
