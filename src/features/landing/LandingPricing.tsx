import { Check } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function LandingPricing() {
  const navigate = useNavigate();
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const tiers = [
    {
      name: "Sinh viên",
      price: "0đ",
      desc: "Phục vụ nhu cầu tự kiểm tra danh mục tài liệu tham khảo trước khi nộp bài đồ án học phần.",
      features: [
        "Quét tối đa 3 tài liệu / ngày",
        "Giới hạn báo cáo dưới 15 trang",
        "Trích xuất trích dẫn cơ bản",
        "Kiểm tra định dạng APA / IEEE",
        "Xem báo cáo trực tuyến"
      ],
      buttonText: "Bắt đầu miễn phí",
      popular: false,
      link: "/login"
    },
    {
      name: "Giảng viên",
      price: "Nội bộ",
      desc: "Dành riêng cho giảng viên hướng dẫn của các trường đối tác (HUCE, NTTU).",
      features: [
        "Quét không giới hạn số lượng",
        "Không giới hạn số trang tài liệu",
        "Quản lý danh sách lớp hướng dẫn",
        "Đối chiếu dữ liệu CrossRef/Semantic",
        "Xuất báo cáo chi tiết (.PDF, .DOCX)",
        "Ưu tiên xử lý băng thông cao"
      ],
      buttonText: "Đăng nhập tài khoản trường",
      popular: true,
      link: "/login"
    },
    {
      name: "Nhà trường",
      price: "Liên hệ",
      desc: "Tích hợp toàn diện vào cổng thông tin đào tạo của trường đại học hoặc viện nghiên cứu.",
      features: [
        "Cấp quyền cho toàn bộ GV & SV",
        "Thống kê chỉ số trích dẫn toàn khóa",
        "Tích hợp hệ thống LMS (Moodle...)",
        "API kết nối kiểm duyệt tự động",
        "Tùy chỉnh ngưỡng chấm điểm",
        "Hỗ trợ kỹ thuật 24/7"
      ],
      buttonText: "Liên hệ Phòng Đào tạo",
      popular: false,
      link: "/contact"
    }
  ];

  return (
    <div className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      {/* Background glow */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-500/3'
      }`}></div>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center space-y-4">
          <h2 className={`text-3xl sm:text-5xl font-black tracking-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Hạn mức sử dụng & Gói giải pháp
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto font-medium transition-colors ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
          }`}>
            Chọn gói giải pháp phù hợp với vai trò của bạn trong hệ sinh thái học thuật TrustLens.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`rounded-[32px] border p-8 flex flex-col justify-between relative transition-all duration-300 ${
                tier.popular 
                  ? (theme === 'dark' 
                      ? 'border-blue-500/40 shadow-xl shadow-blue-500/5 bg-slate-900/60 scale-105 z-10' 
                      : 'border-blue-500 shadow-xl shadow-blue-500/10 bg-white scale-105 z-10') 
                  : (theme === 'dark' 
                      ? 'border-slate-900 hover:border-slate-800 bg-slate-900/40' 
                      : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm shadow-slate-100')
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  Phổ biến nhất
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
                  <p className={`text-xs mt-2 font-medium min-h-[40px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{tier.desc}</p>
                </div>

                <div className={`flex items-baseline gap-1.5 border-y py-4 ${
                  theme === 'dark' ? 'border-slate-850/60 text-white' : 'border-slate-100 text-slate-900'
                }`}>
                  <span className="text-4xl font-black">{tier.price}</span>
                  {tier.price === "0đ" && <span className="text-xs text-slate-500 font-bold">/ vĩnh viễn</span>}
                  {tier.price === "Nội bộ" && <span className="text-xs text-blue-550 font-bold">/ trường cấp</span>}
                </div>

                {/* Features List */}
                <ul className="space-y-3">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className={`flex items-start gap-2.5 text-xs font-bold ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-755'
                    }`}>
                      <Check size={14} className="text-blue-505 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(tier.link)}
                className={`w-full font-bold text-xs py-3.5 rounded-xl mt-8 transition-all duration-300 active:scale-95 ${
                  tier.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : (theme === 'dark' 
                        ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800' 
                        : 'bg-slate-150 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-inner')
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
