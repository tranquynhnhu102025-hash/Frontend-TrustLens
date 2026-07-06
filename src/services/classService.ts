import axiosClient from './axiosClient';
import { isMockMode } from './mockMode';
import { MOCK_CLASSES, MOCK_SUBMISSIONS, Submission } from '../mocks/dummyData';

export type { Submission };

export interface Course {
  id: string;
  class_uuid?: string;
  name: string;
  students: number;
  date: string;
  due_date?: string | null;
  assignment_id?: string;
  term_name?: string | null;
}

type AssignmentSummary = {
  id: string;
  class_id: string;
  due_date?: string | null;
};

type UpdateClassPayload = {
  class_code?: string;
  name?: string;
  term_name?: string | null;
  due_date?: string | null;
  assignment_id?: string;
};

const useMock = isMockMode;

const DEFAULT_ASSIGNMENT_TITLE = 'Báo cáo Đồ án cuối kỳ';
const DEFAULT_ASSIGNMENT_DESCRIPTION =
  'Nộp file báo cáo đồ án để hệ thống thẩm định tài liệu tham khảo';

function unwrapItems<T>(data: T[] | { items?: T[] }): T[] {
  return Array.isArray(data) ? data : data.items || [];
}

function formatDueDate(value?: string | null) {
  if (!value) return 'Chưa đặt';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa đặt';

  return date.toLocaleDateString('vi-VN');
}

export function toDateInputValue(value?: string | null) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 10);
}

function toApiDueDate(value?: string | null) {
  if (!value) return null;
  return new Date(`${value}T23:59:00`).toISOString();
}

export function countUniqueStudents(submissions: Submission[]) {
  const names = submissions
    .map((submission) => submission.studentName?.trim().toLowerCase())
    .filter(Boolean);

  return names.length > 0 ? new Set(names).size : submissions.length;
}

async function getSubmissionCount(classId: string) {
  try {
    const response = await axiosClient.get(`/classes/${classId}/submissions`);
    return countUniqueStudents(unwrapItems<Submission>(response.data));
  } catch (error) {
    console.warn('Khong the tai so luong bai nop cua lop:', classId, error);
    return 0;
  }
}

export const classService = {
  getClasses: async (): Promise<Course[]> => {
    if (useMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            MOCK_CLASSES.map((cls) => ({
              ...cls,
              students: countUniqueStudents(MOCK_SUBMISSIONS.filter((sub) => sub.classId === cls.id)),
              due_date: (cls as Course).due_date ?? null,
            })),
          );
        }, 500);
      });
    }

    const classesRes = await axiosClient.get('/classes');
    const assignmentsRes = await axiosClient.get('/assignments');

    const assignmentsMap = new Map<string, AssignmentSummary>();
    unwrapItems<AssignmentSummary>(assignmentsRes.data).forEach((asm: AssignmentSummary) => {
      assignmentsMap.set(asm.class_id, asm);
    });

    const coursesList: Course[] = [];
    const classItems = unwrapItems<any>(classesRes.data);
    if (classItems.length > 0) {
      for (const item of classItems) {
        let assignment = assignmentsMap.get(item.id);

        if (!assignment) {
          try {
            const newAsm = await axiosClient.post('/assignments', {
              class_id: item.id,
              title: DEFAULT_ASSIGNMENT_TITLE,
              description: DEFAULT_ASSIGNMENT_DESCRIPTION,
              due_date: null,
            });
            assignment = newAsm.data;
          } catch (error) {
            console.error('Khong the tao bai nop mac dinh cho lop:', item.id, error);
          }
        }

        coursesList.push({
          id: item.class_code,
          class_uuid: item.id,
          name: item.name,
          students: await getSubmissionCount(item.id),
          date: formatDueDate(assignment?.due_date),
          due_date: assignment?.due_date ?? null,
          assignment_id: assignment?.id,
          term_name: item.term_name || null,
        });
      }
    }

    return coursesList;
  },

  createClass: async (newCode: string, newName: string): Promise<Course> => {
    if (useMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newClass: Course = {
            id: newCode.toUpperCase(),
            class_uuid: newCode.toUpperCase(),
            name: newName,
            students: 0,
            date: 'Chưa đặt',
            due_date: null,
            assignment_id: newCode.toUpperCase(),
          };
          MOCK_CLASSES.push(newClass);
          resolve(newClass);
        }, 500);
      });
    }

    const coursesRes = await axiosClient.get('/courses');
    let course = unwrapItems<any>(coursesRes.data).find((c: any) => c.code.toUpperCase() === newCode.toUpperCase()) || null;

    if (!course) {
      const newCourseRes = await axiosClient.post('/courses', {
        code: newCode.toUpperCase(),
        name: newName,
      });
      course = newCourseRes.data;
    }

    const classRes = await axiosClient.post('/classes', {
      course_id: course.id,
      class_code: newCode.toUpperCase(),
      name: newName,
    });

    let assignment: AssignmentSummary | null = null;
    try {
      const asmRes = await axiosClient.post('/assignments', {
        class_id: classRes.data.id,
        title: DEFAULT_ASSIGNMENT_TITLE,
        description: DEFAULT_ASSIGNMENT_DESCRIPTION,
        due_date: null,
      });
      assignment = asmRes.data;
    } catch (error) {
      console.error('Khong the tao bai nop mac dinh cho lop vua tao:', error);
    }

    return {
      id: classRes.data.class_code,
      class_uuid: classRes.data.id,
      name: classRes.data.name,
      students: 0,
      date: formatDueDate(assignment?.due_date),
      due_date: assignment?.due_date ?? null,
      assignment_id: assignment?.id,
      term_name: classRes.data.term_name || null,
    };
  },

  updateClass: async (classId: string, payload: UpdateClassPayload): Promise<Course> => {
    if (useMock()) {
      const idx = MOCK_CLASSES.findIndex((cls) => cls.id === classId || cls.class_uuid === classId);
      if (idx === -1) {
        throw new Error('Khong tim thay lop hoc phan.');
      }

      const dueDate = payload.due_date ?? (MOCK_CLASSES[idx] as Course).due_date ?? null;
      MOCK_CLASSES[idx] = {
        ...MOCK_CLASSES[idx],
        id: payload.class_code?.toUpperCase() || MOCK_CLASSES[idx].id,
        name: payload.name || MOCK_CLASSES[idx].name,
        term_name: payload.term_name ?? MOCK_CLASSES[idx].term_name,
        due_date: dueDate,
        date: formatDueDate(dueDate),
      };
      return MOCK_CLASSES[idx];
    }

    const { due_date: dueDateInput, assignment_id: assignmentId, ...classPayload } = payload;
    const response = await axiosClient.put(`/classes/${classId}`, classPayload);

    let assignment: AssignmentSummary | null = null;
    if (dueDateInput !== undefined) {
      const dueDate = toApiDueDate(dueDateInput);
      const assignmentRes = assignmentId
        ? await axiosClient.patch(`/assignments/${assignmentId}`, {
            due_date: dueDate,
          })
        : await axiosClient.post('/assignments', {
            class_id: response.data.id,
            title: DEFAULT_ASSIGNMENT_TITLE,
            description: DEFAULT_ASSIGNMENT_DESCRIPTION,
            due_date: dueDate,
          });
      assignment = assignmentRes.data;
    }

    return {
      id: response.data.class_code,
      class_uuid: response.data.id,
      name: response.data.name,
      students: await getSubmissionCount(response.data.id),
      date: formatDueDate(assignment?.due_date),
      due_date: assignment?.due_date ?? dueDateInput ?? null,
      assignment_id: assignment?.id || assignmentId,
      term_name: response.data.term_name || null,
    };
  },

  deleteClass: async (classId: string): Promise<void> => {
    if (useMock()) {
      const idx = MOCK_CLASSES.findIndex((cls) => cls.id === classId || cls.class_uuid === classId);
      if (idx !== -1) {
        const removed = MOCK_CLASSES[idx];
        MOCK_CLASSES.splice(idx, 1);
        for (let i = MOCK_SUBMISSIONS.length - 1; i >= 0; i -= 1) {
          if (MOCK_SUBMISSIONS[i].classId === removed.id || MOCK_SUBMISSIONS[i].classId === removed.class_uuid) {
            MOCK_SUBMISSIONS.splice(i, 1);
          }
        }
      }
      return;
    }

    await axiosClient.delete(`/classes/${classId}`);
  },

  deleteSubmission: async (submissionId: string): Promise<void> => {
    if (useMock()) {
      const idx = MOCK_SUBMISSIONS.findIndex((sub) => sub.id === submissionId);
      if (idx !== -1) {
        MOCK_SUBMISSIONS.splice(idx, 1);
      }
      return;
    }

    await axiosClient.delete(`/submissions/${submissionId}`);
  },

  getSubmissionsByClass: async (classId: string): Promise<Submission[]> => {
    if (!classId) {
      return [];
    }

    if (useMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = MOCK_SUBMISSIONS.filter((sub) => sub.classId === classId);
          resolve(filtered);
        }, 400);
      });
    }

    const response = await axiosClient.get(`/classes/${classId}/submissions`);
    return unwrapItems<Submission>(response.data);
  },
};
