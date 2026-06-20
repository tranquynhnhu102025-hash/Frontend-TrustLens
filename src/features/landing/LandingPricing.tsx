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
      buttonText: "Đăng nhập",
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
      buttonText: "Liên hệ ngay",
      popular: false,
      link: "/contact"
    }
  ];

  return (
    <div className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-200 ${
      theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
    }`}>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            Hạn mức sử dụng & Gói giải pháp
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto font-medium transition-colors ${
            theme === 'dark' ? 'text-zinc-450' : 'text-zinc-500'
          }`}>
            Chọn gói giải pháp phù hợp với vai trò của bạn trong hệ sinh thái học thuật TrustLens.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`rounded-xl border p-6 flex flex-col justify-between relative transition-colors duration-150 ${
                tier.popular 
                  ? (theme === 'dark' 
                      ? 'border-white bg-white text-black' 
                      : 'border-zinc-900 bg-zinc-900 text-white') 
                  : (theme === 'dark' 
                      ? 'border-zinc-900 bg-zinc-900/30 text-zinc-105' 
                      : 'border-zinc-200 bg-white shadow-sm')
              }`}
            >
              {tier.popular && (
                <span className={`absolute -top-3 left-6 font-bold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded border ${
                  theme === 'dark' ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-900'
                }`}>
                  Phổ biến
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${
                    tier.popular 
                      ? (theme === 'dark' ? 'text-black' : 'text-white')
                      : (theme === 'dark' ? 'text-white' : 'text-zinc-900')
                  }`}>{tier.name}</h3>
                  <p className={`text-xs mt-2 font-medium min-h-[40px] ${
                    tier.popular
                      ? (theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400')
                      : (theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500')
                  }`}>{tier.desc}</p>
                </div>

                <div className={`flex items-baseline gap-1 border-y py-4 ${
                  tier.popular
                    ? (theme === 'dark' ? 'border-zinc-200' : 'border-zinc-800')
                    : (theme === 'dark' ? 'border-zinc-900' : 'border-zinc-100')
                }`}>
                  <span className="text-3xl font-extrabold">{tier.price}</span>
                  {tier.price === "0đ" && <span className="text-[10px] font-semibold text-zinc-500">/ vĩnh viễn</span>}
                  {tier.price === "Nội bộ" && <span className={`text-[10px] font-semibold ${tier.popular ? (theme === 'dark' ? 'text-zinc-650' : 'text-zinc-350') : 'text-zinc-505'}`}>/ trường cấp</span>}
                </div>

                {/* Features List */}
                <ul className="space-y-2.5">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs font-semibold">
                      <Check size={13} className={`shrink-0 mt-0.5 ${
                        tier.popular
                          ? (theme === 'dark' ? 'text-black' : 'text-white')
                          : 'text-zinc-400'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(tier.link)}
                className={`w-full font-bold text-xs py-2.5 rounded-lg mt-6 transition-colors duration-150 ${
                  tier.popular
                    ? (theme === 'dark' 
                        ? 'bg-black hover:bg-zinc-900 text-white' 
                        : 'bg-white hover:bg-zinc-100 text-black')
                    : (theme === 'dark' 
                        ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800' 
                        : 'bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200')
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
