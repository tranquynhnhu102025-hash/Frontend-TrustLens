import axiosClient from './axiosClient';
import { MOCK_SUMMARY, MOCK_ACTIVITIES } from '../mocks/dummyData';

const dashboardService = {

  getSummary: async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return MOCK_SUMMARY;
    }
    const res = await axiosClient.get('/dashboard/summary');
    return res.data;
  },

  getRecentActivities: async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return MOCK_ACTIVITIES;
    }
    const res = await axiosClient.get('/dashboard/recent-activities');
    return res.data;
  },
};

export default dashboardService;