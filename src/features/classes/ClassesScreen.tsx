import { useState, useEffect } from 'react';
import { Users, Calendar, ChevronRight, BookOpen, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classService, Course } from '../../services/classService';

export default function ClassesScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [classes, setClasses] = useState<Course[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách lớp học:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    if (!newCode || !newName) return; 
    
    try {
      const newClass = await classService.createClass(newCode, newName);
      setClasses([...classes, newClass]); 
      setShowModal(false); 
      setNewCode(''); 
      setNewName('');
    } catch (error) {
      console.error("Lỗi khi tạo lớp học:", error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Danh sách lớp phụ trách</h2>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold mt-0.5">Chọn học phần để tiến hành nộp và duyệt tập tin báo cáo đồ án.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors"
        >
          + Thêm lớp học phần
        </button>
      </div>

      {/* DANH SÁCH THẺ (CARD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls, index) => (
          <div 
            key={index}
            onClick={() => {
              navigate('/upload', { state: { selectedClass: cls } });
            }}
            className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{cls.id}</div>
              <h3 className="text-sm font-bold text-zinc-805 dark:text-zinc-200 mb-6 transition-colors line-clamp-2">{cls.name}</h3>
            </div>
            
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-450 dark:text-zinc-500 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Users size={12} /> {cls.students} Sinh viên</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Hạn: {cls.date}</span>
              </div>
              <ChevronRight size={14} className="text-zinc-350 dark:text-zinc-605 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* BẢNG POPUP TỐI GIẢN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs" onClick={() => setShowModal(false)}></div>
          
          <div className="relative z-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-6 w-full max-w-md shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-150 dark:border-zinc-900 pb-3">
              <BookOpen size={16} className="text-zinc-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Thêm lớp học phần</h3>
            </div>
            
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Mã học phần</label>
                <input 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)} 
                  type="text" 
                  placeholder="VD: INT4050" 
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-bold text-zinc-850 dark:text-zinc-200 uppercase placeholder:font-normal placeholder:text-zinc-400 transition-colors text-xs" 
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Tên đồ án / môn học</label>
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)} 
                  type="text" 
                  placeholder="VD: Đồ án Tốt nghiệp" 
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 font-bold text-zinc-850 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors text-xs" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-150 dark:border-zinc-900">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 font-semibold text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleAddClass}
                disabled={!newCode || !newName}
                className="flex items-center gap-1 px-4 py-2 font-bold text-xs bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={12} /> Tạo lớp học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}