import uploadService from "../../services/uploadService";
import { useState, useEffect } from 'react';
import { 
  Send, AlertCircle, UploadCloud, FileText, 
  Loader2, CheckCircle2, ArrowLeft, Trash2, Eye 
} from 'lucide-react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { classService, Course } from '../../services/classService';
import { isMockMode } from '../../services/mockMode';

interface FileItem {
  id: string;
  file: File;
  ownerLabel: string;
  status: 'idle' | 'uploading' | 'success' | 'failed';
  progress: number;
  error?: string;
  submissionId?: string;
}

export default function UploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { theme: contextTheme } = useOutletContext<{ theme?: 'light' | 'dark' }>() || {};
  const theme = contextTheme || localStorage.getItem('theme') || 'dark';
  
  const selectedClass = location.state?.selectedClass;
  const useMock = isMockMode;

  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentClass, setCurrentClass] = useState<Course | null>(null);
  const [classesList, setClassesList] = useState<Course[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // State kiểm soát hoạt cảnh
  const [mounted, setMounted] = useState(false);

  // Kích hoạt hoạt cảnh khi tải xong thông tin lớp học
  useEffect(() => {
    if (!loadingClasses && currentClass) {
      setMounted(true);
    } else {
      setMounted(false);
    }
  }, [loadingClasses, currentClass]);

  useEffect(() => {
    const loadClasses = async () => {
      setLoadingClasses(true);
      try {
        const data = await classService.getClasses();
        setClassesList(data);
        
        if (selectedClass) {
          localStorage.setItem('selectedClass', JSON.stringify(selectedClass));
          setCurrentClass(selectedClass);
        } else {
          const savedClass = localStorage.getItem('selectedClass');
          if (savedClass) {
            try {
              const parsed = JSON.parse(savedClass);
              const exists = data.find(c => c.id === parsed.id);
              setCurrentClass(exists || data[0] || null);
            } catch (e) {
              setCurrentClass(data[0] || null);
            }
          } else {
            setCurrentClass(data[0] || null);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách lớp học:", error);
      } finally {
        setLoadingClasses(false);
      }
    };
    loadClasses();
  }, [selectedClass]);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setError('');
    
    if (!selectedFiles || selectedFiles.length === 0) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const newItems: FileItem[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const selectedFile = selectedFiles[i];

      if (!validTypes.includes(selectedFile.type)) {
        setError('Có tệp định dạng không hợp lệ. Chỉ chấp nhận file .PDF hoặc .DOCX!');
        continue;
      } 

      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('Có tệp kích thước quá lớn. Giới hạn tối đa là 20MB!');
        continue;
      }

      if (fileItems.some(item => item.file.name === selectedFile.name)) {
        continue;
      }

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file: selectedFile,
        ownerLabel: '',
        status: 'idle',
        progress: 0
      });
    }

    setFileItems((prev) => [...prev, ...newItems]);
  };

  const updateOwnerLabel = (id: string, label: string) => {
    setFileItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ownerLabel: label } : item))
    );
  };

  const removeFile = (id: string) => {
    setFileItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, fields: Partial<FileItem>) => {
    setFileItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
    );
  };

  const handleClassChange = (classId: string) => {
    const found = classesList.find(c => c.id === classId);
    if (found) {
      localStorage.setItem('selectedClass', JSON.stringify(found));
      setCurrentClass(found);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (fileItems.length === 0 || !currentClass) return;

    const idleItems = fileItems.filter(item => item.status === 'idle');
    const missingLabel = idleItems.some(item => !item.ownerLabel.trim());
    if (missingLabel) {
      setError('Vui lòng điền thông tin Sinh viên / Nhóm thực hiện cho tất cả các file nộp!');
      return;
    }

    setError('');
    setProcessing(true);
    
    for (let i = 0; i < fileItems.length; i++) {
      const item = fileItems[i];
      if (item.status !== 'idle' && item.status !== 'failed') continue;

      updateItem(item.id, { status: 'uploading', progress: 10, error: undefined });

      if (useMock()) {
        const mockJobId = `mock-job-${item.id}-${Math.random().toString(36).substring(2, 9)}`;
        // Chuyển hướng ngay sang màn hình phân tích (mock)
        navigate(`/analyzing/${mockJobId}`);
        return;
      }

      try {
        const res = await uploadService.uploadSubmission(
          currentClass!.assignment_id || currentClass!.id, 
          item.ownerLabel.trim(), 
          item.file
        );
        const submissionId = res.id || res.submission?.id;
        if (!submissionId) {
          throw new Error('Không lấy được Submission ID từ phản hồi tải lên.');
        }
        
        updateItem(item.id, { progress: 50 });

        // Gọi API phân tích để lấy job_id
        const analyzeRes = await uploadService.analyzeSubmission(submissionId);
        const jobId = analyzeRes.job_id || analyzeRes.id;
        
        if (!jobId) {
          throw new Error('Không lấy được Job ID từ phản hồi phân tích.');
        }

        updateItem(item.id, { status: 'success', progress: 100, submissionId });
        
        // Điều hướng đến trang analyzing của Job
        navigate(`/analyzing/${jobId}`);
        return; // Dừng vòng lặp do đã điều hướng trang
      } catch (err: any) {
        console.error("Lỗi xử lý file:", item.file.name, err);
        const errorMessage = err.response?.data?.message || err.message || 'Lỗi xử lý hệ thống.';
        updateItem(item.id, { status: 'failed', error: errorMessage });
      }
    }

    setProcessing(false);
  };

  if (loadingClasses && !currentClass) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-4 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="text-center border-b border-zinc-150 dark:border-zinc-900 pb-5 space-y-3">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
          <div className="h-5 w-64 bg-zinc-100 dark:bg-zinc-900/60 rounded mx-auto mt-2"></div>
        </div>

        {/* Dropzone Skeleton */}
        <div className="p-5 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-955 rounded-lg shadow-sm">
          <div className="w-full h-36 border-2 border-dashed border-zinc-150 dark:border-zinc-850 rounded-lg flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            <div className="h-3.5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="w-full max-w-md mx-auto mt-16 p-8 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-lg text-center animate-scale-up shadow-sm">
        <AlertCircle size={36} className="text-zinc-400 dark:text-zinc-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-sm font-bold mb-1 text-zinc-900 dark:text-white">Chưa cấu hình lớp học phần</h3>
        <p className="text-xs mb-5 leading-relaxed text-zinc-500 font-medium">
          Vui lòng tạo một lớp học phần phụ trách để bắt đầu tải lên báo cáo.
        </p>
        <button 
          onClick={() => navigate('/classes')}
          className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold px-4 py-2 rounded-lg transition-all duration-250 active:scale-98 text-xs"
        >
          <ArrowLeft size={13} /> Đi tới quản lý lớp học
        </button>
      </div>
    );
  }

  const hasIdle = fileItems.some(item => item.status === 'idle');
  const hasFinished = fileItems.some(item => item.status === 'success');

  return (
    <div className={`w-full max-w-4xl mx-auto mt-4 space-y-6 transition-all duration-500 ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="text-center border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Tải lên bài báo cáo</h2>
        <div className="text-xs font-semibold text-zinc-550 dark:text-zinc-500 mt-2 flex items-center justify-center gap-1.5">
          Lớp học phần: 
          <select 
            value={currentClass?.id || ''}
            onChange={(e) => handleClassChange(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors cursor-pointer"
          >
            {classesList.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.id} - {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 p-3.5 bg-red-50 dark:bg-red-955/20 text-red-655 dark:text-red-400 font-semibold rounded-lg border border-red-200 dark:border-red-900/50 text-xs animate-fade-in-down">
          <AlertCircle size={14} className="shrink-0" /> {error}
        </div>
      )}

      {/* DROPZONE AREA */}
      <div className="p-5 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg cursor-pointer transition-all duration-300 bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-sm active:scale-99 group">
          <div className="flex flex-col items-center justify-center pt-4 pb-5">
            <UploadCloud size={20} className="text-zinc-400 dark:text-zinc-500 mb-2 group-hover:scale-105 transition-transform" />
            <p className="mb-0.5 text-xs font-semibold text-zinc-650 dark:text-zinc-350">
              <span className="font-bold text-zinc-900 dark:text-white">Nhấp để chọn file</span> hoặc kéo thả file vào đây
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              Chấp nhận PDF hoặc DOCX (Tối đa 20MB/tệp)
            </p>
          </div>
          <input type="file" className="hidden" accept=".pdf,.docx" multiple onChange={handleFileDrop} disabled={processing} />
        </label>


        {/* FILE LIST QUEUE */}
        {fileItems.length > 0 && (
          <div className="mt-5">
            <div className="space-y-2">
              {fileItems.map((item, index) => (
                <div 
                  key={item.id} 
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                  className="p-3.5 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-955 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in-down hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                >
                  {/* File Metadata */}
                  <div className="flex items-center gap-3 overflow-hidden min-w-[200px] max-w-[300px]">
                    <div className="p-2 bg-zinc-105 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 rounded-lg shrink-0">
                      <FileText size={15} />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold truncate text-zinc-800 dark:text-zinc-200">{item.file.name}</p>
                      <p className="text-[10px] font-semibold text-zinc-405 dark:text-zinc-500 mt-0.5">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>

                  {/* Student / Group Label Input */}
                  <div className="flex-1 min-w-[160px]">
                    {item.status === 'idle' || item.status === 'failed' ? (
                      <input 
                        type="text" 
                        required
                        value={item.ownerLabel}
                        onChange={(e) => updateOwnerLabel(item.id, e.target.value)}
                        placeholder="Sinh viên / Mã nhóm thực hiện" 
                        className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-xs font-semibold transition-colors focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                        disabled={processing}
                      />
                    ) : (
                      <div className="text-xs font-semibold px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-900 rounded-lg text-zinc-550 dark:text-zinc-400">
                        Sinh viên: <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.ownerLabel}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress & Status Indicators */}
                  <div className="flex items-center gap-3.5 min-w-[140px] justify-end">
                    {item.status === 'uploading' && (
                      <div className="w-full text-right space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                          <span>Đang xử lý</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-20 h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden ml-auto">
                          <div 
                            className={`h-1.5 transition-all duration-300 ${
                              theme === 'dark' ? 'animate-shimmer' : 'animate-shimmer-light'
                            }`} 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {item.status === 'success' && (
                      <span className="inline-flex px-2 py-0.5 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-bold text-[10px] rounded border border-green-150 dark:border-green-900/50 gap-1 items-center">
                        <CheckCircle2 size={11} /> Hoàn tất
                      </span>
                    )}

                    {item.status === 'failed' && (
                      <span className="inline-flex px-2 py-0.5 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-bold text-[10px] rounded border border-rose-150 dark:border-rose-900/50 gap-1 items-center" title={item.error}>
                        <AlertCircle size={11} /> Thất bại
                      </span>
                    )}

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {item.status === 'success' && item.submissionId && (
                        <button
                          onClick={() => navigate(`/report/${item.submissionId}`)}
                          className="p-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Xem báo cáo thẩm định"
                        >
                          <Eye size={12} />
                        </button>
                      )}
                      
                      {item.status === 'idle' && (
                        <button
                          onClick={() => removeFile(item.id)}
                          disabled={processing}
                          className="p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 text-zinc-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                          title="Xóa tệp"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-150 dark:border-zinc-900">
          <button
            onClick={() => setFileItems([])}
            disabled={fileItems.length === 0 || processing}
            className="px-3.5 py-1.5 font-semibold text-xs border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors disabled:opacity-40"
          >
            Xóa hàng đợi
          </button>

          <button 
            onClick={handleUpload}
            disabled={fileItems.length === 0 || processing || !hasIdle}
            className="flex items-center gap-1.5 px-4.5 py-2 font-bold text-xs bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-105 text-white dark:text-black rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {processing ? (
              <><Loader2 size={12} className="animate-spin" /> Đang phân tích...</>
            ) : hasFinished && !hasIdle ? (
              <><CheckCircle2 size={12} /> Đã thẩm định xong</>
            ) : (
              <>Bắt đầu kiểm duyệt <Send size={11} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
