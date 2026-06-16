// Định nghĩa kiểu dữ liệu cho chuẩn TypeScript
export interface Course {
  id: string;
  name: string;
  students: number;
  date: string;
}

// DỮ LIỆU GIẢ LẬP (MOCK DATA)
let mockClasses: Course[] = [
  { id: 'INT4050', name: 'Đồ án Tốt nghiệp - Khóa 2022', students: 45, date: '15/06/2026' },
  { id: 'INT3307', name: 'Phát triển Hệ thống Thông tin Enterprise', students: 38, date: '20/06/2026' },
  { id: 'INT3110', name: 'Kỹ thuật phần mềm nâng cao', students: 42, date: '18/06/2026' }
];

export const classService = {
  // Lấy danh sách lớp
  getClasses: async (): Promise<Course[]> => {
    // Giả lập thời gian chờ máy chủ 0.5 giây
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockClasses);
      }, 500);
    });
    // GHI CHÚ CHO TRÚC SAU NÀY SỬA THÀNH:
    // const response = await axiosClient.get('/courses');
    // return response.data;
  },

  // Thêm lớp mới
  createClass: async (newCode: string, newName: string): Promise<Course> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClass = {
          id: newCode.toUpperCase(),
          name: newName,
          students: 0,
          date: '31/12/2026'
        };
        mockClasses.push(newClass);
        resolve(newClass);
      }, 500);
    });
  }
};