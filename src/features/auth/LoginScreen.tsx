import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2 } from 'lucide-react';
import authService from '../../services/authService';

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('quynhnhu@nttu.edu.vn');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

 const [error, setError] = useState(''); // Thêm dòng này để chứa thông báo lỗi nếu có

  const handleLogin = async () => {
    setLoading(true);
    setError(''); // Xóa lỗi cũ (nếu có) trước khi thử lại

    try {
      // Gọi API đăng nhập thật
      const response = await authService.login(email, password);

      if (response.access_token) {
        // Thành công thì nhảy qua màn hình lớp học
        navigate('/classes');
      }
    } catch (err: any) {
      // Bắt lỗi (VD: sai mật khẩu) và in ra màn hình
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh]">
      <div className="bg-white p-8 rounded-2xl shadow-minimal-md w-full max-w-sm border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 text-blue-600 p-3.5 rounded-xl border border-blue-100">
            <FileText size={30} />
          </div>
        </div>        
        <h2 className="text-xl font-black text-center text-slate-900 mb-1.5">Hệ thống TrustLens</h2>
        <p className="text-center text-slate-500 text-xs mb-8 font-medium">Xác thực danh mục tài liệu đồ án công nghệ thông tin</p>       
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tài khoản nội bộ</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium text-slate-800 text-sm transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Mật khẩu bảo mật</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium text-slate-800 text-sm transition-all" 
            />
          </div>        
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-minimal-sm mt-2 disabled:opacity-70 text-sm"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Đăng nhập hệ thống'}
          </button>
          
          <p className="text-center text-xs font-medium text-slate-400 mt-6">
            Chưa có tài khoản?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-blue-600 font-bold hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}