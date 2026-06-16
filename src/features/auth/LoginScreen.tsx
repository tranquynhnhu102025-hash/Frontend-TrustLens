import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('quynhnhu@nttu.edu.vn');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    
    // GIẢ LẬP ĐĂNG NHẬP MOCK DATA CHO DEMO
    setTimeout(() => {
      setLoading(false);
      navigate('/classes');
    }, 1000); // Quay đều 1 giây rồi nhảy trang
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-2xl shadow-md">
            <FileText size={36} />
          </div>
        </div>        
        <h2 className="text-2xl font-black text-center text-slate-800 mb-2">Hệ thống TrustLens</h2>
        <p className="text-center text-slate-500 text-sm mb-8 font-medium">Xác thực danh mục tài liệu đồ án công nghệ thông tin</p>       
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Tài khoản nội bộ</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Mật khẩu bảo mật</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800" 
            />
          </div>        
          
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 mt-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Đăng nhập hệ thống'}
          </button>
          
          <p className="text-center text-sm font-medium text-slate-500 mt-6">
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