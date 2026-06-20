import axiosClient from './axiosClient';

// Định nghĩa kiểu dữ liệu cho chuẩn TypeScript
export interface Course {
  id: string;
  class_uuid?: string;
  name: string;
  students: number;
  date: string;
  assignment_id?: string;
  term_name?: string | null;
}

import { MOCK_CLASSES, MOCK_SUBMISSIONS, Submission } from '../mocks/dummyData';
export type { Submission };

export const classService = {
  // Lấy danh sách lớp
  getClasses: async (): Promise<Course[]> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      // Giả lập thời gian chờ máy chủ 0.5 giây
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_CLASSES);
        }, 500);
      });
    } else {
      const classesRes = await axiosClient.get('/classes');
      const assignmentsRes = await axiosClient.get('/assignments');
      
      const assignmentsMap = new Map<string, string>(); // class_id -> assignment_id
      if (Array.isArray(assignmentsRes.data)) {
        assignmentsRes.data.forEach((asm: any) => {
          assignmentsMap.set(asm.class_id, asm.id);
        });
      }

      const coursesList: Course[] = [];
      if (Array.isArray(classesRes.data)) {
        for (const item of classesRes.data) {
          let assignmentId = assignmentsMap.get(item.id);
          
          // Nếu lớp học chưa có assignment, tạo tự động 1 cái mặc định để nộp file
          if (!assignmentId) {
            try {
              const newAsm = await axiosClient.post('/assignments', {
                class_id: item.id,
                title: 'Báo cáo Đồ án cuối kỳ',
                description: 'Nộp file báo cáo đồ án để hệ thống thẩm định tài liệu tham khảo'
              });
              assignmentId = newAsm.data.id;
            } catch (e) {
              console.error('Không thể tạo bài nộp mặc định cho lớp:', item.id, e);
            }
          }

          coursesList.push({
            id: item.class_code,
            class_uuid: item.id,
            name: item.name,
            students: 0,
            date: new Date(item.created_at).toLocaleDateString('vi-VN'),
            assignment_id: assignmentId || item.id,
            term_name: item.term_name || null,
          });
        }
      }
      return coursesList;
    }
  },

  createClass: async (newCode: string, newName: string): Promise<Course> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newClass = {
            id: newCode.toUpperCase(),
            class_uuid: newCode.toUpperCase(),
            name: newName,
            students: 0,
            date: '31/12/2026',
            assignment_id: newCode.toUpperCase()
          };
          MOCK_CLASSES.push(newClass);
          resolve(newClass);
        }, 500);
      });
    } else {
      // 1. Lấy danh sách môn học (courses) để tìm xem đã tồn tại chưa
      const coursesRes = await axiosClient.get('/courses');
      let course = Array.isArray(coursesRes.data) 
        ? coursesRes.data.find((c: any) => c.code.toUpperCase() === newCode.toUpperCase())
        : null;
      
      // 2. Nếu môn học chưa tồn tại, tạo mới môn học
      if (!course) {
        const newCourseRes = await axiosClient.post('/courses', {
          code: newCode.toUpperCase(),
          name: newName
        });
        course = newCourseRes.data;
      }

      // 3. Tạo lớp học phần
      const classRes = await axiosClient.post('/classes', {
        course_id: course.id,
        class_code: newCode.toUpperCase(),
        name: newName
      });

      // 4. Tạo luôn bài nộp (assignment) mặc định cho lớp
      let assignmentId = classRes.data.id;
      try {
        const asmRes = await axiosClient.post('/assignments', {
          class_id: classRes.data.id,
          title: 'Báo cáo Đồ án cuối kỳ',
          description: 'Nộp file báo cáo đồ án để hệ thống thẩm định tài liệu tham khảo'
        });
        assignmentId = asmRes.data.id;
      } catch (e) {
        console.error('Không thể tạo bài nộp mặc định cho lớp vừa tạo:', e);
      }

      return {
        id: classRes.data.class_code,
        class_uuid: classRes.data.id,
        name: classRes.data.name,
        students: 0,
        date: new Date(classRes.data.created_at).toLocaleDateString('vi-VN'),
        assignment_id: assignmentId,
        term_name: classRes.data.term_name || null,
      };
    }
  },

  updateClass: async (classId: string, payload: { class_code?: string; name?: string; term_name?: string | null }): Promise<Course> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const idx = MOCK_CLASSES.findIndex((cls) => cls.id === classId || cls.class_uuid === classId);
      if (idx === -1) {
        throw new Error('Không tìm thấy lớp học phần.');
      }
      MOCK_CLASSES[idx] = {
        ...MOCK_CLASSES[idx],
        id: payload.class_code?.toUpperCase() || MOCK_CLASSES[idx].id,
        name: payload.name || MOCK_CLASSES[idx].name,
        term_name: payload.term_name ?? MOCK_CLASSES[idx].term_name,
      };
      return MOCK_CLASSES[idx];
    }

    const response = await axiosClient.put(`/classes/${classId}`, payload);
    return {
      id: response.data.class_code,
      class_uuid: response.data.id,
      name: response.data.name,
      students: 0,
      date: new Date(response.data.created_at).toLocaleDateString('vi-VN'),
      assignment_id: response.data.id,
      term_name: response.data.term_name || null,
    };
  },

  getSubmissionsByClass: async (classId: string): Promise<Submission[]> => {
    if (import.meta.env.VITE_USE_MOCK === 'true' || classId.startsWith('mock-') || !classId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = MOCK_SUBMISSIONS.filter(sub => sub.classId === classId);
          resolve(filtered);
        }, 400);
      });
    }
    try {
      const response = await axiosClient.get(`/classes/${classId}/submissions`);
      return response.data;
    } catch (e) {
      console.warn("Backend does not support fetching class submissions. Falling back to mock data.", e);
      return MOCK_SUBMISSIONS.filter(sub => sub.classId === classId);
    }
  }
};
