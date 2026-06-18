import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { Loader2, AlertCircle } from 'lucide-react';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ĐÂY LÀ PHẦN XỬ LÝ RESPONSE TỪ SERVER MÀ TRÚC YÊU CẦU NÈ
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Ném dữ liệu lên Server
      const response = await authService.register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });
      
      // 2. Server phản hồi thành công -> Báo thành công và chuyển về Login
      if (response) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (err: any) {
      // 3. Xử lý response lỗi từ Server (VD: Trùng email) và in ra chữ đỏ
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh]">
      <div className="bg-white p-8 rounded-2xl shadow-minimal-md w-full max-w-sm border border-slate-100">
        <h2 className="text-xl font-black text-center text-slate-900 mb-6">Tạo tài khoản mới</h2>
        
        {/* Khung màu đỏ hiện response lỗi từ Server */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs font-bold text-red-600 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Họ và Tên</label>
            <input 
              type="text" name="full_name" required
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium text-slate-800 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
            <input 
              type="email" name="email" required
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium text-slate-800 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Mật khẩu</label>
            <input 
              type="password" name="password" required minLength={6}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium text-slate-800 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Xác nhận mật khẩu</label>
            <input 
              type="password" name="confirm_password" required minLength={6}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium text-slate-800 text-sm transition-all"
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-3 mt-2 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-minimal-sm text-sm"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Đăng ký ngay'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-xs font-medium">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}