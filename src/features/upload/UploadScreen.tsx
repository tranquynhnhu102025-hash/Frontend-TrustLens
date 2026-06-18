import uploadService from "../../services/uploadService";
import { useState } from 'react';
import { Send, AlertCircle, UploadCloud, X, FileText, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function UploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  const selectedClass = location.state?.selectedClass;

  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // TẠO BIẾN CHỨA LỚP HỌC
  const [currentClass, setCurrentClass] = useState<any>(null);

// 18. VỪA VÀO TRANG LÀ TỰ ĐỘNG ĐI LẤY THÔNG TIN LỚP HỌC TỪ LOCALSTORAGE
  useEffect(() => {
    const savedClass = localStorage.getItem('selectedClass');
    if (savedClass) {
      try {
        setCurrentClass(JSON.parse(savedClass));
      } catch (e) {
        console.error("Lỗi đọc dữ liệu lớp học:", e);
      }
    }
  }, []);
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
    if (!file || !selectedClass?.assignment_id) {
      setError('Vui lòng chọn lớp học hợp lệ!');
      return;
    }

    setUploadStatus('uploading');
    setProgress(10);

    try {
    
      const res = await uploadService.uploadSubmission(selectedClass.assignment_id, 'User_Name', file);
      const submissionId = res.id || res.submission?.id;
      setProgress(30);

    
      // @ts-ignore
      await uploadService.analyzeSubmission(submissionId);
      setProgress(50);
      
      // @ts-ignore
      await uploadService.detectReferences(submissionId);
      setProgress(70);
      
      // @ts-ignore
      await uploadService.parseCitations(submissionId);
      setProgress(85);
      
      // @ts-ignore
      await uploadService.verifyMetadata(submissionId);
      setProgress(100);

      setUploadStatus('success');
      setTimeout(() => navigate(`/report/${submissionId}`), 1000);
   } catch (err: any) {
      setUploadStatus('failed');
      const errorMessage = err.response?.data?.message || 'Lỗi xử lý hệ thống. Vui lòng thử lại!';
      setError(errorMessage);
    }

    setProcessing(false);
  }; 

  if (!selectedClass) {
    return (
      <div className={`w-full max-w-md mx-auto mt-16 p-8 border rounded-3xl text-center animate-fade-in transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/40 border-slate-900 shadow-lg' 
          : 'bg-white border-slate-200 shadow-md shadow-slate-100'
      }`}>
        <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
        <h3 className={`text-xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Chưa chọn lớp học phần</h3>
        <p className={`text-sm mb-6 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Vui lòng chọn một lớp học phần phụ trách để bắt đầu tải lên và thẩm định báo cáo đồ án.
        </p>
        <button 
          onClick={() => navigate('/classes')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-200"
        >
          <ArrowLeft size={18} /> Đi tới quản lý lớp học
        </button>
      </div>
    );
  }

  const hasIdle = fileItems.some(item => item.status === 'idle');
  const hasFinished = fileItems.some(item => item.status === 'success');

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Tải lên bài báo cáo</h2>
        <p className="text-slate-500 font-medium">
          Lớp học phần: <span className="text-blue-600 font-bold">{selectedClass?.name || 'Đồ án Tốt nghiệp'}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 text-sm">
          <AlertCircle size={18} className="shrink-0" /> {error}
        </div>
      )}

      {/* DROPZONE AREA */}
      <div className={`p-8 border rounded-3xl shadow-sm transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/20 border-slate-900' 
          : 'bg-white border-slate-200'
      }`}>
        <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
          theme === 'dark'
            ? 'bg-slate-950/20 border-slate-800 hover:bg-blue-950/10 hover:border-blue-500/50'
            : 'bg-slate-50 border-slate-250 hover:bg-blue-50/50 hover:border-blue-400'
        }`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className={`p-3.5 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ${
              theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100 shadow-slate-100'
            }`}>
              <UploadCloud size={30} className="text-blue-600" />
            </div>
            <p className={`mb-1.5 text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="font-bold text-blue-600">Nhấp để chọn file</span> hoặc kéo thả nhiều file vào đây
            </p>
            <p className="text-xs text-slate-400 font-bold tracking-wide">
              Chấp nhận PDF hoặc DOCX (Tối đa 20MB/tệp)
            </p>
          </div>
          <input type="file" className="hidden" accept=".pdf,.docx" multiple onChange={handleFileDrop} disabled={processing} />
        </label>

        {/* FILE LIST QUEUE */}
        {fileItems.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className={`text-sm font-black uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Hàng đợi tải lên ({fileItems.length} tệp)
            </h3>
            
            <div className="space-y-3">
              {fileItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-slate-950/60 border-slate-850' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* File Metadata */}
                  <div className="flex items-center gap-3 overflow-hidden min-w-[200px] max-w-[300px]">
                    <div className={`p-2.5 rounded-xl text-white shrink-0 ${item.file.name.endsWith('.pdf') ? 'bg-rose-500' : 'bg-blue-600'}`}>
                      <FileText size={20} />
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-black truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{item.file.name}</p>
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
                        className={`w-full px-3 py-2 border rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                          theme === 'dark' 
                            ? 'bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-650' 
                            : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-slate-50/20'
                        }`}
                        disabled={processing}
                      />
                    ) : (
                      <div className="text-xs font-bold px-3 py-2 bg-slate-900/10 border border-slate-350/10 rounded-xl text-slate-500">
                        Sinh viên: <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{item.ownerLabel}</span>
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
                        <div className={`w-28 h-1.5 rounded-full overflow-hidden ml-auto ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div className="bg-blue-600 h-1.5 transition-all duration-300" style={{ width: `${item.progress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {item.status === 'success' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50/50 px-2.5 py-1 rounded-lg border border-green-200">
                        <CheckCircle2 size={14} /> Hoàn tất
                      </span>
                    )}

                    {item.status === 'failed' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50/50 px-2 py-0.5 rounded-lg border border-rose-200" title={item.error}>
                        <AlertCircle size={13} /> Thất bại
                      </span>
                    )}

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {item.status === 'success' && item.submissionId && (
                        <button
                          onClick={() => navigate(`/report/${item.submissionId}`)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all border border-blue-100 shadow-sm"
                          title="Xem báo cáo thẩm định"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      
                      {item.status === 'idle' && (
                        <button
                          onClick={() => removeFile(item.id)}
                          disabled={processing}
                          className={`p-2 rounded-xl transition-all border shadow-sm ${
                            theme === 'dark'
                              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-950/20'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title="Xóa tệp này"
                        >
                          <Trash2 size={15} />
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
        <div className={`flex justify-between items-center mt-8 pt-6 border-t ${
          theme === 'dark' ? 'border-slate-850' : 'border-slate-100'
        }`}>
          <button
            onClick={() => setFileItems([])}
            disabled={fileItems.length === 0 || processing}
            className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white disabled:opacity-50'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40'
            }`}
          >
            Xóa hàng đợi
          </button>

          <button 
            onClick={handleUpload}
            disabled={fileItems.length === 0 || processing || !hasIdle}
            className="flex items-center gap-2.5 px-8 py-3.5 font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {processing ? (
              <><Loader2 size={16} className="animate-spin" /> Đang phân tích hàng loạt...</>
            ) : hasFinished && !hasIdle ? (
              <><CheckCircle2 size={16} /> Đã thẩm định xong</>
            ) : (
              <>Bắt đầu kiểm duyệt <Send size={15} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}