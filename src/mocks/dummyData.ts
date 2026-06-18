// Định nghĩa kiểu dữ liệu cho Course khớp với classService
export interface Course {
  id: string;
  name: string;
  students: number;
  date: string;
  assignment_id?: string;
}

// Danh sách lớp học phần giả lập
export let MOCK_CLASSES: Course[] = [
  { id: 'INT4050', name: 'Đồ án Tốt nghiệp - Khóa 2022', students: 45, date: '15/06/2026', assignment_id: 'INT4050' },
  { id: 'INT3307', name: 'Phát triển Hệ thống Thông tin Enterprise', students: 38, date: '20/06/2026', assignment_id: 'INT3307' },
  { id: 'INT3110', name: 'Kỹ thuật phần mềm nâng cao', students: 42, date: '18/06/2026', assignment_id: 'INT3110' }
];

// Dữ liệu báo cáo mẫu khớp với cấu trúc JSON chuẩn của Backend API
export const MOCK_REPORT = {
  report_id: "mock-report-uuid-1",
  submission_id: "mock-sub-uuid-1",
  job_id: "mock-job-uuid-1",
  scoring_config_version: "trust-score-v1.0",
  report_trust_score: 78,
  confidence_score: 0.82,
  overall_label: "needs_review",
  summary: {
    total_citations: 24,
    verified: 18,
    partial: 3,
    not_found: 2,
    unknown: 1,
    critical_warnings: 2,
    high_warnings: 3,
    medium_warnings: 4,
    low_warnings: 5
  },
  report_penalty: {
    total: 3.5,
    items: [
      {
        code: "EXCESSIVE_UNVERIFIED_RATIO",
        value: 3.5,
        explanation: "Tỷ lệ nguồn chưa xác minh vượt ngưỡng cấu hình."
      }
    ]
  },
  component_summary: {
    c1_metadata_completeness: 8.4,
    c2_metadata_verification: 16.2,
    c3_source_credibility: 15.6,
    c4_relevance: 15.0,
    c5_recency: 7.8,
    c6_citation_quality: 8.0,
    c7_source_diversity: 3.8,
    c8_academic_risk_integrity: 4.2
  },
  citations: [
    {
      citation_id: "1",
      raw_text: "Attention Is All You Need",
      normalized_fields: {
        title: "Attention Is All You Need",
        authors: ["Vaswani", "Shazeer", "Parmar", "Uszkoreit", "Jones", "Gomez", "Kaiser", "Polosukhin"],
        year: 2017,
        doi: "10.48550/arXiv.1706.03762",
        url: "https://arxiv.org/abs/1706.03762",
        venue: "arXiv"
      },
      metadata: {
        provider: "crossref",
        match_status: "verified",
        match_confidence: 0.98,
        source_type: "journal"
      },
      warnings: []
    },
    {
      citation_id: "2",
      raw_text: "Nguyen, A. & Vu, B. (2023). Khái niệm về Trí tuệ nhân tạo. Blog cá nhân (WordPress).",
      normalized_fields: {
        title: "Khái niệm về Trí tuệ nhân tạo",
        authors: ["Nguyễn Văn A", "Vũ Văn B"],
        year: 2023,
        doi: null,
        url: "https://wordpress.com/ai-basics",
        venue: "Blog cá nhân (WordPress)"
      },
      metadata: {
        provider: null,
        match_status: "unknown",
        match_confidence: 0.0,
        source_type: "blog"
      },
      warnings: [
        {
          severity: "medium",
          message: "Nguồn không thuộc hệ thống học thuật chính thống",
          recommendation: "Đối chiếu nguồn tin cậy hơn hoặc thay thế bằng bài báo khoa học."
        }
      ]
    },
    {
      citation_id: "3",
      raw_text: "Wikipedia contributors. (2010). Ứng dụng AI trong giáo dục. Wikipedia.",
      normalized_fields: {
        title: "Ứng dụng AI trong giáo dục",
        authors: ["Wikipedia contributors"],
        year: 2010,
        doi: null,
        url: "https://wikipedia.org/wiki/AI_in_education",
        venue: "Wikipedia"
      },
      metadata: {
        provider: null,
        match_status: "not_found",
        match_confidence: 0.0,
        source_type: "wiki"
      },
      warnings: [
        {
          severity: "critical",
          message: "Wikipedia không được chấp nhận làm tài liệu tham khảo trong đồ án tốt nghiệp",
          recommendation: "Tìm và trích dẫn bài báo gốc hoặc sách chuyên ngành thay thế."
        },
        {
          severity: "high",
          message: "Độ cập nhật kém (>10 năm so với hiện tại)",
          recommendation: "Cập nhật tài liệu mới xuất bản trong vòng 5 năm trở lại đây."
        }
      ]
    }
  ]
};

// Tổng quan số liệu trang chủ
export const MOCK_SUMMARY = {
  totalSubmissions: 156,
  passed: 112,
  warnings: 34,
  critical: 10,
};

// Các hoạt động kiểm duyệt gần đây
export const MOCK_ACTIVITIES = [
  { id: 'SUB-101', student: 'Nguyễn Văn A', class: 'INT4050', time: '10 phút trước', score: 85, status: 'pass', submission_id: 'mock-sub-1' },
  { id: 'SUB-102', student: 'Trần Thị B', class: 'INT3307', time: '1 giờ trước', score: 55, status: 'warning', submission_id: 'mock-sub-2' },
  { id: 'SUB-103', student: 'Lê Hoàng C', class: 'INT4050', time: '3 giờ trước', score: 32, status: 'fail', submission_id: 'mock-sub-3' },
  { id: 'SUB-104', student: 'Phạm Văn D', class: 'INT3110', time: 'Hôm qua', score: 92, status: 'pass', submission_id: 'mock-sub-4' },
];

// Tiến trình xử lý thẩm định
export const MOCK_STAGES = [
  { status: 'queued', progress: 0, current_step: 'queued' },
  { status: 'validating', progress: 5, current_step: 'validating' },
  { status: 'extracting', progress: 15, current_step: 'extracting' },
  { status: 'detecting_references', progress: 30, current_step: 'detecting_references' },
  { status: 'parsing_citations', progress: 40, current_step: 'parsing_citations' },
  { status: 'normalizing', progress: 50, current_step: 'normalizing' },
  { status: 'verifying_metadata', progress: 65, current_step: 'verifying_metadata' },
  { status: 'scoring', progress: 80, current_step: 'scoring' },
  { status: 'building_report', progress: 90, current_step: 'building_report' },
  { status: 'completed', progress: 100, current_step: 'completed' },
];

// Nhật ký hoạt động admin
export const MOCK_AUDIT_LOGS = [
  { id: 1, action: 'Cập nhật trọng số Trust Score', user: 'Admin_Truc', time: '10 phút trước', type: 'config' },
  { id: 2, action: 'Thêm tài khoản Giảng viên', user: 'Admin_Nhu', time: '1 giờ trước', type: 'user' },
  { id: 3, action: 'Kết nối API IEEE Xplore', user: 'System', time: '3 giờ trước', type: 'metadata' },
  { id: 4, action: 'Xóa bài nộp SUB-099', user: 'Admin_Truc', time: 'Hôm qua', type: 'system' },
];

// Dữ liệu người dùng giả lập
export const MOCK_USER = {
  id: 'mock-user-id',
  full_name: 'Trần Quỳnh Như',
  email: 'quynhnhu@nttu.edu.vn',
  role: 'lecturer'
};

// Kiểu dữ liệu bài nộp (file đã upload)
export interface Submission {
  id: string;
  studentName: string;
  fileName: string;
  date: string;
  trustScore: number;
  status: 'pass' | 'warning' | 'fail';
  classId: string;
}

// Danh sách các bài nộp (file báo cáo đã tải lên) giả lập theo từng lớp học
export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 'mock-report-uuid-1', studentName: 'Trần Quỳnh Như', fileName: 'Do_an_Tot_nghiep_C#.pdf', date: '15/06/2026', trustScore: 78, status: 'warning', classId: 'INT4050' },
  { id: 'mock-sub-1', studentName: 'Nguyễn Văn A', fileName: 'Bao_cao_tot_nghiep_V1.pdf', date: '15/06/2026', trustScore: 85, status: 'pass', classId: 'INT4050' },
  { id: 'mock-sub-2', studentName: 'Trần Thị B', fileName: 'Enterprise_Architecture_Final.pdf', date: '12/06/2026', trustScore: 55, status: 'warning', classId: 'INT3307' },
  { id: 'mock-sub-3', studentName: 'Lê Hoàng C', fileName: 'Do_an_Web_Enterprise.docx', date: '14/06/2026', trustScore: 32, status: 'fail', classId: 'INT4050' },
  { id: 'mock-sub-4', studentName: 'Phạm Văn D', fileName: 'Software_Design_Patterns.pdf', date: '11/06/2026', trustScore: 92, status: 'pass', classId: 'INT3110' },
];