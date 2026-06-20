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
        // Điều chỉnh status tương ứng nếu enabled đổi
        if (payload.enabled !== undefined) {
          MOCK_PROVIDERS[idx].status = payload.enabled ? 'healthy' : 'disabled';
        }
        return { ...MOCK_PROVIDERS[idx] };
      }
      throw new Error("Không tìm thấy nhà cung cấp.");
    }
    const response = await axiosClient.put(`/admin/metadata-providers/${id}`, payload);
    return response.data;
  }
};

export default adminService;
