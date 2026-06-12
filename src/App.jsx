import React, { useState } from 'react';
import { 
  FileText, LogIn, FolderOpen, UploadCloud, RefreshCw, 
  CheckCircle2, AlertTriangle, XCircle, Download, ArrowLeft, 
  Plus, Users, Calendar, ShieldCheck, ChevronRight, FileType,
  LogOut, ShieldAlert
} from 'lucide-react';

// ==========================================
// 1. DỮ LIỆU GIẢ LẬP 
// ==========================================
const MOCK_CLASSES = [
  { id: 'it01', name: "Đồ án Tốt nghiệp - Khóa 2022", code: "INT4050", students: 45, date: "15/06/2026" },
  { id: 'it02', name: "Phát triển Hệ thống Thông tin", code: "INT3307", students: 38, date: "20/06/2026" },
  { id: 'it03', name: "Kỹ thuật phần mềm nâng cao", code: "INT3110", students: 42, date: "18/06/2026" }
];

const MOCK_REPORT = {
  fileName: "Do_an_Tot_nghiep_Build_Ecommerce_Cart_C#.pdf",
  studentName: "Trần Quỳnh Như",
  studentId: "ST202603",
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

// ==========================================
// 2. SUB-COMPONENTS GIAO DIỆN
// ==========================================
function StatusBadge({ status }) {
  const configs = {
    Good: "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1",
    Review: "bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1",
    Risk: "bg-rose-50 text-rose-700 border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1"
  };
  
  const icons = {
    Good: <CheckCircle2 size={12} className="text-emerald-500" />,
    Review: <AlertTriangle size={12} className="text-amber-500" />,
    Risk: <XCircle size={12} className="text-rose-500" />
  };

  return (
    <span className={configs[status] || configs.Review}>
      {icons[status]} {status}
    </span>
  );
}

// THẺ THỐNG KÊ (Mang từ bản mới qua)
function StatCard({ icon, title, value, colorClass }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ==========================================
// 3. THÀNH PHẦN ĐIỀU PHỐI CHÍNH (MAIN APP SHELL)
// ==========================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedClass, setSelectedClass] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const triggerAnalysisSimulation = () => {
    setCurrentScreen('analyzing');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentScreen('report'), 400);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      
      {/* THANH TOPBAR ĐIỀU HƯỚNG DÙNG CHUNG */}
      {currentScreen !== 'login' && (
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 rounded-xl shadow-md">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-slate-800">TRUST<span className="text-blue-600">LENS</span></h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Academic Verification Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentScreen('classes')} 
              className={`text-sm font-bold px-3 py-2 rounded-xl transition-all ${currentScreen === 'classes' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Lớp học quản lý
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
              Tài khoản: Trần Quỳnh Như
            </span>

            <button 
              onClick={() => setCurrentScreen('login')} 
              className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </div>
        </header>
      )}

      {/* VÙNG CHỨA NỘI DUNG CHÍNH */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col justify-center">
        
        {/* MÀN HÌNH 1: ĐĂNG NHẬP */}
        {currentScreen === 'login' && (
          <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl mt-12 animate-fade-in">
            <div className="text-center mb-8">
              <div className="bg-blue-600 text-white p-3 rounded-2xl w-fit mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <FileText size={28} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Hệ thống TrustLens</h2>
              <p className="text-sm text-slate-400 mt-1">Xác thực danh mục tài liệu đồ án khoa học</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tài khoản nội bộ</label>
                <input type="text" placeholder="quynhnhu@huce.edu.vn" defaultValue="quynhnhu@huce.edu.vn" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mật khẩu bảo mật</label>
                <input type="password" value="••••••••••••" readOnly className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none bg-slate-50/50 text-slate-400" />
              </div>
              <button 
                onClick={() => setCurrentScreen('classes')} 
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 mt-2"
              >
                <LogIn size={16} /> Đăng nhập hệ thống
              </button>
            </div>
          </div>
        )}

        {/* MÀN HÌNH 2: QUẢN LÝ LỚP HỌC */}
        {currentScreen === 'classes' && (
          <div className="w-full space-y-6 max-w-5xl mx-auto py-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Danh sách lớp phụ trách</h2>
                <p className="text-sm text-slate-500 mt-0.5">Chọn học phần để tiến hành nộp và duyệt tập tin báo cáo đồ án.</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5">
                <Plus size={14} /> Thêm lớp học phần
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_CLASSES.map((cls) => (
                <div 
                  key={cls.id} 
                  onClick={() => { setSelectedClass(cls); setCurrentScreen('upload'); }}
                  className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md tracking-wider uppercase">{cls.code}</span>
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors leading-snug">{cls.name}</h3>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1"><Users size={14} /> {cls.students} Sinh viên</div>
                    <div className="flex items-center gap-1"><Calendar size={14} /> Hạn: {cls.date}</div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÀN HÌNH 3: TẢI LÊN FILE */}
        {currentScreen === 'upload' && (
          <div className="max-w-3xl w-full mx-auto space-y-6 py-4 animate-fade-in">
            <button onClick={() => setCurrentScreen('classes')} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft size={14} /> Quay lại danh sách lớp
            </button>
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
              <FolderOpen className="text-blue-600 shrink-0" size={20} />
              <p className="text-xs font-medium text-blue-800 leading-relaxed">
                Đang thao tác tại học phần: <span className="font-bold">{selectedClass?.name} ({selectedClass?.code})</span>.
              </p>
            </div>

            <div className="bg-white border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-12 text-center transition-all duration-300 shadow-sm bg-gradient-to-b from-white to-slate-50/50">
              <label className="cursor-pointer block">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
                  <UploadCloud className="text-blue-600" size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Kéo thả tệp đồ án tốt nghiệp cần thẩm định</h3>
                <p className="text-xs text-slate-400 mb-6">Chấp nhận định dạng văn bản chuẩn (.PDF hoặc .DOCX)</p>
                <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md text-xs">
                  <FileType size={14} /> Chọn tệp từ thiết bị
                </span>
                <input type="file" accept=".pdf,.docx" onChange={triggerAnalysisSimulation} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* MÀN HÌNH 4: ĐANG PHÂN TÍCH */}
        {currentScreen === 'analyzing' && (
          <div className="max-w-md w-full mx-auto text-center py-12 space-y-6 bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm animate-fade-in">
            <RefreshCw className="animate-spin text-blue-600 mx-auto" size={36} />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Đang thực thi luồng phân tích TrustLens...</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">Hệ thống đang bóc tách chuỗi thô bằng cấu trúc học thuật GROBID và đối chiếu API chéo với dữ liệu CrossRef.</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/40">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{uploadProgress}% Hoàn thành</span>
          </div>
        )}

        {/* MÀN HÌNH 5: BÁO CÁO KẾT QUẢ (LAI GIỮA ĐẦU XỊN VÀ THÂN CŨ) */}
        {currentScreen === 'report' && (
          <div className="max-w-5xl w-full mx-auto space-y-6 py-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <button onClick={() => setCurrentScreen('upload')} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <ArrowLeft size={12} /> Kiểm tra báo cáo khác
              </button>
              <button className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm flex items-center gap-1.5 self-stretch sm:self-auto justify-center">
                <Download size={14} /> Xuất file báo cáo (.PDF)
              </button>
            </div>

            {/* DÀN THẺ THỐNG KÊ (LẤY TỪ BẢN MỚI) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<FileText size={20} className="text-blue-600"/>} title="Tổng trích dẫn" value={MOCK_REPORT.summary.total} colorClass="bg-blue-100" />
              <StatCard icon={<CheckCircle2 size={20} className="text-emerald-600"/>} title="Hợp lệ (Sạch)" value={MOCK_REPORT.summary.good} colorClass="bg-emerald-100" />
              <StatCard icon={<AlertTriangle size={20} className="text-amber-600"/>} title="Lỗi định dạng/Cũ" value={MOCK_REPORT.summary.review} colorClass="bg-amber-100" />
              <StatCard icon={<ShieldAlert size={20} className="text-rose-600"/>} title="Cảnh báo lừa đảo" value={MOCK_REPORT.summary.risk} colorClass="bg-rose-100" />
            </div>

            {/* BIỂU ĐỒ TRÒN KẾT HỢP VỚI THÔNG TIN FILE (LẤY TỪ BẢN MỚI) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" className="text-slate-100 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path strokeDasharray={`${MOCK_REPORT.trustScore}, 100`} className="text-blue-600 stroke-current" strokeWidth="3" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-800">{MOCK_REPORT.trustScore}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Trust Score</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left">
                <StatusBadge status={MOCK_REPORT.globalStatus} />
                <h2 className="text-2xl font-black text-slate-800">{MOCK_REPORT.fileName}</h2>
                <p className="text-sm text-slate-500 font-medium">Sinh viên thực hiện: <span className="text-slate-800">{MOCK_REPORT.studentName} ({MOCK_REPORT.studentId})</span></p>
              </div>
            </div>

            {/* LƯỚI MA TRẬN 5 TIÊU CHÍ (GIỮ Y CHANG CODE CŨ BẠN DÁN VÀO) */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5"><ShieldCheck size={18} className="text-blue-600" /> Chi tiết ma trận 5 tiêu chí tính toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_REPORT.criteria.map((c, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 tracking-tight leading-tight">{c.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{c.desc}</p>
                    </div>
                    <div className="border-t border-slate-50 pt-3 flex flex-col gap-2">
                      <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg leading-snug">{c.log}</p>
                      <div className="text-right"><StatusBadge status={c.status} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BẢNG CHI TIẾT TRÍCH DẪN (GIỮ Y CHANG CODE CŨ BẠN DÁN VÀO) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/60">
                <h3 className="text-base font-bold text-slate-800">Danh mục tài liệu bóc tách từ văn bản đồ án</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                      <th className="p-4 w-7/12">Chuỗi văn bản trích dẫn (Bóc tách GROBID)</th>
                      <th className="p-4">Đánh giá trạng thái</th>
                      <th className="p-4">Nhật ký chi tiết của thuật toán AI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {MOCK_REPORT.citations.map((cite) => (
                      <tr key={cite.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 text-slate-600 font-mono text-[11px] md:text-xs leading-relaxed">{cite.text}</td>
                        <td className="p-4 whitespace-nowrap"><StatusBadge status={cite.status} /></td>
                        <td className={`p-4 text-xs font-bold ${cite.status === 'Good' ? 'text-emerald-600' : cite.status === 'Risk' ? 'text-rose-600' : 'text-amber-600'} leading-normal`}>
                          {cite.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* THANH FOOTER */}
      <footer className="bg-white border-t border-slate-200/60 py-4 text-center text-xs font-medium text-slate-400 sticky bottom-0 z-10 shadow-sm">
        MTEC-2026
      </footer>

    </div>
  );
}