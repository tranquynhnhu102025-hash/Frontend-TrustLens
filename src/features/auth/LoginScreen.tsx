import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import authService from '../../services/authService';

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('quynhnhu@nttu.edu.vn');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.access_token) {
        navigate('/classes');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="bg-white dark:bg-zinc-950 p-8 rounded-xl border border-zinc-200 dark:border-zinc-900 w-full max-w-sm shadow-sm">
        <Link to='/' className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold tracking-widest text-zinc-900 dark:text-white">TRUSTLENS</h2>
          <p className="text-center text-zinc-400 dark:text-zinc-550 text-[10px] uppercase tracking-wider font-semibold mt-1">Academic Verification</p>
        </Link>       
        
        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Tài khoản nội bộ</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-850 dark:text-zinc-200 text-sm transition-colors" 
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Mật khẩu bảo mật</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-medium text-zinc-850 dark:text-zinc-200 text-sm transition-colors" 
            />
          </div>        
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-650 dark:text-red-400 text-xs font-semibold rounded-lg text-center">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold py-2.5 rounded-lg transition-colors text-xs disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Đăng nhập hệ thống'}
          </button>
          
          <p className="text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-6">
            Chưa có tài khoản?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-zinc-900 dark:text-white font-bold hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}