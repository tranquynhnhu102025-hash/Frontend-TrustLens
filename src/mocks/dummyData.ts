// Định nghĩa kiểu dữ liệu cho Course khớp với classService
export interface Course {
  id: string;
  class_uuid?: string;
  name: string;
  students: number;
  date: string;
  assignment_id?: string;
  term_name?: string | null;
}

// Danh sách lớp học phần giả lập
export let MOCK_CLASSES: Course[] = [
  { id: 'INT4050', name: 'Đồ án Tốt nghiệp - Khóa 2022', students: 45, date: '15/06/2026', assignment_id: 'INT4050' },
  { id: 'INT3307', name: 'Phát triển Hệ thống Thông tin Enterprise', students: 38, date: '20/06/2026', assignment_id: 'INT3307' },
  { id: 'INT3110', name: 'Kỹ thuật phần mềm nâng cao', students: 42, date: '18/06/2026', assignment_id: 'INT3110' }
];

// Dữ liệu báo cáo mẫu khớp với cấu trúc JSON chuẩn của Backend API
// Dữ liệu lịch sử các lần chấm điểm của đồ án
export const MOCK_REVISIONS = [
  { id: "mock-report-uuid-revision-1", revision_number: 1, created_at: "2026-06-19T01:10:00Z", report_trust_score: 75, scoring_preset_code: "IT_GENERAL", scoring_preset_version: 1 },
  { id: "mock-report-uuid-1", revision_number: 2, created_at: "2026-06-19T01:30:00Z", report_trust_score: 78, scoring_preset_code: "IT_GENERAL", scoring_preset_version: 1 }
];

// Dữ liệu báo cáo mẫu khớp với cấu trúc JSON chuẩn của Backend API P1
export const MOCK_REPORT = {
  report_id: "mock-report-uuid-1",
  submission_id: "mock-sub-uuid-1",
  job_id: "mock-job-uuid-1",
  scoring_config_version: "trust-score-v1.1",
  report_trust_score: 78,
  confidence_score: 0.82,
  overall_label: "needs_review",
  revision_number: 2,
  scoring_preset_code: "IT_GENERAL",
  scoring_preset_version: 1,
  scoring_preset_name: "CNTT tổng quát",
  created_at: "2026-06-19T01:30:00Z",
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
    c1_metadata_completeness: {
      score: 8.4,
      max_score: 10,
      reason_code: "METADATA_COMPLETE",
      explanation: "Thông tin mô tả của danh mục tài liệu tham khảo đạt độ hoàn thiện cao, hầu hết đều có đầy đủ tác giả, tiêu đề, năm xuất bản và nơi công bố.",
      evidence: { completeness_ratio: 0.94 },
      recommendation: "Bổ sung DOI hoặc URL cho các bài báo hội thảo còn thiếu để tăng tính liên kết."
    },
    c2_metadata_verification: {
      score: 20.2,
      max_score: 25,
      reason_code: "METADATA_VERIFIED_PARTIAL",
      explanation: "Hầu hết các tài liệu đã đối sánh chính xác với cơ sở dữ liệu CrossRef/OpenAlex. Một số tài liệu bị lệch năm xuất bản nhẹ so với cơ sở dữ liệu gốc.",
      evidence: { verified_ratio: 0.82, year_mismatches: 3 },
      recommendation: "Hiệu chỉnh lại năm xuất bản của 3 tài liệu bị gắn cờ cảnh báo lệch năm."
    },
    c3_source_credibility: {
      score: 15.6,
      max_score: 20,
      reason_code: "SOURCE_CREDIBLE_WELL_KNOWN",
      explanation: "Đa số tài liệu trích dẫn thuộc danh mục tạp chí uy tín thuộc IEEE, ACM, Springer. Phát hiện 1 nguồn tài liệu từ blog cá nhân có độ tin cậy thấp.",
      evidence: { peer_reviewed_ratio: 0.88, blogs_detected: 1 },
      recommendation: "Hạn chế trích dẫn từ blog cá nhân trừ khi tác giả là chuyên gia đầu ngành được thừa nhận."
    },
    c4_relevance: {
      score: 15.0,
      max_score: 20,
      reason_code: "RELEVANCE_HIGH",
      explanation: "Mức độ tương đồng ngữ nghĩa vector giữa nội dung trích dẫn và chủ đề chính của đồ án tốt nghiệp đạt mức cao.",
      evidence: { average_semantic_similarity: 0.76 },
      recommendation: "Duy trì hướng trích dẫn hiện tại. Có thể bổ sung thêm tài liệu liên quan trực tiếp đến thuật toán chính."
    },
    c5_recency: {
      score: 7.8,
      max_score: 10,
      reason_code: "RECENCY_ACCEPTABLE",
      explanation: "Phần lớn tài liệu được xuất bản trong vòng 5 năm gần đây. Tuy nhiên, phát hiện một vài tài liệu cũ (>10 năm) trong lĩnh vực công nghệ thông tin.",
      evidence: { average_age_years: 4.2, outdated_citations_count: 2 },
      recommendation: "Cập nhật các tài liệu quá cũ bằng các công trình nghiên cứu mới hơn (từ năm 2021 đến nay)."
    },
    c6_citation_style: {
      score: 8.0,
      max_score: 10,
      reason_code: "STYLE_APA_MINOR_ERRORS",
      explanation: "Quy cách định dạng trích dẫn bám sát chuẩn APA 7th. Phát hiện một số lỗi nhỏ liên quan đến cách viết hoa tiêu đề hoặc thiếu dấu chấm câu cuối dòng.",
      evidence: { format_compliance_score: 0.85, style_violations: 2 },
      recommendation: "Rà soát lại định dạng dấu ngoặc đơn và viết hoa tiêu đề theo đúng cẩm nang hướng dẫn APA 7th."
    },
    c7_duplicate_concentration: {
      score: 3.8,
      max_score: 5,
      reason_code: "DIVERSITY_GOOD",
      explanation: "Danh mục trích dẫn thể hiện độ đa dạng nguồn tốt khi phân phối đều qua nhiều nhà xuất bản, hội thảo và tạp chí khoa học khác nhau.",
      evidence: { publisher_diversity_entropy: 1.84 },
      recommendation: "Tiếp tục phát huy. Tránh tập trung quá nhiều trích dẫn vào cùng một nhóm nghiên cứu hoặc một tác giả duy nhất."
    }
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
        status: "VERIFIED",
        confidence: 0.98,
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
        status: "URL_ONLY",
        confidence: 0.35,
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
        status: "NOT_FOUND",
        confidence: 0.0,
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
  role: 'lecturer',
  permissions: [
    'auth.login',
    'course.manage',
    'assignment.manage',
    'submission.upload',
    'job.analyze',
    'report.view_own_scope',
    'report.export',
  ],
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
