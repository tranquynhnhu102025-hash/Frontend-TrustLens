import axiosClient from './axiosClient';
import { isMockMode } from './mockMode';
import { MOCK_REPORT, MOCK_REVISIONS } from '../mocks/dummyData';

const useMock = isMockMode;

export const reportService = {
  getReport: async (id: string) => {
    if (useMock()) {
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
    if (useMock()) {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve(MOCK_REPORT);
        }, 600);
      });
    }
    const response = await axiosClient.get(`/reports/submissions/${submissionId}`);
    return response.data;
  },

  exportReport: async (reportId: string, format = 'pdf', _includeTeacherNotes = false) => {
    if (useMock()) {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({ export_id: `mock-export-${Math.random().toString(36).substring(2, 9)}` });
        }, 800);
      });
    }
    // Return a token containing the details for downloadExportFile
    return { export_id: `direct-download::${reportId}::${format}` };
  },

  downloadExportFile: async (exportId: string): Promise<Blob> => {
    if (useMock()) {
      return new Blob(['Mock PDF/Word/Excel Content'], { type: 'application/octet-stream' });
    }
    if (exportId.startsWith('direct-download::')) {
      const parts = exportId.split('::');
      const reportId = parts[1]; // Submission ID
      const format = parts[2];   // pdf, docx, or xlsx
      
      const response = await axiosClient.get(`/reports/submissions/${reportId}/export/${format}`, {
        responseType: 'blob'
      });
      return response.data;
    }
    // Fallback/Legacy
    const response = await axiosClient.get(`/report-exports/${exportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  getReportHistory: async (reportId: string): Promise<any[]> => {
    if (useMock()) {
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
