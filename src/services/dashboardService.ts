import axiosClient from './axiosClient';
import { isMockMode } from './mockMode';
import { MOCK_SUMMARY, MOCK_ACTIVITIES } from '../mocks/dummyData';

const useMock = isMockMode;

export const dashboardService = {
  getSummary: async () => {
    if (useMock()) {
      return MOCK_SUMMARY;
    }
    try {
      const res = await axiosClient.get('/dashboard/summary');
      return res.data;
    } catch (e) {
      console.error("Không thể tải /dashboard/summary.", e);
      throw e;
    }
  },

  getRecentActivities: async () => {
    if (useMock()) {
      return MOCK_ACTIVITIES;
    }
    try {
      const res = await axiosClient.get('/dashboard/recent-activities');
      return res.data;
    } catch (e) {
      console.error("Không thể tải /dashboard/recent-activities.", e);
      throw e;
    }
  },

  getWeeklyTrend: async () => {
    if (useMock()) {
      return [40, 70, 45, 90, 65, 85, 100].map((rate, index) => ({
        label: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index],
        total: 1,
        passed: rate >= 80 ? 1 : 0,
        rate,
      }));
    }
    const res = await axiosClient.get('/dashboard/weekly-trend');
    return res.data;
  },
};

export default dashboardService;
