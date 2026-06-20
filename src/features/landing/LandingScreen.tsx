import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import NumberTicker from '../../components/NumberTicker';

export default function LandingScreen() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  // State kiểm soát hoạt cảnh mount ban đầu của Hero Section
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`w-full transition-colors duration-500 overflow-hidden relative ${
      theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
    }`}>
      {/* CÁC ĐỐM SÁNG NỀN TRÔI NỔI SINH ĐỘNG (AMBIENT GLOW BLOBS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-3xl opacity-25 dark:opacity-20 transition-colors duration-1000 animate-drift-1 ${
          theme === 'dark' ? 'bg-indigo-500/60' : 'bg-blue-300/40'
        }`}></div>
        <div className={`absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-3xl opacity-25 dark:opacity-15 transition-colors duration-1000 animate-drift-2 ${
          theme === 'dark' ? 'bg-purple-600/50' : 'bg-indigo-200/50'
        }`}></div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-20 text-center space-y-6">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-[10px] tracking-widest uppercase border transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        } ${
          theme === 'dark' 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-400' 
            : 'bg-white border-zinc-200 text-zinc-500'
        }`}>
          <Sparkles size={11} className="text-zinc-500" /> Phiên bản Học thuật TrustLens v1.5
        </div>

        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight transition-all duration-700 delay-150 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${
          theme === 'dark' ? 'text-white' : 'text-zinc-900'
        }`}>
          Thẩm định sự hội tụ học thuật của{' '}
          <span className="underline decoration-1 underline-offset-4 decoration-indigo-500/50">
            Tài liệu tham khảo
          </span>
        </h2>

        <p className={`font-normal text-sm sm:text-base max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${
          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Nền tảng tự động trích xuất, đối chiếu chéo metadata với cơ sở dữ liệu quốc tế để tính toán mức độ tin cậy và sự phù hợp của danh mục trích dẫn trong báo cáo khoa học.
        </p>

        <div className={`flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 transition-all duration-700 delay-450 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={() => navigate(token ? '/dashboard' : '/login')}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 font-bold px-6 py-3 rounded-lg transition-all duration-200 text-xs shadow-sm hover:shadow active:scale-98 ${
              theme === 'dark'
                ? 'bg-white hover:bg-zinc-100 text-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
          >
            Bắt đầu thẩm định <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => navigate('/features')}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 border font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-xs hover:shadow-sm active:scale-98 ${
              theme === 'dark' 
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300' 
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            Tìm hiểu chi tiết
          </button>
        </div>

        {/* SIMULATED PLATFORM PREVIEW */}
        <div className={`pt-12 relative max-w-3xl mx-auto transition-all duration-1000 delay-600 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className={`border rounded-xl p-5 shadow-md overflow-hidden transition-all duration-500 animate-float hover:scale-[1.01] hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-700 ${
            theme === 'dark' 
              ? 'bg-zinc-900/40 border-zinc-850 shadow-indigo-950/20' 
              : 'bg-white border-zinc-200 shadow-zinc-200'
          }`}>
            {/* Window bar */}
            <div className={`flex justify-between items-center border-b pb-3 mb-5 ${
              theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'
            }`}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              </div>
              <span className="text-[10px] text-zinc-450 font-mono">dashboard_preview.tsx</span>
              <div className="w-6"></div>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className={`p-4 rounded-lg border transition-colors hover:border-zinc-400 dark:hover:border-zinc-700 ${
                theme === 'dark' ? 'bg-zinc-950/60 border-zinc-850' : 'bg-zinc-50 border-zinc-150'
              }`}>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Trust Score trung bình</span>
                <div className={`text-xl font-bold mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                  78.5 <span className="text-xs text-zinc-400 font-normal">/ 100</span>
                </div>
                <div className={`h-1 rounded-full mt-3 overflow-hidden ${theme === 'dark' ? 'bg-zinc-850' : 'bg-zinc-200'}`}>
                  <div className="bg-zinc-800 dark:bg-white h-1 w-[78%] transition-all duration-1000 delay-1000"></div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border transition-colors hover:border-zinc-400 dark:hover:border-zinc-700 ${
                theme === 'dark' ? 'bg-zinc-950/60 border-zinc-850' : 'bg-zinc-50 border-zinc-150'
              }`}>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Tài liệu đã quét</span>
                <div className={`text-xl font-bold mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>1,402 bài</div>
                <span className="text-[9px] text-zinc-500 font-semibold block mt-3">↑ 12% so với tháng trước</span>
              </div>

              <div className={`p-4 rounded-lg border transition-colors hover:border-zinc-400 dark:hover:border-zinc-700 ${
                theme === 'dark' ? 'bg-zinc-950/60 border-zinc-850' : 'bg-zinc-50 border-zinc-150'
              }`}>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Độ phủ API đối chiếu</span>
                <div className={`text-xl font-bold mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>100% sạch</div>
                <span className={`text-[9px] font-semibold block mt-3 ${theme === 'dark' ? 'text-zinc-450' : 'text-zinc-500'}`}>
                  CrossRef, OpenAlex, Semantic
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE STATISTICS */}
      <section className={`relative z-10 border-y py-12 px-6 transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-zinc-900/10 border-zinc-900' 
          : 'bg-zinc-100/30 border-zinc-200'
      }`}>
        <ScrollReveal duration={800} direction="none">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <h3 className={`text-2xl sm:text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <NumberTicker value={0.5} decimals={1} suffix="s" />
              </h3>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Thời gian trích xuất</p>
            </div>
            <div className="space-y-1">
              <h3 className={`text-2xl sm:text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <NumberTicker value={120} suffix="M+" />
              </h3>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Metadata đối chiếu</p>
            </div>
            <div className="space-y-1">
              <h3 className={`text-2xl sm:text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <NumberTicker value={5} suffix=" tiêu chí" />
              </h3>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Ma trận đánh giá</p>
            </div>
            <div className="space-y-1">
              <h3 className={`text-2xl sm:text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <NumberTicker value={100} suffix="%" />
              </h3>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Tự động hóa</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-12">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center space-y-3">
            <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              Quy trình thẩm định trực quan
            </h3>
            <p className={`text-xs max-w-sm mx-auto font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Hệ thống hóa quy trình thẩm định phức tạp thành các bước thao tác nhanh chóng và chính xác.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Tải lên bài báo cáo",
              desc: "Kéo thả tập tin PDF/DOCX đồ án tốt nghiệp cần thẩm định vào hệ thống."
            },
            {
              step: "02",
              title: "Trích xuất danh mục",
              desc: "Sử dụng mô hình GROBID để bóc tách tự động danh sách tài liệu tham khảo thô."
            },
            {
              step: "03",
              title: "Đối chiếu API",
              desc: "Kết nối trực tiếp hệ thống CrossRef, Semantic Scholar, OpenAlex đối sánh DOI."
            },
            {
              step: "04",
              title: "Xuất báo cáo",
              desc: "Tính toán Trust Score dựa trên 5 tiêu chuẩn vàng và xuất báo cáo kết luận."
            }
          ].map((item, idx) => (
            <ScrollReveal 
              key={idx}
              delay={idx * 150}
              direction="up"
              duration={600}
            >
              <div 
                className={`p-5 rounded-lg border transition-all duration-300 space-y-4 h-full hover:-translate-y-1.5 hover:shadow-md ${
                  theme === 'dark' 
                    ? 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/50' 
                    : 'bg-white border-zinc-150 hover:border-zinc-300 hover:bg-zinc-50/55 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-zinc-950 border-zinc-850 text-zinc-300 group-hover:text-white' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                }`}>
                  {item.step}
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{item.title}</h4>
                <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION (CTA) */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <ScrollReveal direction="up" duration={800}>
          <div className={`border rounded-xl p-8 md:p-10 text-center space-y-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
            theme === 'dark' 
              ? 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-800' 
              : 'bg-white border-zinc-150 hover:border-zinc-250 shadow-sm'
          }`}>
            <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              Nâng tầm tính chính trực trong học thuật
            </h3>
            <p className={`text-xs max-w-sm mx-auto leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Giúp giảng viên tối ưu thời gian chấm điểm và sinh viên tự rà soát tài liệu trích dẫn khoa học nhanh chóng.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className={`font-semibold px-5 py-2.5 rounded-lg text-xs inline-flex items-center gap-1 transition-all duration-200 active:scale-98 ${
                  theme === 'dark' 
                    ? 'bg-white hover:bg-zinc-100 text-black shadow-sm shadow-white/5' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm'
                }`}
              >
                Đăng nhập hệ thống <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
