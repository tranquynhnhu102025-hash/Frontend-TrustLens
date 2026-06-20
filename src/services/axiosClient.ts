import axios from 'axios';
import { clearAuthSession } from '../auth/permissions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const API_LOGGING_ENABLED = import.meta.env.DEV && import.meta.env.VITE_API_LOGGING !== 'false';
const SENSITIVE_KEYS = ['authorization', 'access_token', 'refresh_token', 'password', 'secret', 'token'];

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const redactSensitive = (value: any): any => {
  if (!value || typeof value !== 'object') return value;
  if (value instanceof Blob || value instanceof File || value instanceof FormData) {
    return `[${value.constructor.name}]`;
  }
  if (Array.isArray(value)) return value.map(redactSensitive);

  return Object.entries(value).reduce<Record<string, any>>((acc, [key, item]) => {
    const normalizedKey = key.toLowerCase();
    acc[key] = SENSITIVE_KEYS.some((sensitiveKey) => normalizedKey.includes(sensitiveKey))
      ? '[redacted]'
      : redactSensitive(item);
    return acc;
  }, {});
};

const requestUrl = (config: any) => {
  const baseUrl = config.baseURL || API_BASE_URL;
  const url = config.url || '';
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return `${baseUrl}${url}`;
  }
};

const requestLabel = (config: any) => {
  const method = String(config.method || 'GET').toUpperCase();
  return `${method} ${requestUrl(config)}`;
};

const logApiRequest = (config: any) => {
  if (!API_LOGGING_ENABLED) return;

  const metadata = {
    startedAt: performance.now(),
    requestId: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
  };
  config.metadata = metadata;

  console.groupCollapsed(`%c[API] -> ${requestLabel(config)}`, 'color:#2563eb;font-weight:bold');
  console.log('requestId:', metadata.requestId);
  console.log('params:', redactSensitive(config.params));
  console.log('data:', redactSensitive(config.data));
  console.groupEnd();
};

const logApiResponse = (response: any) => {
  if (!API_LOGGING_ENABLED) return;

  const startedAt = response.config?.metadata?.startedAt;
  const durationMs = startedAt ? Math.round(performance.now() - startedAt) : undefined;
  console.groupCollapsed(
    `%c[API] <- ${response.status} ${requestLabel(response.config)}${durationMs !== undefined ? ` (${durationMs}ms)` : ''}`,
    'color:#16a34a;font-weight:bold',
  );
  console.log('requestId:', response.config?.metadata?.requestId);
  console.log('response:', redactSensitive(response.data));
  console.groupEnd();
};

const logApiError = (error: any) => {
  if (!API_LOGGING_ENABLED) return;

  const config = error.config || {};
  const startedAt = config.metadata?.startedAt;
  const durationMs = startedAt ? Math.round(performance.now() - startedAt) : undefined;
  const status = error.response?.status || 'NETWORK_ERROR';
  console.groupCollapsed(
    `%c[API] x ${status} ${requestLabel(config)}${durationMs !== undefined ? ` (${durationMs}ms)` : ''}`,
    'color:#dc2626;font-weight:bold',
  );
  console.log('requestId:', config.metadata?.requestId);
  console.log('message:', error.message);
  console.log('params:', redactSensitive(config.params));
  console.log('data:', redactSensitive(config.data));
  console.log('response:', redactSensitive(error.response?.data));
  console.groupEnd();
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logApiRequest(config);
    return config;
  },
  (error) => {
    logApiError(error);
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    logApiResponse(response);
    return response;
  },
  async (error) => {
    logApiError(error);
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          clearAuthSession();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (API_LOGGING_ENABLED) {
          console.groupCollapsed('%c[API] -> POST auth refresh', 'color:#2563eb;font-weight:bold');
          console.log('data:', { refresh_token: '[redacted]' });
          console.groupEnd();
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        if (API_LOGGING_ENABLED) {
          console.groupCollapsed('%c[API] <- auth refresh success', 'color:#16a34a;font-weight:bold');
          console.log('response:', redactSensitive(response.data));
          console.groupEnd();
        }

        const newAccessToken = response.data.access_token;
        localStorage.setItem('access_token', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        if (API_LOGGING_ENABLED) {
          console.groupCollapsed('%c[API] x auth refresh failed', 'color:#dc2626;font-weight:bold');
          console.log('error:', refreshError);
          console.groupEnd();
        }

        clearAuthSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
