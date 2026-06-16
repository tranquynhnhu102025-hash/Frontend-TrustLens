import axios from 'axios';

// Tạo một trạm thu phát sóng riêng cho project TrustLens
const axiosClient = axios.create({
  // Thay đường link này bằng link thật mà ngày mai Trúc sẽ cung cấp
  baseURL: 'http://localhost:8080/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Nơi này sau này sẽ dùng để tự động nhét Token vào mỗi khi gọi API (Trúc có nhắc tới)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;