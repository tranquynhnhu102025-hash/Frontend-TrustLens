import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Loader2, CheckCircle2, FileSearch, Database, 
  Activity, ShieldCheck, AlertCircle, RefreshCw, ChevronLeft 
} from 'lucide-react';
import jobService, { JobError } from '../../services/jobService';

export default function AnalyzingScreen() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [status, setStatus] = useState<string>('queued');
  const [progress, setProgress] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState<string>('Đang kết nối hệ thống...');
  const [error, setError] = useState<JobError | null>(null);
  const [retrying, setRetrying] = useState<boolean>(false);

  // Danh sách các bước hiển thị trên UI
  const steps = [
    { id: 0, title: 'Queued', desc: 'Đã nhận file, đưa vào hàng đợi xử lý', icon: <Database size={24} /> },
    { id: 1, title: 'Extracting', desc: 'Trích xuất văn bản và tài liệu tham khảo', icon: <FileSearch size={24} /> },
    { id: 2, title: 'Verifying', desc: 'Đối chiếu Metadata với cơ sở dữ liệu học thuật', icon: <Activity size={24} /> },
    { id: 3, title: 'Scoring', desc: 'Tính toán điểm tin cậy (C1-C7)', icon: <ShieldCheck size={24} /> },
    { id: 4, title: 'Completed', desc: 'Hoàn tất quá trình thẩm định', icon: <CheckCircle2 size={24} /> },
  ];

  // Hàm nhóm trạng thái từ backend thành step tương ứng trên UI
  const getActiveStepIndex = (currentStatus: string): number => {
    const statusLower = currentStatus.toLowerCase();
    
    if (statusLower.startsWith('failed') || statusLower === 'cancelled') {
      return -1; // Trạng thái lỗi
    }
    
    switch (statusLower) {
      case 'completed':
        return 4;
      case 'scoring':
      case 'building_report':
        return 3;
      case 'normalizing':
      case 'verifying_metadata':
        return 2;
      case 'validating':
      case 'extracting':
      case 'detecting_references':
      case 'parsing_citations':
        return 1;
      case 'queued':
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (!jobId) return;

    let intervalId: NodeJS.Timeout;
    
    const checkJobStatus = async () => {
      try {
        const data = await jobService.getJobStatus(jobId);
        
        setStatus(data.status);
        setProgress(data.progress);
        
        // Cập nhật mô tả trạng thái chi tiết dựa trên backend current_step
        if (data.current_step) {
          const stepDescriptions: Record<string, string> = {
            'queued': 'Đang chờ điều phối tài nguyên...',
            'validating': 'Đang kiểm tra tính hợp lệ của tệp...',
            'extracting': 'Đang trích xuất nội dung văn bản...',
            'detecting_references': 'Đang xác định danh mục tài liệu tham khảo...',
            'parsing_citations': 'Đang phân tích cú pháp trích dẫn...',
            'normalizing': 'Đang chuẩn hóa thông tin các trường trích dẫn...',
            'verifying_metadata': 'Đang đối chiếu thông tin CrossRef / OpenAlex...',
            'scoring': 'Đang áp dụng bộ tiêu chí đánh giá C1-C7...',
            'building_report': 'Đang tổng hợp điểm và biên soạn báo cáo...',
            'completed': 'Hoàn tất báo cáo thành công!'
          };
          setCurrentStepText(stepDescriptions[data.current_step.toLowerCase()] || data.current_step);
        }

        // Nếu hoàn thành, dừng poll và chuyển hướng sang Report
        if (data.status.toLowerCase() === 'completed') {
          clearInterval(intervalId);
          setTimeout(() => {
            navigate(`/report/${data.report_id || data.submission_id}`);
          }, 1200);
        }

        // Nếu lỗi, dừng poll và hiển thị thông tin lỗi
        if (data.status.toLowerCase().startsWith('failed') || data.status.toLowerCase() === 'cancelled') {
          clearInterval(intervalId);
          setError(data.error || {
            error_code: data.error_code || 'JOB_FAILED',
            message: data.error_message || 'Quá trình thẩm định tài liệu thất bại không rõ nguyên nhân.'
          });
        }

      } catch (err: any) {
        console.error("Lỗi khi kết nối hoặc đọc trạng thái job:", err);
        // Nếu lỗi mạng tạm thời, ta không ngắt poll mà tiếp tục thử lại
      }
    };

    // Gọi lần đầu tiên
    checkJobStatus();
    
    // Thiết lập polling mỗi 2 giây
    intervalId = setInterval(checkJobStatus, 2000);

    return () => clearInterval(intervalId);
  }, [jobId, navigate]);

  const handleRetry = async () => {
    if (!jobId || retrying) return;
    
    setRetrying(true);
    setError(null);
    setStatus('queued');
    setProgress(0);
    setCurrentStepText('Đang khởi động lại tiến trình phân tích...');

    try {
      const res = await jobService.retryJob(jobId);
      setRetrying(false);
      navigate(`/analyzing/${res.job_id}`);
    } catch (err: any) {
      console.error("Lỗi khi retry job:", err);
      setRetrying(false);
      setError({
        error_code: err.response?.data?.error_code || 'RETRY_FAILED',
        message: err.response?.data?.message || 'Không thể gửi yêu cầu chạy lại phân tích.'
      });
    }
  };

  const activeStep = getActiveStepIndex(status);
  const isFailed = activeStep === -1;

  return (
    <div className="w-full max-w-4xl mx-auto my-10 flex flex-col items-center px-4">
      <div className="text-center mb-10">
        <div className={`inline-flex items-center justify-center p-4 rounded-full mb-5 relative ${isFailed ? 'bg-red-100 text-red-650' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white'}`}>
          {!isFailed && <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-ping opacity-25"></div>}
          {isFailed ? (
            <AlertCircle size={44} />
          ) : (
            <Loader2 size={44} className="animate-spin" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          {isFailed ? 'Kiểm duyệt thất bại' : 'Đang thẩm định tài liệu'}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold max-w-lg mx-auto">
          {isFailed 
            ? 'Đã xảy ra lỗi trong quá trình xử lý tài liệu.' 
            : 'Hệ thống AI TrustLens đang phân tích danh mục tài liệu tham khảo...'}
        </p>
      </div>

      {/* HIỂN THỊ CHI TIẾT LỖI NẾU CÓ */}
      {isFailed && error && (
        <div className="w-full bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-start justify-between gap-4 animate-fade-in">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-red-650 dark:text-red-400 font-bold text-sm">
              <AlertCircle size={16} /> Mã lỗi: <span className="font-mono bg-red-100 dark:bg-red-950/40 px-1.5 py-0.5 rounded text-xs">{error.error_code}</span>
            </div>
            <p className="text-xs font-semibold text-zinc-750 dark:text-zinc-300">{error.message}</p>
            {error.details && (
              <pre className="text-[10px] bg-white dark:bg-zinc-950 p-3 rounded-lg border border-red-100 dark:border-red-900/20 text-zinc-500 overflow-x-auto max-w-full font-mono mt-2">
                {JSON.stringify(error.details, null, 2)}
              </pre>
            )}
          </div>
          
          <div className="shrink-0 flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => navigate('/upload')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-colors"
            >
              <ChevronLeft size={13} /> Quay lại
            </button>
            
            {error.retryable !== false && (
              <button 
                onClick={handleRetry}
                disabled={retrying}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4.5 py-2 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw size={13} className={retrying ? 'animate-spin' : ''} /> Thử lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* KHUNG TIẾN TRÌNH CHI TIẾT (PROGESS BAR) */}
      {!isFailed && (
        <div className="w-full bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-sm mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1.5">
              <span className="truncate text-zinc-700 dark:text-zinc-300">{currentStepText}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="bg-zinc-900 dark:bg-white h-2 transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE TRẠNG THÁI */}
      <div className="w-full bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-900">
        <div className="relative">
          {/* Đường kẻ dọc */}
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-900"></div>

          <div className="space-y-6 relative">
            {steps.map((step, index) => {
              const isActive = !isFailed && activeStep === index;
              const isPast = !isFailed && activeStep > index;

              return (
                <div 
                  key={step.id} 
                  className={`flex items-start gap-4 transition-all duration-500 ${isActive || isPast ? 'opacity-100' : 'opacity-40'}`}
                >
                  
                  {/* Icon tròn trạng thái */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-xl shadow-sm transition-colors duration-500 shrink-0 border
                    ${isPast 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-black animate-pulse shadow-md' 
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'}`}
                  >
                    {isPast ? <CheckCircle2 size={22} /> : step.icon}
                  </div>

                  {/* Nội dung chi tiết */}
                  <div className="pt-1.5">
                    <h4 className={`text-xs font-bold mb-0.5 transition-colors duration-500 
                      ${isPast ? 'text-zinc-900 dark:text-white' : isActive ? 'text-zinc-900 dark:text-white underline decoration-wavy decoration-zinc-400' : 'text-zinc-400'}`}
                    >
                      {step.title}
                      {isActive && (
                        <span className="ml-2 inline-flex space-x-1">
                          <span className="w-1 h-1 bg-zinc-650 dark:bg-zinc-350 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1 h-1 bg-zinc-650 dark:bg-zinc-350 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1 h-1 bg-zinc-650 dark:bg-zinc-350 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                      )}
                    </h4>
                    <p className={`text-[10px] font-semibold transition-colors duration-500 ${isPast || isActive ? 'text-zinc-550 dark:text-zinc-400' : 'text-zinc-400/80'}`}>
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
