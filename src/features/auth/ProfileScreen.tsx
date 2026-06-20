import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, Shield, GraduationCap, Building2, Key, Bell, Check, Loader2 } from 'lucide-react';
import authService from '../../services/authService';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await authService.getMe();
        setUserInfo({
          fullName: data.full_name || data.fullName || 'Giảng viên',
          email: data.email || 'N/A',
          role: data.role === 'LECTURER' || data.role === 'lecturer' ? 'Giảng viên' : data.role === 'ADMIN' || data.role === 'admin' ? 'Quản trị viên' : (data.role || 'Giảng viên'),
          studentId: data.id ? data.id.substring(0, 8).toUpperCase() : 'N/A',
          university: 'Trường Đại học Nguyễn Tất Thành',
          faculty: 'Khoa Công nghệ Thông tin',
          major: 'Kỹ thuật Phần mềm',
          status: data.is_active !== false ? 'Đang hoạt động' : 'Tạm khóa'
        });
      } catch (e) {
        console.error("Không thể tải thông tin tài khoản:", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (loading || !userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={32} className="text-zinc-900 dark:text-white animate-spin" />
        <p className="text-zinc-550 dark:text-zinc-400 font-semibold text-xs">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-4 animate-fade-in space-y-6">
      {/* Tiêu đề trang */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Thông tin tài khoản</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 font-medium">Quản lý thông tin cá nhân và cấu hình quyền hạn trên hệ thống TrustLens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CỘT TRÁI: AVATAR & TÓM TẮT */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col items-center text-center h-fit">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-800 dark:text-zinc-200 text-3xl font-extrabold border border-zinc-200 dark:border-zinc-800">
              {userInfo.fullName.split(' ').pop()?.charAt(0)}
            </div>
            <span className="absolute bottom-0.5 right-0.5 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-955" title="Online"></span>
          </div>
          
          <h3 className="text-base font-bold text-zinc-800 dark:text-white">{userInfo.fullName}</h3>
          <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded mt-1.5 uppercase tracking-wider">{userInfo.role}</p>
          
          <div className="w-full border-t border-zinc-200 dark:border-zinc-900 my-5 pt-4 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Shield size={14} className="text-zinc-400 dark:text-zinc-500" />
              <span>Trạng thái: <strong className="text-green-600 dark:text-green-400 font-bold">{userInfo.status}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Building2 size={14} className="text-zinc-400 dark:text-zinc-500" />
              <span className="truncate">{userInfo.university}</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT THÔNG TIN & SETTINGS */}
        <div className="md:col-span-2 space-y-6">
          {/* Form Thông tin chi tiết */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
              <User size={16} className="text-zinc-400 dark:text-zinc-500" /> Hồ sơ học thuật
            </h4>

            {isSaved && (
              <div className="mb-5 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg flex items-center gap-2">
                <Check size={14} /> Cập nhật cấu hình tài khoản thành công!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Họ và Tên</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-550" />
                  <input type="text" value={userInfo.fullName} readOnly className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Email nội bộ</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-550" />
                  <input type="email" value={userInfo.email} readOnly className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Mã số định danh (ID)</label>
                <div className="relative">
                  <Shield size={14} className="absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-550" />
                  <input type="text" value={userInfo.studentId} readOnly className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Khoa quản lý</label>
                <div className="relative">
                  <GraduationCap size={14} className="absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-550" />
                  <input type="text" value={userInfo.faculty} readOnly className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Chuyên ngành học thuật</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-550" />
                  <input type="text" value={userInfo.major} readOnly className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          {/* Khu vực Tùy chỉnh hệ thống cấu hình nhanh */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
              <Key size={16} className="text-zinc-400 dark:text-zinc-550" /> Cấu hình bảo mật & Tùy chọn
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-lg border border-zinc-200 dark:border-zinc-900">
                <div className="flex items-center gap-2.5">
                  <Bell size={16} className="text-zinc-500 dark:text-zinc-400" />
                  <div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Thông báo kiểm duyệt</p>
                    <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">Gửi thông báo khi hệ thống hoàn tất phân tích tài liệu.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button onClick={() => navigate('/classes')} className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                  Quay lại
                </button>
                <button onClick={handleSave} className="px-4.5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-lg transition-colors">
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}