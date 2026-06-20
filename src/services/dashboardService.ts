import axiosClient from './axiosClient';
import { MOCK_SUMMARY, MOCK_ACTIVITIES } from '../mocks/dummyData';

export const dashboardService = {
  getSummary: async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return MOCK_SUMMARY;
    }
    try {
      const res = await axiosClient.get('/dashboard/summary');
      return res.data;
    } catch (e) {
      console.warn("Backend does not support /dashboard/summary. Falling back to mock data.", e);
      return MOCK_SUMMARY;
    }
  },

  getRecentActivities: async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return MOCK_ACTIVITIES;
    }
    try {
      const res = await axiosClient.get('/dashboard/recent-activities');
      return res.data;
    } catch (e) {
      console.warn("Backend does not support /dashboard/recent-activities. Falling back to mock data.", e);
      return MOCK_ACTIVITIES;
    }
  },
};

export default dashboardService;