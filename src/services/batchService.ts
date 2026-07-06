import axiosClient from './axiosClient';
import { isMockMode } from './mockMode';

export interface BatchItem {
  submission_id: string;
  job_id: string | null;
  status: string;
  progress: number;
  report_id: string | null;
  error: any;
  studentName?: string;
  fileName?: string;
}

export interface BatchStatusResponse {
  batch_id: string;
  assignment_id: string;
  status: string;
  summary: {
    total: number;
    queued: number;
    running: number;
    completed: number;
    failed: number;
  };
  items: BatchItem[];
}

const mockBatchStates: Record<string, BatchStatusResponse> = {};
const useMock = isMockMode;

export const batchService = {
  createBatch: async (assignmentId: string, submissionIds: string[]): Promise<{ batch_id: string; status: string; total_items: number }> => {
    if (useMock()) {
      const batchId = `mock-batch-${Math.random().toString(36).substring(2, 9)}`;
      
      // Khởi tạo trạng thái ban đầu của mock batch
      const items: BatchItem[] = submissionIds.map((subId, idx) => ({
        submission_id: subId,
        job_id: `mock-job-sub-${idx}`,
        status: 'created',
        progress: 0,
        report_id: null,
        error: null,
        // Điền trước thông tin giả lập phục vụ hiển thị UI
        studentName: subId === 'mock-report-uuid-1' ? 'Trần Quỳnh Như' : 
                     subId === 'mock-sub-1' ? 'Nguyễn Văn A' : 
                     subId === 'mock-sub-2' ? 'Trần Thị B' : 
                     subId === 'mock-sub-3' ? 'Lê Hoàng C' : 'Phạm Văn D',
        fileName: subId === 'mock-report-uuid-1' ? 'Do_an_Tot_nghiep_C#.pdf' : 
                  subId === 'mock-sub-1' ? 'Bao_cao_tot_nghiep_V1.pdf' : 
                  subId === 'mock-sub-2' ? 'Enterprise_Architecture_Final.pdf' : 
                  subId === 'mock-sub-3' ? 'Do_an_Web_Enterprise.docx' : 'Software_Design_Patterns.pdf'
      }));

      mockBatchStates[batchId] = {
        batch_id: batchId,
        assignment_id: assignmentId,
        status: 'created',
        summary: {
          total: submissionIds.length,
          queued: submissionIds.length,
          running: 0,
          completed: 0,
          failed: 0
        },
        items
      };

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            batch_id: batchId,
            status: 'created',
            total_items: submissionIds.length
          });
        }, 300);
      });
    }

    const response = await axiosClient.post('/analysis-batches', {
      assignment_id: assignmentId,
      submission_ids: submissionIds
    });
    return response.data;
  },

  startBatch: async (batchId: string): Promise<{ batch_id: string; status: string }> => {
    if (useMock()) {
      const batch = mockBatchStates[batchId];
      if (batch) {
        batch.status = 'queued';
        batch.items.forEach(item => {
          item.status = 'queued';
        });
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            batch_id: batchId,
            status: 'queued'
          });
        }, 300);
      });
    }

    const response = await axiosClient.post(`/analysis-batches/${batchId}/start`);
    return response.data;
  },

  getBatchStatus: async (batchId: string): Promise<BatchStatusResponse> => {
    if (useMock()) {
      const batch = mockBatchStates[batchId];
      if (!batch) {
        throw new Error('Không tìm thấy thông tin lô phân tích.');
      }

      // Mô phỏng nâng tiến trình của từng item lên
      if (batch.status === 'queued') {
        batch.status = 'running';
      }

      if (batch.status === 'running') {
        let allDone = true;
        batch.items.forEach((item, idx) => {
          if (item.status === 'queued') {
            item.status = 'running';
            item.progress = 10;
            allDone = false;
          } else if (item.status === 'running') {
            allDone = false;
            // Tăng ngẫu nhiên progress từ 15% đến 35%
            const nextProgress = item.progress + Math.floor(Math.random() * 20) + 15;
            if (nextProgress >= 100) {
              // Cố tình làm tệp thứ 3 (chỉ số 2) bị lỗi để demo nút Retry
              if (idx === 2) {
                item.status = 'failed';
                item.progress = 40;
                item.error = {
                  error_code: 'NO_REFERENCE_SECTION',
                  message: 'Không tìm thấy mục tài liệu tham khảo (References Section) trong báo cáo.'
                };
              } else {
                item.status = 'completed';
                item.progress = 100;
                item.report_id = `mock-report-${item.submission_id}`;
              }
            } else {
              item.progress = nextProgress;
            }
          }
        });

        // Đếm lại tổng hợp
        const total = batch.items.length;
        const queued = batch.items.filter(i => i.status === 'queued').length;
        const running = batch.items.filter(i => i.status === 'running').length;
        const completed = batch.items.filter(i => i.status === 'completed').length;
        const failed = batch.items.filter(i => i.status === 'failed').length;

        batch.summary = { total, queued, running, completed, failed };

        if (allDone) {
          batch.status = failed > 0 ? 'partial_success' : 'completed';
        }
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...batch, items: batch.items.map(i => ({ ...i })) });
        }, 300);
      });
    }

    const response = await axiosClient.get(`/analysis-batches/${batchId}`);
    return response.data;
  },

  cancelBatch: async (batchId: string): Promise<{ batch_id: string; status: string }> => {
    if (useMock()) {
      const batch = mockBatchStates[batchId];
      if (batch) {
        batch.status = 'cancelled';
        batch.items.forEach(item => {
          if (item.status === 'queued' || item.status === 'running') {
            item.status = 'cancelled';
          }
        });
      }
      return { batch_id: batchId, status: 'cancelled' };
    }
    const response = await axiosClient.post(`/analysis-batches/${batchId}/cancel`);
    return response.data;
  },

  retryFailed: async (batchId: string): Promise<{ batch_id: string; status: string }> => {
    if (useMock()) {
      const batch = mockBatchStates[batchId];
      if (batch) {
        batch.status = 'running';
        batch.items.forEach(item => {
          if (item.status === 'failed') {
            item.status = 'queued';
            item.progress = 0;
            item.error = null;
          }
        });
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            batch_id: batchId,
            status: 'running'
          });
        }, 300);
      });
    }
    const response = await axiosClient.post(`/analysis-batches/${batchId}/retry-failed`);
    return response.data;
  }
};

export default batchService;
