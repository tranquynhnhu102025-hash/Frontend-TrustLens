import axiosClient from './axiosClient';
import { MOCK_USER } from '../mocks/dummyData';
import { clearAuthSession, getPermissionsForRole, getStoredAuthUser, storeAuthUser } from '../auth/permissions';


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
          const role = email.toLowerCase().includes('admin') ? 'admin' : 'lecturer';
          const data = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            user: {
              ...MOCK_USER,
              full_name: email === 'lecturer@trustlens.vn' ? 'Demo Lecturer' : MOCK_USER.full_name,
              email,
              role,
              permissions: getPermissionsForRole(role),
            }
          };
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          storeAuthUser(data.user);
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

    if (data.user) {
      storeAuthUser(data.user);
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
          const storedUser = getStoredAuthUser();
          const fallbackUser = {
            ...MOCK_USER,
            permissions: getPermissionsForRole(MOCK_USER.role),
          };

          resolve(storeAuthUser(storedUser || fallbackUser));
        }, 300);
      });
    }

    const response = await axiosClient.get('/users/me');
    return storeAuthUser(response.data);
  },

  updateMe: async (payload: {
    full_name?: string;
    email?: string;
    university?: string;
    faculty?: string;
    major?: string;
    notification_enabled?: boolean;
  }) => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const currentUser = getStoredAuthUser() || MOCK_USER;
      return storeAuthUser({
        ...currentUser,
        full_name: payload.full_name ?? currentUser.full_name,
        email: payload.email ?? currentUser.email,
        university: payload.university ?? (currentUser as any).university ?? 'Trường Đại học Nguyễn Tất Thành',
        faculty: payload.faculty ?? (currentUser as any).faculty ?? 'Khoa Công nghệ Thông tin',
        major: payload.major ?? (currentUser as any).major ?? 'Kỹ thuật Phần mềm',
        notification_enabled: payload.notification_enabled ?? (currentUser as any).notification_enabled ?? true,
        permissions: getPermissionsForRole(currentUser.role),
      } as any);
    }

    const response = await axiosClient.patch('/users/me', payload);
    return storeAuthUser(response.data);
  },

  logout: () => {
    clearAuthSession();
  }
};

export default authService;
