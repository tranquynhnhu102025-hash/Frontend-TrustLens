import { useOutletContext } from 'react-router-dom';
import { 
  FileText, Check, BarChart3, Fingerprint, Award, Clock, Binary
} from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function LandingFeatures() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const criteriaList = [
    {
      icon: <Fingerprint size={20} className="text-zinc-650 dark:text-zinc-400" />,
      name: "Tính xác thực (Authenticity)",
      desc: "Xác minh sự tồn tại thực tế của mã định danh DOI (Digital Object Identifier) hoặc PMID (PubMed ID) của tài liệu tham khảo thông qua cổng chéo API CrossRef.",
      detail: "Hệ thống phát hiện các mã DOI ảo, thông tin trích dẫn giả mạo hoặc sai lệch so với cơ sở dữ liệu học thuật quốc tế."
    },
    {
      icon: <Award size={20} className="text-zinc-650 dark:text-zinc-400" />,
      name: "Độ tin cậy nguồn (Credibility)",
      desc: "Đối chiếu danh mục nhà xuất bản, tạp chí với danh sách đen chứa các tạp chí săn mồi, trục lợi, lừa đảo học thuật (dựa trên danh mục Cabells/Retraction Watch).",
      detail: "Cảnh báo nếu tài liệu tham khảo được xuất bản bởi các nhà xuất bản lừa đảo không được cộng đồng khoa học công nhận."
    },
    {
      icon: <Clock size={20} className="text-zinc-650 dark:text-zinc-400" />,
      name: "Độ cập nhật (Up-to-dateness)",
      desc: "Tính toán tuổi đời tài liệu. Đối với ngành Công nghệ Thông tin, hệ thống tự động đưa ra cảnh báo mức độ nếu tài liệu trích dẫn xuất bản quá 5 năm.",
      detail: "Giúp giảng viên đánh giá xem đồ án tốt nghiệp của sinh viên có đang tiếp cận những công nghệ, kỹ thuật mới nhất hay không."
    },
    {
      icon: <Binary size={20} className="text-zinc-650 dark:text-zinc-400" />,
      name: "Độ phù hợp ngữ nghĩa (Relevance)",
      desc: "Sử dụng mô hình ngôn ngữ Sentence-Transformers để nhúng (embedding) và so khớp tương đồng ngữ nghĩa Vector giữa nội dung trích dẫn và chủ đề chính của đồ án.",
      detail: "Đảm bảo sinh viên trích dẫn đúng tài liệu liên quan đến đề tài nghiên cứu, tránh việc nhồi nhét tài liệu tham khảo không liên quan."
    },
    {
      icon: <FileText size={20} className="text-zinc-650 dark:text-zinc-400" />,
      name: "Chuẩn định dạng (Formatting)",
      desc: "Kiểm tra cú pháp viết danh mục tài liệu tham khảo theo đúng chuẩn quy chuẩn học thuật quốc tế yêu cầu (như APA hoặc IEEE).",
      detail: "Phát hiện lỗi sai dấu câu, sai thứ tự tác giả, thiếu tên tạp chí, hoặc thiếu liên kết truy cập."
    }
  ];

  return (
    <div className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
    }`}>
      {/* CÁC ĐỐM SÁNG NỀN TRÔI NỔI */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-3xl opacity-20 transition-colors duration-1000 animate-drift-1 ${
          theme === 'dark' ? 'bg-indigo-500/50' : 'bg-blue-300/30'
        }`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-3xl opacity-20 transition-colors duration-1000 animate-drift-2 ${
          theme === 'dark' ? 'bg-purple-600/40' : 'bg-indigo-200/40'
        }`}></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Title */}
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center space-y-3">
            <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>
              Ma trận C1-C7 tính toán <span className="underline decoration-1 underline-offset-4 decoration-indigo-500/50">Trust Score</span>
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto font-medium transition-colors ${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              Điểm số Trust Score đại diện cho mức độ hỗ trợ thẩm định tài liệu, được tính toán dựa trên thuật toán tích hợp 7 cấu phần độc lập.
            </p>
          </div>
        </ScrollReveal>

        {/* List of Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {criteriaList.map((crit, index) => (
            <ScrollReveal 
              key={index}
              delay={index * 120}
              direction="up"
              duration={600}
            >
              <div 
                className={`p-6 rounded-xl border flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${
                  theme === 'dark' 
                    ? 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/55' 
                    : 'bg-white border-zinc-150 hover:border-zinc-300 hover:bg-zinc-50/50 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className={`p-2.5 rounded-lg w-fit border ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-850' : 'bg-zinc-100 border-zinc-200'
                  }`}>
                    {crit.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className={`text-sm font-bold transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-zinc-900'
                    }`}>{crit.name}</h3>
                    <p className={`text-xs leading-relaxed font-medium transition-colors ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>{crit.desc}</p>
                  </div>
                </div>
                <div className={`border-t mt-5 pt-3 text-[11px] leading-relaxed transition-colors ${
                  theme === 'dark' ? 'border-zinc-850 text-zinc-500' : 'border-zinc-100 text-zinc-400 font-medium'
                }`}>
                  {crit.detail}
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* Under the hood Tech Stack Card */}
          <ScrollReveal 
            delay={criteriaList.length * 120}
            direction="up"
            duration={600}
            className="md:col-span-2 lg:col-span-1"
          >
            <div className={`p-6 rounded-xl border flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-zinc-900/10 border-zinc-900 hover:border-zinc-800' 
                : 'bg-zinc-100/30 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/20 shadow-sm'
            }`}>
              <div className="space-y-4">
                <div className={`p-2.5 rounded-lg w-fit border ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-850' : 'bg-zinc-100 border-zinc-200'
                }`}>
                  <BarChart3 size={20} className="text-zinc-650 dark:text-zinc-400" />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Công nghệ tích hợp</h3>
                  <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Hệ thống sử dụng nền tảng trí tuệ nhân tạo nâng cao kết hợp các công cụ chuyên ngành.
                  </p>
                  <div className="space-y-2 pt-1">
                    {[
                      "Bóc tách tài liệu học thuật bằng GROBID",
                      "So khớp tương đồng ngữ nghĩa Vector NLP",
                      "Đối sánh thực thể CrossRef, OpenAlex"
                    ].map((tech, tIdx) => (
                      <div key={tIdx} className={`flex items-center gap-1.5 text-xs font-semibold ${
                        theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
                      }`}>
                        <Check size={12} className="text-zinc-500" /> {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-zinc-400 pt-5">
                MTEC Lab &bull; Công nghệ thẩm định 2026
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

