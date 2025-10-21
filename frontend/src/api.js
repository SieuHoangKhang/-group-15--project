import axios from "axios";

// Ưu tiên biến môi trường nếu có; nếu không, dùng same-origin (''),
// để CRA dev server (port 3001) proxy /api sang backend 3000.
const BASE_URL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
