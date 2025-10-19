import axios from 'axios';

// Cấu hình base URL cho mọi request tới backend
// Mặc định theo code hiện tại là http://localhost:3000/api/users
// Có thể override bằng biến môi trường REACT_APP_API_URL
const baseURL = process.env.REACT_APP_API_URL || '';
// Debug: in ra baseURL để kiểm tra cấu hình trên trình duyệt
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('API baseURL =', baseURL || '(relative)');
}
const api = axios.create({
  baseURL,
});

export default api;
