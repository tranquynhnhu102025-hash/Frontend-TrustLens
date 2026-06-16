import axiosClient from './axiosClient';

// Gom tất cả những API liên quan đến Xác thực (Auth) vào đây
export const authService = {
  // Hàm gọi API đăng nhập đúng chuẩn Trúc yêu cầu
  login: async (email: string, password: string) => {
    // Chỉ cần gọi /auth/login, phần đầu link axiosClient đã tự lo
    const response = await axiosClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Chừa sẵn chỗ để sau này làm chức năng Đăng xuất, Đăng ký...
  logout: () => {
    localStorage.removeItem('access_token');
  }
};