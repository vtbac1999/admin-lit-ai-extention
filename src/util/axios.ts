import axios from 'axios';

// Cấu hình Axios với Interceptor
axios.defaults.baseURL = process.env.API_BASE_URL;
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Lấy token từ localStorage hoặc nơi bạn lưu trữ
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
