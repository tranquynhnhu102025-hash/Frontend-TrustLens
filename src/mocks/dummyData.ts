export const MOCK_CLASSES = [
  { id: 'it01', name: "Đồ án Tốt nghiệp - Khóa 2022", code: "INT4050", students: 45, date: "15/06/2026" },
  { id: 'it02', name: "Phát triển Hệ thống Thông tin Enterprise", code: "INT3307", students: 38, date: "20/06/2026" },
  { id: 'it03', name: "Kỹ thuật phần mềm nâng cao", code: "INT3110", students: 42, date: "18/06/2026" }
];

export const MOCK_REPORT = {
  fileName: "Do_an_Tot_nghiep_C#.pdf",
  studentName: "Trần Quỳnh Như",
  studentId: "2400008936",
  trustScore: 78,
  globalStatus: "Review",
  summary: { total: 5, good: 2, review: 2, risk: 1 },
  criteria: [
    { name: "Tính xác thực (Authenticity)", desc: "Xác minh sự tồn tại thực tế của mã DOI/PMID qua CrossRef API.", status: "Good", log: "100% mã định danh tồn tại thực tế." },
    { name: "Độ tin cậy nguồn (Credibility)", desc: "Đối chiếu danh sách tạp chí săn mồi hoăc lừa đảo Cabells/Retraction Watch.", status: "Risk", log: "Phát hiện 1 tài liệu thuộc danh mục cảnh báo hệ thống." },
    { name: "Độ cập nhật (Up-to-dateness)", desc: "Tính khoảng thời gian xuất bản (Cảnh báo tài liệu >5 năm với ngành IT).", status: "Review", log: "Có 2 tài liệu tham khảo xuất bản quá lâu." },
    { name: "Độ phù hợp (Relevance)", desc: "So khớp tương đồng ngữ nghĩa vector giữa trích dẫn và chủ đề đồ án.", status: "Good", log: "Mức độ trùng khớp ngữ nghĩa đạt yêu cầu." },
    { name: "Chuẩn định dạng (Formatting)", desc: "Kiểm tra lỗi cú pháp hiển thị dấu câu theo chuẩn quy cách APA/IEEE.", status: "Review", log: "Sai quy cách thụt dòng hoặc dấu ngoặc ở 1 vị trí." }
  ],
  citations: [
    { id: 1, text: "Nguyen, A. & Vu, B. (2024). Deep Learning for Shopping Cart Recommendation. Journal of IT, 12(2).", status: "Good", details: "Hợp lệ - Tìm thấy đối sánh thực tế trên hệ thống CrossRef." },
    { id: 2, text: "Smith, J. (2014). E-Commerce Architectures and Legacy Databases. Global Academic Press.", status: "Review", details: "Cảnh báo độ cập nhật: Tài liệu xuất bản quá 5 năm so với tốc độ phát triển ngành." },
    { id: 3, text: "John Doe, (2023) 'Advanced State Management in React Layouts', Tech Journal.", status: "Review", details: "Lỗi định dạng: Sai cấu trúc hiển thị dấu ngoặc đơn và dấu phẩy theo chuẩn APA." },
    { id: 4, text: "Al-Predatory, M. (2025). Fake Insights on Blockchain Systems. Predatory Technology Publisher.", status: "Risk", details: "Cảnh báo nghiêm trọng: Nguồn trích dẫn nằm trong danh sách tạp chí trục lợi lừa đảo." }
  ]
};