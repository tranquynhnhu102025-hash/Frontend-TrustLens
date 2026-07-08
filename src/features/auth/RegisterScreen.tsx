import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { Loader2, AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { PASSWORD_MIN_LENGTH, isPublicRegistrationEnabled } from '../../config/authPolicy';
import { formatApiError } from '../../services/apiError';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const publicRegistrationEnabled = isPublicRegistrationEnabled();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Mật khẩu xác nhận không khớp!');
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
      return;
    }

    if (formData.password.trim().length < PASSWORD_MIN_LENGTH) {
      setError(`Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự.`);
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });
      
      if (response) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(formatApiError(err, 'Đăng ký thất bại. Vui lòng kiểm tra lại!'));
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 animate-fade-in">
      <div 
        className={`bg-white dark:bg-zinc-955 p-8 rounded-xl border border-zinc-200 dark:border-zinc-900 w-full max-w-sm shadow-md transition-all duration-300 ${
          shouldShake ? 'animate-shake border-red-300 dark:border-red-900' : ''
        }`}
      >
        <Link to='/' className="flex flex-col items-center mb-8">
          <img src="/public/Symbol/TrustLens_Symbol_Gray.svg" alt="trustlens-logo" className='h-15, w-15' />
          <h2 className="text-xl font-bold tracking-widest text-zinc-900 dark:text-white">TRUSTLENS</h2>
          <p className="text-center text-zinc-450 dark:text-zinc-550 text-[10px] uppercase tracking-wider font-semibold mt-1">Academic Verification</p>
        </Link>

        <h2 className="text-xl font-bold tracking-widest text-center text-zinc-900 dark:text-white mb-6 uppercase">Đăng ký tài khoản</h2>
        {!publicRegistrationEnabled && (
          <div className="flex items-start gap-2 p-3 mb-4 text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>Tài khoản pilot do quản trị viên cấp. Đăng ký công khai hiện đang đóng.</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs font-semibold text-red-655 bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/50 rounded-lg animate-fade-in-down">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Họ và Tên</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-3.5 text-zinc-405" />
              <input 
                type="text" name="full_name" required
                onChange={handleChange}
                placeholder="VD: Nguyễn Văn A"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-855 dark:text-zinc-200 text-xs transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-3.5 text-zinc-405" />
              <input 
                type="email" name="email" required
                onChange={handleChange}
                placeholder="VD: user@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-855 dark:text-zinc-200 text-xs transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-405" />
              <input 
                type={showPassword ? 'text' : 'password'} name="password" required minLength={PASSWORD_MIN_LENGTH}
                onChange={handleChange}
                placeholder={`Mật khẩu (tối thiểu ${PASSWORD_MIN_LENGTH} ký tự)`}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-855 dark:text-zinc-200 text-xs transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-350"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-405" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} name="confirm_password" required minLength={PASSWORD_MIN_LENGTH}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-855 dark:text-zinc-200 text-xs transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-350"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading || !publicRegistrationEnabled}
            className="w-full py-2.5 mt-4 font-bold text-white bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 dark:text-black rounded-lg transition-colors flex justify-center items-center gap-1.5 shadow-sm text-xs disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Đăng ký ngay'}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-400 dark:text-zinc-500 text-xs font-semibold">
          Đã có tài khoản? <Link to="/login" className="text-zinc-900 dark:text-white font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
