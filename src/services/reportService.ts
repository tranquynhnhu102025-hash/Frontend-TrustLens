import axiosClient from './axiosClient';

export const reportService = {
  getReport: async (id: string) => {
    const response = await axiosClient.get(`/reports/${id}`);
    return response.data; 
  }
};