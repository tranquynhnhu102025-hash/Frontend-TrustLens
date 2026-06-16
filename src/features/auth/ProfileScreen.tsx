import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, Shield, GraduationCap, Building2, Key, Bell, Check } from 'lucide-react';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Dữ liệu tài khoản demo chuẩn chỉnh hệ thống
  const [userInfo, setUserInfo] = useState({
    fullName: 'Trần Quỳnh Như',
    email: 'quynhnhu@ntt.edu.vn',
    role: 'Giảng viên / Kiểm duyệt viên',
    studentId: '2400008936',
    university: 'Trường Đại học Nguyễn Tất Thành',
    faculty: 'Khoa Công nghệ Thông tin',
    major: 'Kỹ thuật Phần mềm',
    status: 'Đang hoạt động'
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-4 animate-fade-in">
      {/* Tiêu đề trang */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Thông tin tài khoản</h2>
        <p className="text-slate-500 font-medium">Quản lý thông tin cá nhân và cấu hình quyền hạn trên hệ thống TrustLens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CỘT TRÁI: AVATAR & TÓM TẮT */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center h-fit">
          <div className="relative mb-4">
            <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
              {userInfo.fullName.split(' ').pop()?.charAt(0)}
            </div>
            <span className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white" title="Online"></span>
          </div>
          
          <h3 className="text-xl font-black text-slate-800">{userInfo.fullName}</h3>
          <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1.5">{userInfo.role}</p>
          
          <div className="w-full border-t border-slate-100 my-6 pt-4 text-left space-y-3.5">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Shield size={16} className="text-slate-400" />
              <span>Trạng thái: <strong className="text-green-600 font-bold">{userInfo.status}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Building2 size={16} className="text-slate-400" />
              <span className="truncate">{userInfo.university}</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT THÔNG TIN & SETTINGS */}
        <div className="md:col-span-2 space-y-6">
          {/* Form Thông tin chi tiết */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-600" /> Hồ sơ học thuật
            </h4>

            {isSaved && (
              <div className="mb-6 p-3.5 bg-green-50 border border-green-200 text-green-700 font-bold text-sm rounded-xl flex items-center gap-2">
                <Check size={18} /> Cập nhật cấu hình tài khoản thành công!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và Tên</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  <input type="text" value={userInfo.fullName} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email nội bộ</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  <input type="email" value={userInfo.email} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mã số định danh (ID)</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  <input type="text" value={userInfo.studentId} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Khoa quản lý</label>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  <input type="text" value={userInfo.faculty} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chuyên ngành học thuật</label>
                <div className="relative">
                  <BookOpen size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  <input type="text" value={userInfo.major} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          {/* Khu vực Tùy chỉnh hệ thống cấu hình nhanh */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Key size={20} className="text-blue-600" /> Cấu hình bảo mật & Tùy chọn
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Thông báo kiểm duyệt</p>
                    <p className="text-xs font-medium text-slate-400">Gửi thông báo khi hệ thống hoàn tất phân tích tài liệu.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => navigate('/classes')} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                  Quay lại
                </button>
                <button onClick={handleSave} className="px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-100 transition-all">
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