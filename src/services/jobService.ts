import axiosClient from './axiosClient';

export interface JobError {
  error_code: string;
  message: string;
  details?: any;
  retryable?: boolean;
}

export interface JobStatusResponse {
  job_id: string;
  submission_id: string;
  status: string;
  progress: number;
  current_step: string;
  started_at: string | null;
  updated_at: string;
  completed_at: string | null;
  report_id: string | null;
  error: JobError | null;
}

import { MOCK_STAGES } from '../mocks/dummyData';

const mockJobStates: Record<string, number> = {};

export const jobService = {
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || jobId.startsWith('mock-')) {
      // Giả lập thời gian chờ để có tiến trình tăng dần
      let currentIndex = mockJobStates[jobId] ?? 0;
      const stage = MOCK_STAGES[currentIndex];
      
      if (currentIndex < MOCK_STAGES.length - 1) {
        mockJobStates[jobId] = currentIndex + 1;
      }
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            job_id: jobId,
            submission_id: `mock-sub-${jobId}`,
            status: stage.status,
            progress: stage.progress,
            current_step: stage.current_step,
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            completed_at: stage.status === 'completed' ? new Date().toISOString() : null,
            report_id: stage.status === 'completed' ? `mock-report-${jobId}` : null,
            error: null
          });
        }, 300);
      });
    }

    const response = await axiosClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  retryJob: async (jobId: string): Promise<{ job_id: string; status: string }> => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || jobId.startsWith('mock-')) {
      const newJobId = `mock-job-${Math.random().toString(36).substring(2, 9)}`;
      mockJobStates[newJobId] = 0;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            job_id: newJobId,
            status: 'queued'
          });
        }, 500);
      });
    }

    const response = await axiosClient.post(`/jobs/${jobId}/retry`);
    return response.data;
  }
};

export default jobService;
