import uploadService from "../../services/uploadService";
import { useState, useEffect } from 'react';
import { 
  Send, AlertCircle, UploadCloud, X, FileText, 
  Loader2, CheckCircle2, ArrowLeft, Trash2, Eye 
} from 'lucide-react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';

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

  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentClass, setCurrentClass] = useState<any>(null);

  // Sync selected class with localStorage and state
  useEffect(() => {
    if (selectedClass) {
      localStorage.setItem('selectedClass', JSON.stringify(selectedClass));
      setCurrentClass(selectedClass);
    } else {
      const savedClass = localStorage.getItem('selectedClass');
      if (savedClass) {
        try {
          setCurrentClass(JSON.parse(savedClass));
        } catch (e) {
          console.error("Lỗi đọc dữ liệu lớp học:", e);
          navigate('/classes');
        }
      } else {
        navigate('/classes');
      }
    }
  }, [selectedClass, navigate]);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setError('');
    
    if (!selectedFiles || selectedFiles.length === 0) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const newItems: FileItem[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const selectedFile = selectedFiles[i];

      // Kiểm tra định dạng tệp
      if (!validTypes.includes(selectedFile.type)) {
        setError('Có tệp định dạng không hợp lệ. Chỉ chấp nhận file .PDF hoặc .DOCX!');
        continue;
      } 

      // Kiểm tra dung lượng (tối đa 20MB)
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('Có tệp kích thước quá lớn. Giới hạn tối đa là 20MB!');
        continue;
      }

      // Tránh trùng lặp tệp trùng tên trong hàng đợi hiện tại
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

  const handleUpload = async () => {
    if (fileItems.length === 0) return;

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

      // Nếu ở chế độ MOCK
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        try {
          await new Promise(r => setTimeout(r, 600));
          updateItem(item.id, { progress: 30 });
          await new Promise(r => setTimeout(r, 600));
          updateItem(item.id, { progress: 60 });
          await new Promise(r => setTimeout(r, 600));
          updateItem(item.id, { progress: 85 });
          await new Promise(r => setTimeout(r, 600));
          updateItem(item.id, { status: 'success', progress: 100, submissionId: `mock-${item.id}` });
        } catch (err: any) {
          updateItem(item.id, { status: 'failed', error: 'Lỗi mô phỏng xử lý hệ thống.' });
        }
        continue;
      }

      // Ở chế độ Backend
      try {
        // 1. Tải lên tệp
        const res = await uploadService.uploadSubmission(
          currentClass.assignment_id || currentClass.id, 
          item.ownerLabel.trim(), 
          item.file
        );
        const submissionId = res.id || res.submission?.id;
        updateItem(item.id, { progress: 30 });

        // 2. Chạy luồng phân tích văn bản thô
        // @ts-ignore
        await uploadService.analyzeSubmission(submissionId);
        updateItem(item.id, { progress: 50 });
        
        // 3. Phát hiện danh sách tài liệu tham khảo
        // @ts-ignore
        await uploadService.detectReferences(submissionId);
        updateItem(item.id, { progress: 70 });
        
        // 4. Bóc tách chi tiết từng trích dẫn
        // @ts-ignore
        await uploadService.parseCitations(submissionId);
        updateItem(item.id, { progress: 85 });
        
        // 5. Đối chiếu API chéo metadata
        // @ts-ignore
        await uploadService.verifyMetadata(submissionId);
        
        updateItem(item.id, { status: 'success', progress: 100, submissionId });
      } catch (err: any) {
        console.error("Lỗi xử lý file:", item.file.name, err);
        const errorMessage = err.response?.data?.message || 'Lỗi xử lý hệ thống.';
        updateItem(item.id, { status: 'failed', error: errorMessage });
      }
    }

    setProcessing(false);
  }; 

  if (!selectedClass && !currentClass) {
    return (
      <div className="w-full max-w-md mx-auto mt-16 p-8 border border-slate-100 bg-white rounded-2xl text-center animate-fade-in shadow-minimal-sm">
        <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-black mb-1.5 text-slate-950">Chưa chọn lớp học phần</h3>
        <p className="text-xs mb-6 leading-relaxed text-slate-500 font-medium">
          Vui lòng chọn một lớp học phần phụ trách để bắt đầu tải lên và thẩm định báo cáo đồ án.
        </p>
        <button 
          onClick={() => navigate('/classes')}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-minimal-sm text-xs"
        >
          <ArrowLeft size={14} /> Đi tới quản lý lớp học
        </button>
      </div>
    );
  }

  const hasIdle = fileItems.some(item => item.status === 'idle');
  const hasFinished = fileItems.some(item => item.status === 'success');
  const displayClassName = selectedClass?.name || currentClass?.name || 'Đồ án Tốt nghiệp';

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-1.5">Tải lên bài báo cáo</h2>
        <p className="text-sm font-medium text-slate-500">
          Lớp học phần: <span className="text-blue-600 font-bold">{displayClassName}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 text-xs">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* DROPZONE AREA */}
      <div className="p-6 border border-slate-100 bg-white rounded-2xl shadow-minimal-sm">
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50 hover:border-blue-500/60 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-minimal-sm mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud size={24} className="text-blue-600" />
            </div>
            <p className="mb-1 text-xs font-bold text-slate-600">
              <span className="font-bold text-blue-600">Nhấp để chọn file</span> hoặc kéo thả file vào đây
            </p>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Chấp nhận PDF hoặc DOCX (Tối đa 20MB/tệp)
            </p>
          </div>
          <input type="file" className="hidden" accept=".pdf,.docx" multiple onChange={handleFileDrop} disabled={processing} />
        </label>

        {/* FILE LIST QUEUE */}
        {fileItems.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Hàng đợi tải lên ({fileItems.length} tệp)
            </h3>
            
            <div className="space-y-2.5">
              {fileItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 border border-slate-100 bg-white rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-minimal-sm"
                >
                  {/* File Metadata */}
                  <div className="flex items-center gap-3 overflow-hidden min-w-[200px] max-w-[300px]">
                    <div className={`p-2.5 rounded-xl text-white shrink-0 ${item.file.name.endsWith('.pdf') ? 'bg-rose-500/90' : 'bg-blue-650'}`}>
                      <FileText size={18} />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold truncate text-slate-800">{item.file.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>

                  {/* Student / Group Label Input */}
                  <div className="flex-1 min-w-[180px]">
                    {item.status === 'idle' || item.status === 'failed' ? (
                      <input 
                        type="text" 
                        required
                        value={item.ownerLabel}
                        onChange={(e) => updateOwnerLabel(item.id, e.target.value)}
                        placeholder="Tên sinh viên / Mã nhóm" 
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-slate-800 placeholder:text-slate-400"
                        disabled={processing}
                      />
                    ) : (
                      <div className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-500">
                        Sinh viên: <span className="text-slate-700">{item.ownerLabel}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress & Status Indicators */}
                  <div className="flex items-center gap-4 min-w-[150px] justify-end">
                    {item.status === 'uploading' && (
                      <div className="w-full text-right space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-blue-500">
                          <span>Đang xử lý</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-24 h-1.5 rounded-full overflow-hidden ml-auto bg-slate-100">
                          <div className="bg-blue-600 h-1.5 transition-all duration-300" style={{ width: `${item.progress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {item.status === 'success' && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-lg border border-green-150">
                        <CheckCircle2 size={13} /> Hoàn tất
                      </span>
                    )}

                    {item.status === 'failed' && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-150" title={item.error}>
                        <AlertCircle size={13} /> Thất bại
                      </span>
                    )}

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {item.status === 'success' && item.submissionId && (
                        <button
                          onClick={() => navigate(`/report/${item.submissionId}`)}
                          className="p-2 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-minimal-sm"
                          title="Xem báo cáo thẩm định"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                      
                      {item.status === 'idle' && (
                        <button
                          onClick={() => removeFile(item.id)}
                          disabled={processing}
                          className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-minimal-sm"
                          title="Xóa tệp này"
                        >
                          <Trash2 size={14} />
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
        <div className="flex justify-between items-center mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => setFileItems([])}
            disabled={fileItems.length === 0 || processing}
            className="px-4 py-2 font-bold text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-40"
          >
            Xóa hàng đợi
          </button>

          <button 
            onClick={handleUpload}
            disabled={fileItems.length === 0 || processing || !hasIdle}
            className="flex items-center gap-1.5 px-6 py-2.5 font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-minimal-sm disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {processing ? (
              <><Loader2 size={14} className="animate-spin" /> Đang phân tích...</>
            ) : hasFinished && !hasIdle ? (
              <><CheckCircle2 size={14} /> Đã thẩm định xong</>
            ) : (
              <>Bắt đầu kiểm duyệt <Send size={13} className="group-hover:translate-x-0.5 transition-transform" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}