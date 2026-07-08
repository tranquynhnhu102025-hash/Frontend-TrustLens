export interface ApiErrorPayload {
  error_code?: string;
  message?: string;
  details?: Record<string, unknown>;
  retryable?: boolean;
  correlation_id?: string;
}

const fallbackMessage = 'Request failed. Please try again.';

export const getApiErrorPayload = (error: unknown): ApiErrorPayload | null => {
  const data = (error as any)?.response?.data;
  if (!data || typeof data !== 'object') return null;

  return data as ApiErrorPayload;
};

export const formatApiError = (error: unknown, fallback = fallbackMessage): string => {
  const payload = getApiErrorPayload(error);
  if (!payload) return fallback;

  const message = payload.message || fallback;
  const correlation = payload.correlation_id ? ` Reference: ${payload.correlation_id}` : '';
  const code = payload.error_code ? ` (${payload.error_code})` : '';

  return `${message}${code}${correlation}`;
};
