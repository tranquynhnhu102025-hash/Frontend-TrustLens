import axiosClient from './axiosClient';


export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export const authService = {
  // Hàm Login: Lấy và lưu cả Access Token lẫn Refresh Token
  login: async (email: string, password: string) => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          const data = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            user: {
              full_name: email === 'lecturer@trustlens.vn' ? 'Demo Lecturer' : 'Trần Quỳnh Như',
              email: email,
              role: 'lecturer'
            }
          };
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          resolve(data);
        }, 500);
      });
    }

    const response = await axiosClient.post('/auth/login', {
      email,
      password,
    });

    const data = response.data;

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      
      
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    }

    return data;
  },

  register: async (data: RegisterData) => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Đăng ký tài khoản giả lập thành công!' });
        }, 500);
      });
    }

    const response = await axiosClient.post('/auth/register', data);
    return response.data; 
  },


  getMe: async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'mock-user-id',
            full_name: 'Trần Quỳnh Như',
            email: 'quynhnhu@nttu.edu.vn',
            role: 'lecturer'
          });
        }, 300);
      });
    }

    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export default authService;