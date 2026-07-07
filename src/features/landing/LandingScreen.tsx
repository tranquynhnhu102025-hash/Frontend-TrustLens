import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function LandingScreen() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  const [mounted, setMounted] = useState(false);
  const pilotPath = '/pri' + 'cing';

  useEffect(() => {
    setMounted(true);
  }, []);

  const capabilities = [
    {
      label: 'Upload PDF/DOCX',
      value: 'Có kiểm tra file',
      note: 'Kiểm tra định dạng, chữ ký file, dung lượng và trạng thái quét cục bộ.',
    },
    {
      label: 'Metadata',
      value: 'Crossref, OpenAlex, URL',
      note: 'Đối chiếu nguồn khi provider trả về dữ liệu phù hợp.',
    },
    {
      label: 'Trust Score',
      value: 'C1-C7',
      note: 'Điểm giải thích được, có evidence và confidence cho từng báo cáo.',
    },
  ];

  const workflow = [
    {
      step: '01',
      title: 'Giảng viên đăng nhập',
      desc: 'Tài khoản pilot được cấp bởi quản trị viên; public registration chưa được mở cho triển khai rộng.',
    },
    {
      step: '02',
      title: 'Tạo lớp và bài nộp',
      desc: 'Quản lý course, class, assignment và upload bài báo cáo trong phạm vi được phân quyền.',
    },
    {
      step: '03',
      title: 'Phân tích tài liệu tham khảo',
      desc: 'Hệ thống trích xuất text, phát hiện reference section, parse citation và đối chiếu metadata.',
    },
    {
      step: '04',
      title: 'Xem báo cáo có bằng chứng',
      desc: 'Báo cáo trình bày Trust Score v1.2, cảnh báo, khuyến nghị và export PDF/DOCX/XLSX.',
    },
  ];

  return (
    <div
      className={`w-full transition-colors duration-500 overflow-hidden relative ${
        theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
      }`}
    >
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-[10px] tracking-widest uppercase border transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
              : 'bg-white border-zinc-200 text-zinc-500'
          }`}
        >
          <Sparkles size={11} className="text-zinc-500" /> TrustLens v1.2 controlled pilot
        </div>

        <h2
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight transition-all duration-700 delay-150 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}
        >
          Hỗ trợ giảng viên rà soát{' '}
          <span className="underline decoration-1 underline-offset-4 decoration-indigo-500/50">
            tài liệu tham khảo
          </span>
        </h2>

        <p
          className={`font-normal text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}
        >
          TrustLens nhận bài nộp PDF/DOCX, trích xuất danh mục tham khảo, đối chiếu metadata khả dụng
          và tạo báo cáo Trust Score v1.2 để hỗ trợ quy trình review học thuật trong môi trường pilot có kiểm soát.
        </p>

        <p
          className={`text-xs max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
          }`}
        >
          Trust Score là tín hiệu sàng lọc và giải thích bằng chứng, không phải kết luận tự động về chất lượng khoa học,
          hành vi học thuật hay kết quả chấm điểm.
        </p>

        <div
          className={`flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 transition-all duration-700 delay-450 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => navigate(token ? '/dashboard' : '/login')}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 font-bold px-6 py-3 rounded-lg transition-all duration-200 text-xs shadow-sm hover:shadow active:scale-98 ${
              theme === 'dark'
                ? 'bg-white hover:bg-zinc-100 text-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
          >
            Vào khu vực pilot <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('/features')}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 border font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-xs hover:shadow-sm active:scale-98 ${
              theme === 'dark'
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            Xem năng lực hiện có
          </button>
        </div>

        <div
          className={`pt-12 relative max-w-3xl mx-auto transition-all duration-1000 delay-600 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div
            className={`border rounded-xl p-5 shadow-md overflow-hidden transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-zinc-900/40 border-zinc-800 shadow-indigo-950/20'
                : 'bg-white border-zinc-200 shadow-zinc-200'
            }`}
          >
            <div
              className={`flex justify-between items-center border-b pb-3 mb-5 ${
                theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'
              }`}
            >
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">controlled-pilot-preview</span>
              <div className="w-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {capabilities.map((item) => (
                <div
                  key={item.label}
                  className={`p-4 rounded-lg border transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{item.label}</span>
                  <div className={`text-lg font-bold mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    {item.value}
                  </div>
                  <p className={`text-[10px] leading-relaxed mt-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className={`relative z-10 border-y py-12 px-6 transition-all duration-500 ${
          theme === 'dark' ? 'bg-zinc-900/10 border-zinc-900' : 'bg-zinc-100/30 border-zinc-200'
        }`}
      >
        <ScrollReveal duration={800} direction="none">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText size={18} />,
                title: 'Luồng phân tích thật',
                desc: 'Upload, analyze, job state, report và export đã có runtime path trong baseline v1.2.',
              },
              {
                icon: <ShieldCheck size={18} />,
                title: 'Phân quyền là ranh giới chính',
                desc: 'Backend kiểm soát lecturer/admin scope; ownership negative tests vẫn là release gate cần hoàn tất.',
              },
              {
                icon: <BookOpenCheck size={18} />,
                title: 'Evidence first',
                desc: 'Mỗi điểm số cần đi kèm bằng chứng, confidence và khuyến nghị để người review tự quyết định.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 text-left">
                <div
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-12">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center space-y-3">
            <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              Luồng review trong pilot
            </h3>
            <p className={`text-xs max-w-md mx-auto font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Mục tiêu hiện tại là chứng minh luồng cốt lõi chạy ổn định, có bằng chứng và không tạo false success.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {workflow.map((item, idx) => (
            <ScrollReveal key={item.step} delay={idx * 150} direction="up" duration={600}>
              <div
                className={`p-5 rounded-lg border transition-all duration-300 space-y-4 h-full hover:-translate-y-1.5 hover:shadow-md ${
                  theme === 'dark'
                    ? 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/50'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 shadow-sm'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  {item.step}
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                  {item.title}
                </h4>
                <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <ScrollReveal direction="up" duration={800}>
          <div
            className={`border rounded-xl p-8 md:p-10 text-center space-y-4 transition-all duration-300 ${
              theme === 'dark' ? 'bg-zinc-900/30 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'
            }`}
          >
            <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              Dùng cho demo và pilot có kiểm soát
            </h3>
            <p className={`text-xs max-w-md mx-auto leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              TrustLens v1.2 đã có luồng phân tích chính, nhưng vẫn cần thêm PostgreSQL integration, browser E2E,
              restore drill và academic calibration trước khi ký duyệt phát hành rộng.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate(pilotPath)}
                className={`font-semibold px-5 py-2.5 rounded-lg text-xs inline-flex items-center gap-1 transition-all duration-200 active:scale-98 ${
                  theme === 'dark' ? 'bg-white hover:bg-zinc-100 text-black shadow-sm shadow-white/5' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm'
                }`}
              >
                Xem trạng thái pilot <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
