import axiosClient from './axiosClient';

const MOCK_SUMMARY = {
  totalSubmissions: 156,
  passed: 112,
  warnings: 34,
  critical: 10,
};

const MOCK_ACTIVITIES = [
  { id: 'SUB-101', student: 'Nguyễn Văn A', class: 'INT4050', time: '10 phút trước', score: 85, status: 'pass' },
  { id: 'SUB-102', student: 'Trần Thị B', class: 'INT3307', time: '1 giờ trước', score: 55, status: 'warning' },
  { id: 'SUB-103', student: 'Lê Hoàng C', class: 'INT4050', time: '3 giờ trước', score: 32, status: 'fail' },
  { id: 'SUB-104', student: 'Phạm Văn D', class: 'INT3110', time: 'Hôm qua', score: 92, status: 'pass' },
];

const dashboardService = {

  getSummary: async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return MOCK_SUMMARY;
    }
    try {
      const res = await axiosClient.get('/dashboard/summary');
      return res.data;
    } catch (error) {
      console.warn("Gọi API /dashboard/summary thất bại. Dùng dữ liệu mock dự phòng:", error);
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
    } catch (error) {
      console.warn("Gọi API /dashboard/recent-activities thất bại. Dùng dữ liệu mock dự phòng:", error);
      return MOCK_ACTIVITIES;
    }
  },
};

export default dashboardService;