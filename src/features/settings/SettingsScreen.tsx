import { useState } from 'react';
import { 
  Settings as SettingsIcon, Bell, Lock, Globe, 
  Palette, Save, CheckCircle2, Eye, EyeOff, Key,
  Trash2, Monitor, Sun, Moon
} from 'lucide-react';

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  // States: Cài đặt chung & Thông báo
  const [language, setLanguage] = useState('Tiếng Việt (Mặc định)');
  const [timezone, setTimezone] = useState('(UTC+07:00) Bangkok, Hanoi, Jakarta');
  const [emailNotification, setEmailNotification] = useState(true);
  const [highPlagiarismWarning, setHighPlagiarismWarning] = useState(true);

  // States: Bảo mật (Đổi mật khẩu & API Keys)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [newKeyName, setNewKeyName] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Moodle Integration Key', key: 'tl_live_4f89d3a2e9b0c7a1f5e8d9c0b', createdAt: '2026-05-12' }
  ]);

  // States: Giao diện (Theme)
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'dark';
  });

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  // Hiệu ứng lưu cài đặt giả lập
  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("Vui lòng nhập đầy đủ các trường mật khẩu.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (passwords.new.length < 6) {
      alert("Mật khẩu mới phải dài từ 6 ký tự trở lên.");
      return;
    }
    alert("Đổi mật khẩu thành công! Hệ thống đã cập nhật mật khẩu mới của bạn.");
    setPasswords({ current: '', new: '', confirm: '' });
    handleSave();
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      alert("Vui lòng nhập tên khóa ứng dụng cần tích hợp.");
      return;
    }
    setIsGeneratingKey(true);
    setTimeout(() => {
      const generated = 'tl_live_' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const newKey = {
        id: `key-${Date.now()}`,
        name: newKeyName,
        key: generated,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setApiKeys(prev => [newKey, ...prev]);
      setNewKeyName('');
      setIsGeneratingKey(false);
      alert("Sinh API Key mới thành công!");
    }, 600);
  };

  const handleRevokeKey = (keyId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn thu hồi (vô hiệu hóa) API Key này không?")) return;
    setApiKeys(prev => prev.filter(k => k.id !== keyId));
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
          <div className="bg-white dark:bg-zinc-955 rounded-lg border border-zinc-200 dark:border-zinc-900 p-2 space-y-1 shadow-sm">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'general' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-550/5'}`}
            >
              <Globe size={14} /> Cài đặt chung
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'notifications' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-550/5'}`}
            >
              <Bell size={14} /> Thông báo
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'security' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-550/5'}`}
            >
              <Lock size={14} /> Bảo mật
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'appearance' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-550/5'}`}
            >
              <Palette size={14} /> Giao diện
            </button>
          </div>
        </div>

        {/* NỘI DUNG TƯƠNG ỨNG BÊN PHẢI */}
        <div className="flex-1">
          <div className="bg-white dark:bg-zinc-955 rounded-lg border border-zinc-200 dark:border-zinc-900 p-5 md:p-6 shadow-sm">
            
            {/* THÔNG BÁO LƯU THÀNH CÔNG */}
            {isSaved && (
              <div className="mb-5 p-3 bg-green-50/50 dark:bg-green-955/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 font-bold rounded-lg flex items-center gap-2 text-xs animate-fade-in">
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
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-205 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-805 dark:text-zinc-200"
                    >
                      <option>Tiếng Việt (Mặc định)</option>
                      <option>English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Múi giờ</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-205 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-805 dark:text-zinc-200"
                    >
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
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-205">Email báo cáo hoàn tất</p>
                      <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 mt-0.5">Gửi email khi hệ thống quét xong đồ án.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={emailNotification} 
                        onChange={(e) => setEmailNotification(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg border border-zinc-150 dark:border-zinc-900">
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-205">Cảnh báo đạo văn mức độ cao</p>
                      <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 mt-0.5">Thông báo tức thì khi phát hiện tài liệu có Trust Score &lt; 50.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={highPlagiarismWarning}
                        onChange={(e) => setHighPlagiarismWarning(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BẢO MẬT */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                {/* Đổi mật khẩu */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-150 dark:border-zinc-900 pb-3 flex items-center gap-1.5">
                    <Lock size={15} /> Đổi mật khẩu tài khoản
                  </h3>
                  <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 max-w-md">
                    <div className="space-y-1.5 relative">
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Mật khẩu hiện tại</label>
                      <div className="relative">
                        <input 
                          type={showPassword.current ? 'text' : 'password'}
                          required
                          value={passwords.current}
                          onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                          className="w-full pl-3 pr-10 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-205 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder:font-normal"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {showPassword.current ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Mật khẩu mới</label>
                      <div className="relative">
                        <input 
                          type={showPassword.new ? 'text' : 'password'}
                          required
                          value={passwords.new}
                          onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                          className="w-full pl-3 pr-10 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-205 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {showPassword.new ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                      <div className="relative">
                        <input 
                          type={showPassword.confirm ? 'text' : 'password'}
                          required
                          value={passwords.confirm}
                          onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                          className="w-full pl-3 pr-10 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-205 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-805 dark:text-zinc-205"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {showPassword.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2 rounded-lg transition-all active:scale-98 cursor-pointer shadow-sm"
                    >
                      Đổi mật khẩu
                    </button>
                  </form>
                </div>

                {/* Quản lý API Key tích hợp LMS */}
                <div className="space-y-4 pt-4 border-t border-zinc-150 dark:border-zinc-900">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white pb-1 flex items-center gap-1.5">
                    <Key size={15} /> Khóa tích hợp hệ thống (API Keys)
                  </h3>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed font-semibold">
                    Sinh mã token để tích hợp kết quả xác minh TrustLens vào các hệ thống quản lý học tập bên ngoài như Moodle, Canvas hoặc Google Classroom.
                  </p>

                  <form onSubmit={handleGenerateKey} className="flex gap-2 max-w-md">
                    <input 
                      type="text"
                      placeholder="Ví dụ: Tên hệ thống LMS của khoa..."
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-202 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                    />
                    <button
                      type="submit"
                      disabled={isGeneratingKey}
                      className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      {isGeneratingKey ? 'Đang tạo...' : 'Tạo khóa'}
                    </button>
                  </form>

                  <div className="space-y-2 max-w-2xl pt-2">
                    {apiKeys.length === 0 ? (
                      <div className="p-4 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg text-center text-zinc-400 dark:text-zinc-500 text-[10px] font-semibold">
                        Chưa có API Key nào được khởi tạo.
                      </div>
                    ) : (
                      apiKeys.map(k => (
                        <div key={k.id} className="flex justify-between items-center p-3 bg-zinc-50/50 dark:bg-zinc-900/25 border border-zinc-150 dark:border-zinc-900 rounded-lg">
                          <div>
                            <p className="text-xs font-bold text-zinc-805 dark:text-zinc-205">{k.name}</p>
                            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 font-mono mt-0.5 select-all">{k.key}</p>
                            <p className="text-[9px] text-zinc-400 dark:text-zinc-550 font-semibold mt-1">Khởi tạo ngày: {k.createdAt}</p>
                          </div>
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-1 text-zinc-400 hover:text-rose-500 dark:hover:text-rose-455 transition-colors rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                            title="Thu hồi khóa này"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GIAO DIỆN */}
            {activeTab === 'appearance' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-150 dark:border-zinc-900 pb-3 flex items-center gap-1.5">
                  <Palette size={15} /> Tùy chỉnh giao diện
                </h3>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Chế độ hiển thị (Theme Mode)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
                    {/* Theme Light */}
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                        selectedTheme === 'light'
                          ? 'bg-zinc-50 border-zinc-300 dark:border-zinc-700 shadow-xs'
                          : 'border-zinc-150 dark:border-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                        <Sun size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-white">Giao diện Sáng</p>
                        <p className="text-[9px] text-zinc-455 dark:text-zinc-500 mt-0.5">Tông màu dịu nhẹ cho ban ngày.</p>
                      </div>
                    </button>

                    {/* Theme Dark */}
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                        selectedTheme === 'dark'
                          ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-xs'
                          : 'border-zinc-150 dark:border-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-400 border border-zinc-900">
                        <Moon size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-805 dark:text-white">Giao diện Tối</p>
                        <p className="text-[9px] text-zinc-455 dark:text-zinc-500 mt-0.5">Đậm chất tối giản và tiết kiệm pin.</p>
                      </div>
                    </button>

                    {/* Theme System */}
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                        selectedTheme === 'system'
                          ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-xs'
                          : 'border-zinc-150 dark:border-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-550">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-850 dark:text-white">Theo hệ thống</p>
                        <p className="text-[9px] text-zinc-455 dark:text-zinc-500 mt-0.5">Đồng bộ tự động theo thiết bị.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NÚT LƯU CHUNG */}
            {activeTab !== 'security' && (
              <div className="mt-6 pt-4 border-t border-zinc-150 dark:border-zinc-900 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Save size={14} /> Lưu cấu hình
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}