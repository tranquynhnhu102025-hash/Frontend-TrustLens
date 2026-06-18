import uploadService from "../../services/uploadService";

import { useState, useEffect } from 'react'; // Tui thêm useEffect ở đây nha
import { Send, AlertCircle, UploadCloud, X, FileText, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function UploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedClass = location.state?.selectedClass;

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

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
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Định dạng không hợp lệ. Chỉ chấp nhận file .PDF hoặc .DOCX!');
      return;
    } 

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File quá lớn. Kích thước tối đa cho phép là 20MB!');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('idle');
    setProgress(0);
  };

  const handleUpload = async () => {
    // SỬA LỖI TRÍ TỬ: Dùng currentClass.id thay vì assignment_id
    if (!file || !currentClass?.id) {
      setError('Vui lòng chọn lớp học hợp lệ!');
      return;
    }

    setUploadStatus('uploading');
    setProgress(10);

    try {
      // Đổi thành currentClass.id luôn nè
      const res = await uploadService.uploadSubmission(currentClass.id, 'Tran_Quynh_Nhu', file);
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
  }; 

  if (!selectedClass) {
    return (
      <div className="w-full max-w-md mx-auto mt-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-lg text-center animate-fade-in">
        <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học phần</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
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

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Tải lên bài báo cáo</h2>
        <p className="text-slate-500 font-medium">
          {/* HIỂN THỊ TÊN LỚP RA MÀN HÌNH */}
          Lớp học phần: <span className="text-blue-600 font-bold">{currentClass?.name || 'Chưa chọn lớp'}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 transition-all hover:border-blue-400 group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud size={40} className="text-blue-600" />
              </div>
              <p className="mb-2 text-lg text-slate-700 font-medium">
                <span className="font-bold text-blue-600">Nhấp để chọn file</span> hoặc kéo thả vào đây
              </p>
              <p className="text-sm text-slate-400 font-bold tracking-wide">
                Hỗ trợ PDF, DOCX (Tối đa 20MB)
              </p>
            </div>
            <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileDrop} />
          </label>
        ) : (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`p-3 rounded-xl shadow-sm text-white ${file.type.includes('pdf') ? 'bg-rose-500' : 'bg-blue-600'}`}>
                  <FileText size={28} />
                </div>
                <div className="truncate pr-4">
                  <p className="text-base font-black text-slate-800 truncate">{file.name}</p>
                  <p className="text-sm font-bold text-slate-400 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              {uploadStatus === 'idle' && (
                <button onClick={() => setFile(null)} className="p-2 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm shrink-0">
                  <X size={20} />
                </button>
              )}
            </div>

            {uploadStatus !== 'idle' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className={uploadStatus === 'success' ? 'text-green-600' : 'text-blue-600'}>
                    {uploadStatus === 'uploading' ? 'Đang tải lên...' : 'Tải lên thành công!'}
                  </span>
                  <span className="text-slate-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full transition-all duration-300 ease-out ${uploadStatus === 'success' ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={handleUpload}
            disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'success'}
            className="flex items-center gap-2.5 px-8 py-3.5 font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {uploadStatus === 'uploading' ? (
              <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</>
            ) : uploadStatus === 'success' ? (
              <><CheckCircle2 size={20} /> Hoàn tất</>
            ) : (
              <>Bắt đầu kiểm duyệt <Send size={18} className="group-hover:translate-x-1.5 transition-transform" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}