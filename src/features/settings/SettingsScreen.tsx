import { useState } from 'react';
import { 
  Settings as SettingsIcon, Bell, Lock, Globe, 
  Palette, Save, CheckCircle2 
} from 'lucide-react';

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  // Hiệu ứng lưu cài đặt giả lập
  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full animate-fade-in max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
          <SettingsIcon className="text-slate-600 animate-spin-slow" size={32} /> Cài đặt hệ thống
        </h2>
        <p className="text-slate-500 font-medium">Tùy chỉnh giao diện, thông báo và các thông số bảo mật của TrustLens.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* MENU TAB BÊN TRÁI */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 space-y-1">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'general' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Globe size={18} /> Cài đặt chung
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Bell size={18} /> Thông báo
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Lock size={18} /> Bảo mật
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'appearance' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Palette size={18} /> Giao diện
            </button>
          </div>
        </div>

        {/* NỘI DUNG TƯƠNG ỨNG BÊN PHẢI */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
            
            {/* THÔNG BÁO LƯU THÀNH CÔNG */}
            {isSaved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={20} /> Cài đặt của bạn đã được lưu thành công!
              </div>
            )}

            {/* TAB: CÀI ĐẶT CHUNG */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-black text-slate-800 mb-4 border-b border-slate-100 pb-4">Cài đặt chung (General)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ngôn ngữ hệ thống</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Tiếng Việt (Mặc định)</option>
                      <option>English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Múi giờ</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                      <option>(UTC+00:00) Greenwich Mean Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: THÔNG BÁO */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-black text-slate-800 mb-4 border-b border-slate-100 pb-4">Tùy chỉnh thông báo</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Email báo cáo hoàn tất</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">Gửi email khi hệ thống quét xong đồ án.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Cảnh báo đạo văn mức độ cao</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">Thông báo tức thì khi phát hiện tài liệu có Trust Score &lt; 50.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BẢO MẬT & GIAO DIỆN (Làm mô phỏng nhanh) */}
            {(activeTab === 'security' || activeTab === 'appearance') && (
              <div className="space-y-6 animate-fade-in text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 rounded-full mb-4">
                  {activeTab === 'security' ? <Lock size={32} /> : <Palette size={32} />}
                </div>
                <h3 className="text-xl font-black text-slate-800">Tính năng đang phát triển</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">Phần cấu hình này sẽ được cập nhật trong phiên bản TrustLens v2.0 sắp tới.</p>
              </div>
            )}

            {/* NÚT LƯU CHUNG */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-200"
              >
                <Save size={18} /> Lưu cấu hình
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}