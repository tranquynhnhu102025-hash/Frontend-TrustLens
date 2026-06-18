import uploadService from "../../services/uploadService";
import { useState, useEffect } from 'react';
import { Send, AlertCircle, UploadCloud, X, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadScreen() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
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
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (!selectedFile) return;

    // Chỉ nhận PDF và DOCX
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
  }; 

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
        <div className="flex items-center gap-2 mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100">
          <AlertCircle size={20} /> {error}
        </div>
      )}
    </div>
  );
}