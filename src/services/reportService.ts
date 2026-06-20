import axiosClient from './axiosClient';
import { MOCK_REPORT } from '../mocks/dummyData';

export const reportService = {
  getReport: async (id: string) => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || id.startsWith('mock-')) {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve(MOCK_REPORT);
        }, 600);
      });
    }
    const response = await axiosClient.get(`/reports/${id}`);
    return response.data; 
  },

  getReportBySubmission: async (submissionId: string) => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || submissionId.startsWith('mock-')) {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve(MOCK_REPORT);
        }, 600);
      });
    }
    const response = await axiosClient.get(`/submissions/${submissionId}/report`);
    return response.data;
  },

  exportReport: async (reportId: string, format = 'pdf', includeTeacherNotes = false) => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || reportId.startsWith('mock-')) {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({ export_id: `mock-export-${Math.random().toString(36).substring(2, 9)}` });
        }, 800);
      });
    }
    const response = await axiosClient.post(`/reports/${reportId}/exports`, {
      format,
      include_raw_citation: true,
      include_teacher_notes: includeTeacherNotes
    });
    return response.data;
  },

  downloadExportFile: async (exportId: string): Promise<Blob> => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || exportId.startsWith('mock-')) {
      return new Blob(['Mock PDF/Word/Excel Content'], { type: 'application/octet-stream' });
    }
    const response = await axiosClient.get(`/report-exports/${exportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  getReportHistory: async (reportId: string): Promise<any[]> => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || reportId.startsWith('mock-')) {
      return new Promise<any[]>((resolve) => {
        setTimeout(() => {
          resolve(MOCK_REVISIONS);
        }, 400);
      });
    }
    const response = await axiosClient.get(`/reports/${reportId}/history`);
    return response.data;
  }
};