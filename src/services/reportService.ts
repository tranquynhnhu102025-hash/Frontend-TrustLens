import axiosClient from './axiosClient';

export const reportService = {
  getReport: async (id: string) => {
    const response = await axiosClient.get(`/reports/${id}`);
    return response.data; 
  },

  getReportBySubmission: async (submissionId: string) => {
    const response = await axiosClient.get(`/submissions/${submissionId}/report`);
    return response.data;
  },

  exportReport: async (reportId: string, format = 'pdf') => {
    const response = await axiosClient.post(`/reports/${reportId}/exports`, {
      format,
      include_raw_citation: true,
      include_teacher_notes: false
    });
    return response.data;
  },

  downloadExportFile: async (exportId: string): Promise<Blob> => {
    const response = await axiosClient.get(`/report-exports/${exportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};