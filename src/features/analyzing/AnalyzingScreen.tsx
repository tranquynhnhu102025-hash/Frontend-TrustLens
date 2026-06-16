import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, FileSearch, Database, Activity, ShieldCheck } from 'lucide-react';

export default function AnalyzingScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Danh sách các bước xử lý (bám sát file Word của BE)
  const steps = [
    { id: 0, title: 'Queued', desc: 'Đã nhận file, đưa vào hàng đợi xử lý', icon: <Database size={24} /> },
    { id: 1, title: 'Extracting', desc: 'Trích xuất dữ liệu và tài liệu tham khảo (Citations)', icon: <FileSearch size={24} /> },
    { id: 2, title: 'Verifying', desc: 'Đối chiếu Metadata với cơ sở dữ liệu học thuật', icon: <Activity size={24} /> },
    { id: 3, title: 'Scoring', desc: 'Tính toán điểm tin cậy (Trust Score)', icon: <ShieldCheck size={24} /> },
    { id: 4, title: 'Completed', desc: 'Hoàn tất quá trình thẩm định', icon: <CheckCircle2 size={24} /> },
  ];

  // Mô phỏng API xử lý: Tự động nhảy bước sau mỗi 2.5 giây
  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2500); // Đổi 2500 thành thời gian chạy demo mong muốn
      return () => clearTimeout(timer);
    } else {
      // Khi đến bước cuối (Completed), tự động chuyển sang trang Report sau 1 giây
      const timer = setTimeout(() => {
        navigate('/report');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate, steps.length]);

  return (
    <div className="w-full max-w-4xl mx-auto my-10 flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-blue-100 text-blue-600 rounded-full mb-6 relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <Loader2 size={48} className="animate-spin" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">Đang thẩm định tài liệu</h2>
        <p className="text-slate-500 font-medium text-lg">Hệ thống AI TrustLens đang phân tích danh mục tài liệu tham khảo...</p>
      </div>

      {/* KHUNG HIỂN THỊ DÒNG THỜI GIAN (TIMELINE) */}
      <div className="w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="relative">
          {/* Đường kẻ dọc chạy xuyên suốt */}
          <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

          <div className="space-y-8 relative">
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isPast = currentStep > index;

              return (
                <div key={step.id} className={`flex items-start gap-6 transition-all duration-500 ${isActive || isPast ? 'opacity-100' : 'opacity-40'}`}>
                  
                  {/* Cột Icon Trạng Thái */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl shadow-sm transition-colors duration-500 shrink-0
                    ${isPast ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white animate-pulse shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {isPast ? <CheckCircle2 size={28} /> : step.icon}
                  </div>

                  {/* Cột Nội Dung */}
                  <div className="pt-2.5">
                    <h4 className={`text-xl font-black mb-1 transition-colors duration-500 
                      ${isPast ? 'text-slate-800' : isActive ? 'text-blue-600' : 'text-slate-500'}`}
                    >
                      {step.title}
                      {isActive && <span className="ml-3 inline-flex space-x-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>}
                    </h4>
                    <p className={`font-medium transition-colors duration-500 ${isPast || isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}