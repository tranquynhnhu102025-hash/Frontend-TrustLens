import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  FileText, ArrowRight, Sparkles, ChevronRight, AlertCircle 
} from 'lucide-react';

export default function LandingScreen() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  return (
    <div className={`w-full transition-colors duration-300 overflow-hidden relative ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      {/* GLOW EFFECT BACKGROUNDS */}
      <div className={`absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'
      }`}></div>
      <div className={`absolute top-80 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/5'
      }`}></div>

      {/* 1. HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center space-y-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs tracking-wide animate-pulse border transition-colors ${
          theme === 'dark' 
            ? 'bg-slate-900 border-slate-850 text-blue-400' 
            : 'bg-blue-50 border-blue-100 text-blue-600'
        }`}>
          <Sparkles size={12} /> Phiên bản Học thuật TrustLens v1.5
        </div>

        <h2 className={`text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] transition-colors ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Thẩm định sự hội tụ học thuật của{' '}
          <span className="bg-gradient-to-r from-blue-550 via-indigo-550 to-purple-550 bg-clip-text text-transparent">
            Tài liệu tham khảo
          </span>
        </h2>

        <p className={`font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-colors ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Nền tảng tự động trích xuất, đối chiếu chéo metadata với cơ sở dữ liệu quốc tế để tính toán mức độ tin cậy và sự phù hợp của danh mục trích dẫn trong báo cáo khoa học.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button
            onClick={() => navigate(token ? '/dashboard' : '/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group"
          >
            Bắt đầu thẩm định ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/features')}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 border font-bold px-8 py-4 rounded-2xl transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            Tìm hiểu chi tiết
          </button>
        </div>

        {/* SIMULATED PLATFORM PREVIEW */}
        <div className="pt-12 relative max-w-4xl mx-auto group">
          <div className={`absolute inset-0 rounded-[32px] blur-2xl opacity-50 group-hover:opacity-75 transition-all duration-500 ${
            theme === 'dark' ? 'bg-gradient-to-b from-blue-500/20 to-transparent' : 'bg-gradient-to-b from-blue-500/5 to-transparent'
          }`}></div>
          <div className={`relative border rounded-3xl p-6 shadow-2xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-slate-900/50 backdrop-blur-xl border-slate-800' 
              : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            {/* Window bar */}
            <div className={`flex justify-between items-center border-b pb-4 mb-6 ${
              theme === 'dark' ? 'border-slate-800/80' : 'border-slate-105'
            }`}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-xs text-slate-500 font-mono">trustlens-dashboard-mockup.tsx</span>
              <div className="w-8"></div>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className={`p-4 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-slate-950/60 border-slate-800/65' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Trust Score trung bình</span>
                <div className={`text-2xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  78.5 <span className="text-xs text-amber-500 font-medium">/ 100</span>
                </div>
                <div className={`h-1.5 rounded-full mt-3 overflow-hidden ${theme === 'dark' ? 'bg-slate-850' : 'bg-slate-200'}`}>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 w-[78%]"></div>
                </div>
              </div>
              <div className={`p-4 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-slate-950/60 border-slate-800/65' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tài liệu đã quét</span>
                <div className={`text-2xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1,402 bài</div>
                <span className="text-[10px] text-green-500 font-bold block mt-3">↑ 12% so với tháng trước</span>
              </div>
              <div className={`p-4 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-slate-950/60 border-slate-800/65' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Độ phủ API đối chiếu</span>
                <div className={`text-2xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>100% sạch</div>
                <span className={`text-[10px] font-bold block mt-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  CrossRef, OpenAlex, Semantic
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE STATISTICS */}
      <section className={`border-y py-16 px-6 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/20 border-slate-900/60' 
          : 'bg-slate-100/50 border-slate-200/60'
      }`}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className={`text-3xl sm:text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>0.5s</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Thời gian trích xuất</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-blue-500">120M+</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Metadata đối chiếu</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-indigo-500">5 tiêu chí</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ma trận đánh giá</p>
          </div>
          <div className="space-y-1">
            <h3 className={`text-3xl sm:text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>100%</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tự động hóa</p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h3 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Quy trình thẩm định 4 bước trực quan
          </h3>
          <p className={`text-sm max-w-md mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Hệ thống hóa quy trình thẩm định phức tạp thành các bước thao tác nhanh chóng và chính xác.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            {
              step: "01",
              title: "Tải lên bài báo cáo",
              desc: "Kéo thả tập tin PDF/DOCX đồ án tốt nghiệp cần thẩm định vào hệ thống.",
              color: "bg-blue-600/10 border-blue-500/20 text-blue-500"
            },
            {
              step: "02",
              title: "Trích xuất danh mục",
              desc: "Sử dụng mô hình GROBID để bóc tách tự động danh sách tài liệu tham khảo thô.",
              color: "bg-indigo-600/10 border-indigo-500/20 text-indigo-500"
            },
            {
              step: "03",
              title: "Đối chiếu API Quốc tế",
              desc: "Kết nối trực tiếp hệ thống CrossRef, Semantic Scholar, OpenAlex đối sánh DOI.",
              color: "bg-purple-600/10 border-purple-500/20 text-purple-500"
            },
            {
              step: "04",
              title: "Xuất báo cáo & Điểm số",
              desc: "Tính toán Trust Score dựa trên 5 tiêu chuẩn vàng và xuất báo cáo kết luận.",
              color: "bg-emerald-600/10 border-emerald-500/20 text-emerald-500"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-3xl border transition-all duration-300 relative space-y-4 ${
                theme === 'dark' 
                  ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' 
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-black text-sm ${item.color}`}>
                {item.step}
              </div>
              <h4 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
              <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION (CTA) */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className={`border rounded-[32px] p-8 md:p-12 text-center space-y-6 relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/10' 
            : 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-blue-200 shadow-md shadow-slate-100'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[96px]"></div>
          <h3 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Nâng tầm tính chính trực trong học thuật
          </h3>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Giúp giảng viên tối ưu thời gian chấm điểm và sinh viên tự rà soát tài liệu trích dẫn khoa học nhanh chóng.
          </p>
          <button
            onClick={() => navigate('/login')}
            className={`font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-sm inline-flex items-center gap-1.5 ${
              theme === 'dark' 
                ? 'bg-white hover:bg-slate-100 text-slate-950 shadow-white/5' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-950/20'
            }`}
          >
            Đăng nhập hệ thống ngay <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
