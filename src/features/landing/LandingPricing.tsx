import { useNavigate, useOutletContext } from 'react-router-dom';
import { AlertCircle, CheckCircle2, LockKeyhole, ShieldAlert, TestTube2 } from 'lucide-react';

export default function LandingPricing() {
  const navigate = useNavigate();
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const pilotFacts = [
    {
      icon: <LockKeyhole size={18} />,
      title: 'Tài khoản do admin cấp',
      desc: 'Public registration chưa được mở cho triển khai rộng vì còn là release blocker trong baseline v1.2.',
    },
    {
      icon: <TestTube2 size={18} />,
      title: 'Phù hợp demo và pilot',
      desc: 'Mục tiêu là kiểm thử luồng lecturer: class, assignment, upload, analyze, report và export.',
    },
    {
      icon: <ShieldAlert size={18} />,
      title: 'Chưa phải dịch vụ thương mại',
      desc: 'Chưa công bố gói giá, SLA sản xuất, tự phục vụ cho sinh viên hoặc tích hợp nền tảng bên ngoài.',
    },
  ];

  const readiness = [
    { label: 'Luồng upload và phân tích PDF/DOCX', status: 'Đã có runtime path' },
    { label: 'Trust Score v1.2 C1-C7', status: 'Đã triển khai, cần thêm benchmark' },
    { label: 'Report và export PDF/DOCX/XLSX', status: 'Đã triển khai, cần restore evidence' },
    { label: 'PostgreSQL integration suite', status: 'Release gate chưa hoàn tất' },
    { label: 'Browser E2E cho luồng lecturer', status: 'Release gate chưa hoàn tất' },
    { label: 'Academic calibration package', status: 'Đang nằm trong kế hoạch' },
  ];

  return (
    <div
      className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2
            className={`text-2xl sm:text-4xl font-bold tracking-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}
          >
            Trạng thái pilot
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-2xl mx-auto font-medium transition-colors ${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            TrustLens hiện được mô tả như một baseline kiểm thử có kiểm soát. Trang này thay thế bảng giá
            để tránh hiểu nhầm rằng hệ thống đã sẵn sàng bán hoặc mở dùng đại trà.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pilotFacts.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border p-6 transition-colors duration-150 ${
                theme === 'dark' ? 'border-zinc-900 bg-zinc-900/30 text-zinc-100' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-5 ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                }`}
              >
                {item.icon}
              </div>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                {item.title}
              </h3>
              <p className={`text-xs mt-3 leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`rounded-xl border p-6 md:p-8 transition-colors duration-150 ${
            theme === 'dark' ? 'bg-zinc-900/20 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2 max-w-sm">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                Release readiness snapshot
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Các mục bên dưới phản ánh trạng thái v1.2 hiện tại: có luồng chính, nhưng vẫn cần bằng chứng nghiệm thu
                trước khi ký duyệt phát hành rộng.
              </p>
            </div>
            <button
              onClick={() => navigate('/docs')}
              className={`w-full md:w-auto font-bold text-xs px-4 py-2.5 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-white hover:bg-zinc-100 text-black' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
              }`}
            >
              Xem FAQ pilot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
            {readiness.map((item) => (
              <div
                key={item.label}
                className={`border rounded-lg p-4 flex items-start gap-3 ${
                  theme === 'dark' ? 'border-zinc-850 bg-zinc-950/40' : 'border-zinc-100 bg-zinc-50'
                }`}
              >
                <CheckCircle2 size={15} className="text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <div className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.label}</div>
                  <div className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 flex gap-3 ${
            theme === 'dark' ? 'bg-zinc-900/20 border-zinc-900 text-zinc-400' : 'bg-zinc-100/50 border-zinc-200 text-zinc-600'
          }`}
        >
          <AlertCircle size={18} className="text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            Public registration, production security hardening, restore drill, accessibility audit và academic calibration
            cần hoàn tất hoặc có accepted-risk record trước khi public pages được nâng cấp sang thông điệp phát hành rộng.
          </p>
        </div>
      </div>
    </div>
  );
}
