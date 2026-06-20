import axiosClient from './axiosClient';
import { MOCK_AUDIT_LOGS } from '../mocks/dummyData';

export interface AuditLog {
  id: number;
  action: string;
  user: string;
  time: string;
  type: string;
}

export interface MetadataProviderInfo {
  id: string;
  name: string;
  code: string;
  base_url: string;
  enabled: boolean;
  priority: number;
  status: string;
  latency: number;
  fallback_count: number;
  last_failure: string;
}

const MOCK_PROVIDERS: MetadataProviderInfo[] = [
  { id: '1', name: 'Crossref API', code: 'crossref', base_url: 'https://api.crossref.org', enabled: true, priority: 1, status: 'healthy', latency: 420, fallback_count: 8, last_failure: 'Không có' },
  { id: '2', name: 'OpenAlex API', code: 'openalex', base_url: 'https://api.openalex.org', enabled: true, priority: 2, status: 'healthy', latency: 680, fallback_count: 14, last_failure: '2026-06-19T01:10:02Z - Read timeout' },
  { id: '3', name: 'Semantic Scholar API', code: 'semantic_scholar', base_url: 'https://api.semanticscholar.org/v1', enabled: false, priority: 3, status: 'disabled', latency: 0, fallback_count: 0, last_failure: 'Không có' }
];

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'ADMIN' | 'LECTURER';
  status: 'active' | 'inactive';
  department: string;
  createdAt: string;
}

let MOCK_USERS: User[] = [
  { id: 'usr-1', full_name: 'Nguyễn Văn A', email: 'nguyenvana@trustlens.edu.vn', role: 'ADMIN', status: 'active', department: 'Khoa CNTT', createdAt: '2026-01-10' },
  { id: 'usr-2', full_name: 'Trần Thị B', email: 'tranthib@trustlens.edu.vn', role: 'LECTURER', status: 'active', department: 'Khoa CNTT', createdAt: '2026-02-15' },
  { id: 'usr-3', full_name: 'Lê Văn C', email: 'levanc@trustlens.edu.vn', role: 'LECTURER', status: 'inactive', department: 'Khoa Xây dựng', createdAt: '2026-03-22' },
  { id: 'usr-4', full_name: 'Phạm Thị D', email: 'phamthid@trustlens.edu.vn', role: 'LECTURER', status: 'active', department: 'Khoa Điện tử', createdAt: '2026-04-05' }
];

export const adminService = {
  getAuditLogs: async (): Promise<AuditLog[]> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_AUDIT_LOGS);
        }, 500);
      });
    }
    const response = await axiosClient.get('/admin/audit-logs');
    return response.data;
  },

  getProviders: async (): Promise<MetadataProviderInfo[]> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...MOCK_PROVIDERS]);
        }, 400);
      });
    }
    const response = await axiosClient.get('/admin/metadata-providers');
    return response.data;
  },

  updateProvider: async (id: string, payload: Partial<MetadataProviderInfo>): Promise<MetadataProviderInfo> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const idx = MOCK_PROVIDERS.findIndex(p => p.id === id);
      if (idx !== -1) {
        MOCK_PROVIDERS[idx] = { ...MOCK_PROVIDERS[idx], ...payload };
        if (payload.enabled !== undefined) {
          MOCK_PROVIDERS[idx].status = payload.enabled ? 'healthy' : 'disabled';
        }
        return { ...MOCK_PROVIDERS[idx] };
      }
      throw new Error("Không tìm thấy nhà cung cấp.");
    }
    const response = await axiosClient.put(`/admin/metadata-providers/${id}`, payload);
    return response.data;
  },

  getUsers: async (): Promise<{ users: User[]; isMocked: boolean }> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ users: [...MOCK_USERS], isMocked: true });
        }, 400);
      });
    }
    try {
      const response = await axiosClient.get('/admin/users');
      return { users: response.data, isMocked: false };
    } catch (err) {
      console.warn("Backend /admin/users failed, falling back to mock:", err);
      return { users: [...MOCK_USERS], isMocked: true };
    }
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<{ user: User; isMocked: boolean }> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            ...user,
            id: `usr-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0]
          };
          MOCK_USERS = [newUser, ...MOCK_USERS];
          resolve({ user: newUser, isMocked: true });
        }, 400);
      });
    }
    try {
      const response = await axiosClient.post('/admin/users', user);
      return { user: response.data, isMocked: false };
    } catch (err) {
      console.warn("Backend POST /admin/users failed, falling back to mock:", err);
      const newUser: User = {
        ...user,
        id: `usr-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      MOCK_USERS = [newUser, ...MOCK_USERS];
      return { user: newUser, isMocked: true };
    }
  },

  updateUser: async (id: string, payload: Partial<User>): Promise<{ user: User; isMocked: boolean }> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const idx = MOCK_USERS.findIndex(u => u.id === id);
          if (idx !== -1) {
            MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...payload };
            resolve({ user: { ...MOCK_USERS[idx] }, isMocked: true });
          } else {
            reject(new Error("Không tìm thấy người dùng."));
          }
        }, 300);
      });
    }
    try {
      const response = await axiosClient.put(`/admin/users/${id}`, payload);
      return { user: response.data, isMocked: false };
    } catch (err) {
      console.warn(`Backend PUT /admin/users/${id} failed, falling back to mock:`, err);
      const idx = MOCK_USERS.findIndex(u => u.id === id);
      if (idx !== -1) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...payload };
        return { user: { ...MOCK_USERS[idx] }, isMocked: true };
      }
      throw new Error("Không tìm thấy người dùng.");
    }
  },

  deleteUser: async (id: string): Promise<{ success: boolean; isMocked: boolean }> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
          resolve({ success: true, isMocked: true });
        }, 300);
      });
    }
    try {
      await axiosClient.delete(`/admin/users/${id}`);
      return { success: true, isMocked: false };
    } catch (err) {
      console.warn(`Backend DELETE /admin/users/${id} failed, falling back to mock:`, err);
      MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
      return { success: true, isMocked: true };
    }
  }
};

export default adminService;
