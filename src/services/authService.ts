import axiosClient from './axiosClient';


export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export const authService = {
  // Hàm Login: Lấy và lưu cả Access Token lẫn Refresh Token
  login: async (email: string, password: string) => {
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
    const response = await axiosClient.post('/auth/register', data);
    return response.data; 
  },


  getMe: async () => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export default authService;