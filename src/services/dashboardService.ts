import axiosClient from './axiosClient';

const dashboardService = {

  getSummary: async () => {
    const res = await axiosClient.get('/dashboard/summary');
    return res.data;
  },

  getRecentActivities: async () => {
    const res = await axiosClient.get('/dashboard/recent-activities');
    return res.data;
  },
};

export default dashboardService;