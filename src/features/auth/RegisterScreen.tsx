import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gom tất cả dữ liệu vào 1 object cho dễ quản lý
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '', // Mã số SV hoặc GV
    role: 'student',
    faculty: 'Khoa Công nghệ Thông tin',
    major: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    // Kiểm tra sơ bộ
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (!formData.email.includes('@ntt.edu.vn') && !formData.email.includes('@student.ntt.edu.vn')) {
      setError('Vui lòng sử dụng email do nhà trường cấp (@ntt.edu.vn)');
      return;
    }

    setError('');
    setLoading(true);
    
    // Giả lập xử lý đăng ký
    setTimeout(() => {
      setLoading(false);
      alert('Đăng ký tài khoản thành công! Vui lòng chờ Admin duyệt.');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4 animate-fade-in bg-slate-50">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-3xl border border-slate-100 relative">
        
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 font-bold text-sm"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <UserPlus size={36} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Tạo tài khoản học thuật</h2>
          <p className="text-slate-500 font-medium text-center">
            Điền đầy đủ thông tin để tham gia hệ thống kiểm duyệt TrustLens
          </p>
        </div>       

        {error && (
          <div className="mb-6 p-3 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl border border-rose-100 flex items-center justify-center gap-2">
            <ShieldCheck size={18} /> {error}
          </div>
        )}
        
        {/* FORM ĐĂNG KÝ CHI TIẾT (LƯỚI 2 CỘT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          
          {/* Hàng 1 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Họ và Tên đầy đủ</label>
            <input 
              name="fullName" value={formData.fullName} onChange={handleChange}
              type="text" placeholder="VD: Trần Quỳnh Như"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Hàng 2 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Vai trò trong trường</label>
            <select 
              name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all"
            >
              <option value="student">Sinh viên</option>
              <option value="lecturer">Giảng viên / Kiểm duyệt viên</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Mã số định danh (MSSV/MSGV)</label>
            <input 
              name="idNumber" value={formData.idNumber} onChange={handleChange}
              type="text" placeholder="VD: 2400008936"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all uppercase" 
            />
          </div>

          {/* Hàng 3 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Khoa trực thuộc</label>
            <select 
              name="faculty" value={formData.faculty} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all"
            >
              <option>Khoa Công nghệ Thông tin</option>
              <option>Khoa Kinh tế Quản trị</option>
              <option>Khoa Ngoại ngữ</option>
              <option>Khoa Dược</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Chuyên ngành</label>
            <input 
              name="major" value={formData.major} onChange={handleChange}
              type="text" placeholder="VD: Kỹ thuật phần mềm"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Hàng 4 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email học thuật</label>
            <input 
              name="email" value={formData.email} onChange={handleChange}
              type="email" placeholder="quynhnhu@ntt.edu.vn"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Số điện thoại liên hệ</label>
            <input 
              name="phone" value={formData.phone} onChange={handleChange}
              type="tel" placeholder="0909 xxx xxx"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Hàng 5 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Mật khẩu bảo mật</label>
            <input 
              name="password" value={formData.password} onChange={handleChange}
              type="password" placeholder="Tối thiểu 8 ký tự"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu</label>
            <input 
              name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              type="password" placeholder="Nhập lại mật khẩu"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>
        </div>

        <button 
          onClick={handleRegister}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 text-lg"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : 'Hoàn tất đăng ký tài khoản'}
        </button>

      </div>
    </div>
  );
}