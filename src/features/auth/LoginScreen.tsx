import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import authService from '../../services/authService';
import { isPublicRegistrationEnabled } from '../../config/authPolicy';
import { formatApiError } from '../../services/apiError';

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shouldShake, setShouldShake] = useState(false);
  const publicRegistrationEnabled = isPublicRegistrationEnabled();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.access_token) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(formatApiError(err, 'Đăng nhập thất bại. Vui lòng thử lại!'));
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 animate-fade-in">
      <div 
        className={`bg-white dark:bg-zinc-950 p-8 rounded-xl border border-zinc-200 dark:border-zinc-900 w-full max-w-sm shadow-md transition-all duration-300 ${
          shouldShake ? 'animate-shake border-red-300 dark:border-red-900' : ''
        }`}
      >
        <Link to='/' className="flex flex-col items-center mb-8">
          <img src="/public/Symbol/TrustLens_Symbol_Gray.svg" alt="trustlens-logo" className='h-15, w-15' />
          <h2 className="text-xl font-bold tracking-widest text-zinc-900 dark:text-white">TRUSTLENS</h2>
          <p className="text-center text-zinc-450 dark:text-zinc-550 text-[10px] uppercase tracking-wider font-semibold mt-1">Academic Verification</p>
        </Link>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Tài khoản nội bộ</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-3.5 text-zinc-405" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email nội bộ"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-850 dark:text-zinc-200 text-xs transition-colors" 
              />
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Mật khẩu bảo mật</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-405" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-850 dark:text-zinc-200 text-xs transition-colors" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-350"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>        
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/50 text-red-655 dark:text-red-400 text-xs font-semibold rounded-lg text-center animate-fade-in-down">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password}
            className="w-full flex justify-center items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold py-2.5 rounded-lg transition-all duration-200 active:scale-98 text-xs disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Đăng nhập hệ thống'}
          </button>
          
          {publicRegistrationEnabled ? (
            <p className="text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-6">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-zinc-900 dark:text-white font-bold hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p className="text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-6">
              Tài khoản pilot do quản trị viên cấp.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
