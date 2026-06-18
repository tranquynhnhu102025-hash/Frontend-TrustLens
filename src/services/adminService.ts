import axiosClient from './axiosClient';
import { MOCK_AUDIT_LOGS } from '../mocks/dummyData';

export interface AuditLog {
  id: number;
  action: string;
  user: string;
  time: string;
  type: string;
}

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
  }
};

export default adminService;
