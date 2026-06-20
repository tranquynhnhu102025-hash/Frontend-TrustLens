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
    <div className="w-full animate-fade-in max-w-5xl mx-auto mt-4 space-y-6">
      <div className="border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="text-zinc-500" size={20} /> Cài đặt hệ thống
        </h2>
        <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold mt-0.5">Tùy chỉnh giao diện, thông báo và các thông số bảo mật của TrustLens.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* MENU TAB BÊN TRÁI */}
        <div className="w-full md:w-56 shrink-0">
          <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 p-2 space-y-1 shadow-sm">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'general' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
            >
              <Globe size={14} /> Cài đặt chung
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'notifications' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
            >
              <Bell size={14} /> Thông báo
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'security' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
            >
              <Lock size={14} /> Bảo mật
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'appearance' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
            >
              <Palette size={14} /> Giao diện
            </button>
          </div>
        </div>

        {/* NỘI DUNG TƯƠNG ỨNG BÊN PHẢI */}
        <div className="flex-1">
          <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 p-5 md:p-6 shadow-sm">
            
            {/* THÔNG BÁO LƯU THÀNH CÔNG */}
            {isSaved && (
              <div className="mb-5 p-3 bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 font-bold rounded-lg flex items-center gap-2 text-xs animate-fade-in">
                <CheckCircle2 size={16} /> Cài đặt của bạn đã được lưu thành công!
              </div>
            )}

            {/* TAB: CÀI ĐẶT CHUNG */}
            {activeTab === 'general' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-150 dark:border-zinc-900 pb-3">Cài đặt chung</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Ngôn ngữ hệ thống</label>
                    <select className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-805 dark:text-zinc-200">
                      <option>Tiếng Việt (Mặc định)</option>
                      <option>English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Múi giờ</label>
                    <select className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-805 dark:text-zinc-200">
                      <option>(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                      <option>(UTC+00:00) Greenwich Mean Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: THÔNG BÁO */}
            {activeTab === 'notifications' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-150 dark:border-zinc-900 pb-3">Tùy chỉnh thông báo</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg border border-zinc-150 dark:border-zinc-900">
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Email báo cáo hoàn tất</p>
                      <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 mt-0.5">Gửi email khi hệ thống quét xong đồ án.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg border border-zinc-150 dark:border-zinc-900">
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Cảnh báo đạo văn mức độ cao</p>
                      <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 mt-0.5">Thông báo tức thì khi phát hiện tài liệu có Trust Score &lt; 50.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BẢO MẬT & GIAO DIỆN (Làm mô phỏng nhanh) */}
            {(activeTab === 'security' || activeTab === 'appearance') && (
              <div className="space-y-4 animate-fade-in text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-zinc-400 dark:text-zinc-550 rounded-lg mb-2">
                  {activeTab === 'security' ? <Lock size={20} /> : <Palette size={20} />}
                </div>
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Tính năng đang phát triển</h3>
                <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-550 max-w-xs mx-auto">Phần cấu hình này sẽ được cập nhật trong phiên bản TrustLens v2.0 sắp tới.</p>
              </div>
            )}

            {/* NÚT LƯU CHUNG */}
            <div className="mt-6 pt-4 border-t border-zinc-150 dark:border-zinc-900 flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <Save size={14} /> Lưu cấu hình
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}