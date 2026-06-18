import { useOutletContext } from 'react-router-dom';
import { 
  FileText, CheckCircle2, BarChart3, Fingerprint, Award, Clock, Binary
} from 'lucide-react';

export default function LandingFeatures() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const criteriaList = [
    {
      icon: <Fingerprint size={28} className="text-blue-500" />,
      name: "Tính xác thực (Authenticity)",
      desc: "Xác minh sự tồn tại thực tế của mã định danh DOI (Digital Object Identifier) hoặc PMID (PubMed ID) của tài liệu tham khảo thông qua cổng chéo API CrossRef.",
      detail: "Hệ thống phát hiện các mã DOI ảo, thông tin trích dẫn giả mạo hoặc sai lệch so với cơ sở dữ liệu học thuật quốc tế."
    },
    {
      icon: <Award size={28} className="text-emerald-500" />,
      name: "Độ tin cậy nguồn (Credibility)",
      desc: "Đối chiếu danh mục nhà xuất bản, tạp chí với danh sách đen chứa các tạp chí săn mồi, trục lợi, lừa đảo học thuật (dựa trên danh mục Cabells/Retraction Watch).",
      detail: "Cảnh báo nếu tài liệu tham khảo được xuất bản bởi các nhà xuất bản lừa đảo không được cộng đồng khoa học công nhận."
    },
    {
      icon: <Clock size={28} className="text-amber-500" />,
      name: "Độ cập nhật (Up-to-dateness)",
      desc: "Tính toán tuổi đời tài liệu. Đối với ngành Công nghệ Thông tin, hệ thống tự động đưa ra cảnh báo mức độ nếu tài liệu trích dẫn xuất bản quá 5 năm.",
      detail: "Giúp giảng viên đánh giá xem đồ án tốt nghiệp của sinh viên có đang tiếp cận những công nghệ, kỹ thuật mới nhất hay không."
    },
    {
      icon: <Binary size={28} className="text-purple-500" />,
      name: "Độ phù hợp ngữ nghĩa (Relevance)",
      desc: "Sử dụng mô hình ngôn ngữ Sentence-Transformers để nhúng (embedding) và so khớp tương đồng ngữ nghĩa Vector giữa nội dung trích dẫn và chủ đề chính của đồ án.",
      detail: "Đảm bảo sinh viên trích dẫn đúng tài liệu liên quan đến đề tài nghiên cứu, tránh việc nhồi nhét tài liệu tham khảo không liên quan."
    },
    {
      icon: <FileText size={28} className="text-rose-500" />,
      name: "Chuẩn định dạng (Formatting)",
      desc: "Kiểm tra cú pháp viết danh mục tài liệu tham khảo theo đúng chuẩn quy chuẩn học thuật quốc tế yêu cầu (như APA hoặc IEEE).",
      detail: "Phát hiện lỗi sai dấu câu, sai thứ tự tác giả, thiếu tên tạp chí, hoặc thiếu liên kết truy cập."
    }
  ];

  return (
    <div className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      {/* Glow */}
      <div className={`absolute top-40 right-10 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'
      }`}></div>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center space-y-4">
          <h2 className={`text-3xl sm:text-5xl font-black tracking-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Ma trận 5 tiêu chí tính toán <span className="text-blue-500">Trust Score</span>
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto font-medium transition-colors ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
          }`}>
            Điểm số Trust Score đại diện cho mức độ tin cậy khoa học của tài liệu, được tính toán dựa trên thuật toán tích hợp 5 tiêu chí độc lập.
          </p>
        </div>

        {/* List of Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {criteriaList.map((crit, index) => (
            <div 
              key={index}
              className={`p-8 rounded-[32px] border flex flex-col justify-between transition-all duration-300 relative group ${
                theme === 'dark' 
                  ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' 
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg shadow-sm'
              }`}
            >
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl w-fit border shadow-inner transition-transform duration-300 group-hover:scale-105 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-100'
                }`}>
                  {crit.icon}
                </div>
                <div className="space-y-2">
                  <h3 className={`text-lg font-black leading-tight transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{crit.name}</h3>
                  <p className={`text-xs leading-relaxed font-medium transition-colors ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>{crit.desc}</p>
                </div>
              </div>
              <div className={`border-t mt-6 pt-4 text-xs leading-relaxed transition-colors ${
                theme === 'dark' ? 'border-slate-850/60 text-slate-500' : 'border-slate-100 text-slate-500'
              }`}>
                {crit.detail}
              </div>
            </div>
          ))}

          {/* Under the hood Tech Stack Card */}
          <div className={`p-8 rounded-[32px] border flex flex-col justify-between md:col-span-2 lg:col-span-1 transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/10' 
              : 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-550/15 shadow-sm shadow-slate-100'
          }`}>
            <div className="space-y-6">
              <div className={`p-4 rounded-2xl w-fit border ${
                theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-100'
              }`}>
                <BarChart3 size={28} className="text-indigo-500" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Công nghệ tích hợp</h3>
                <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Hệ thống sử dụng nền tảng trí tuệ nhân tạo nâng cao kết hợp các công cụ chuyên ngành.
                </p>
                <div className="space-y-2 pt-2">
                  {[
                    "Bóc tách tài liệu học thuật bằng GROBID",
                    "So khớp tương đồng ngữ nghĩa Vector NLP",
                    "Đối sánh thực thể CrossRef, OpenAlex"
                  ].map((tech, tIdx) => (
                    <div key={tIdx} className={`flex items-center gap-2 text-xs font-bold ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <CheckCircle2 size={14} className="text-blue-500" /> {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-blue-550 pt-6">
              MTEC Lab &bull; Công nghệ thẩm định 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
