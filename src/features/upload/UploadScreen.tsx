import uploadService from "../../services/uploadService";

import { useState, useEffect } from 'react'; // Tui thêm useEffect ở đây nha
import { Send, AlertCircle, UploadCloud, X, FileText, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';



export default function UploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy theme an toàn từ context hoặc localStorage làm dự phòng
  const { theme: contextTheme } = useOutletContext<{ theme?: 'light' | 'dark' }>() || {};
  const theme = contextTheme || localStorage.getItem('theme') || 'dark';
  
  const selectedClass = location.state?.selectedClass;

  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentClass, setCurrentClass] = useState<any>(null);

  useEffect(() => {
    const savedClass = localStorage.getItem('selectedClass');
    if (!savedClass) {
      navigate('/classes'); 
    } else {
      try {
        setCurrentClass(JSON.parse(savedClass));
      } catch (e) {
        navigate('/classes');
      }
    }
  }, [navigate]);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setError('');
    
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Chỉ nhận PDF và DOCX
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
    if (!file || !currentClass?.id) {
      setError('Lỗi dữ liệu lớp học. Vui lòng quay lại trang danh sách lớp!');
      return;
    }

    setUploadStatus('uploading');
    setProgress(10);

    try {
      // Gửi đúng ID lớp đã chọn
      const res = await uploadService.uploadSubmission(currentClass.id, 'Tran_Quynh_Nhu', file);
      const submissionId = res.id || res.submission?.id;
      
      setProgress(40);
      // @ts-ignore
      await uploadService.analyzeSubmission(submissionId);
      setProgress(60);
      // @ts-ignore
      await uploadService.detectReferences(submissionId);
      setProgress(80);
      // @ts-ignore
      await uploadService.verifyMetadata(submissionId);
      setProgress(100);

      setUploadStatus('success');
      setTimeout(() => navigate(`/report/${submissionId}`), 1000);
   } catch (err: any) {
      setUploadStatus('failed');
      // Đây là chỗ hiện lỗi thực sự từ Backend
      const errorMessage = err.response?.data?.message || 'Lỗi không xác định. Vui lòng kiểm tra lại nội dung file!';
      setError(errorMessage);
    }

    setProcessing(false);
  }; 

  if (!selectedClass && !currentClass) {
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
  const displayClassName = selectedClass?.name || currentClass?.name || 'Đồ án Tốt nghiệp';

  return (
    // ... (Giữ nguyên phần giao diện return như cũ)
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Tải lên bài báo cáo</h2>
        <p className="text-slate-500 font-medium">
          Lớp học phần: <span className="text-blue-600 font-bold">{currentClass?.name || 'Đang tải...'}</span>
        </p>
      </div>
      {error && (
        <div className="flex items-center gap-2 mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 text-sm">
          <AlertCircle size={18} className="shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}