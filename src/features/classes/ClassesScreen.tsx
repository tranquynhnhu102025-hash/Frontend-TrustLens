import { useState, useEffect } from 'react';
import { Users, Calendar, ChevronRight, BookOpen, Save, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classService, Course } from '../../services/classService';

export default function ClassesScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState<Course[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [editingClass, setEditingClass] = useState<Course | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editTerm, setEditTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await classService.getClasses();
        setClasses(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách lớp học:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      setMounted(true);
    }
  }, [classes]);

  const handleAddClass = async () => {
    if (!newCode || !newName) return;

    try {
      const newClass = await classService.createClass(newCode, newName);
      setClasses((prev) => [...prev, newClass]);
      setShowModal(false);
      setNewCode('');
      setNewName('');
    } catch (error) {
      console.error('Lỗi khi tạo lớp học:', error);
    }
  };

  const openEditModal = (cls: Course) => {
    setEditingClass(cls);
    setEditCode(cls.id || '');
    setEditName(cls.name || '');
    setEditTerm(cls.term_name || '');
  };

  const handleUpdateClass = async () => {
    if (!editingClass || !editCode.trim() || !editName.trim()) return;

    try {
      const updatedClass = await classService.updateClass(editingClass.class_uuid || editingClass.id, {
        class_code: editCode.trim().toUpperCase(),
        name: editName.trim(),
        term_name: editTerm.trim() || null,
      });

      setClasses((prev) => prev.map((cls) => {
        if (cls.id !== editingClass.id && cls.class_uuid !== editingClass.class_uuid) {
          return cls;
        }
        return {
          ...cls,
          ...updatedClass,
          assignment_id: cls.assignment_id,
          students: cls.students,
        };
      }));
      setEditingClass(null);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật lớp học:', error);
      alert(error.response?.data?.message || 'Không thể cập nhật lớp học phần.');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Danh sách lớp phụ trách</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold mt-0.5">
            Chọn học phần để tiến hành nộp và duyệt tập tin báo cáo đồ án.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-98"
        >
          + Thêm lớp học phần
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-4 animate-pulse">
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded mb-6"></div>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex justify-between">
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-905 rounded-xl border border-zinc-200 dark:border-zinc-900 p-12 text-center shadow-sm max-w-lg mx-auto mt-10 animate-scale-up">
          <BookOpen className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4" size={40} />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5">Chưa có lớp học phần nào</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed mb-6">
            Bạn chưa phụ trách lớp học phần nào. Bấm nút bên dưới hoặc phía trên để bắt đầu thêm lớp mới.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            + Thêm lớp học phần
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls, index) => (
            <div
              key={cls.id || index}
              onClick={() => navigate(`/class/${cls.id}`)}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={`bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm cursor-pointer group flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{cls.id}</div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openEditModal(cls);
                    }}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    title="Chỉnh sửa lớp học phần"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-6 transition-colors line-clamp-2">{cls.name}</h3>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Users size={12} /> {cls.students} Sinh viên</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> Hạn: {cls.date}</span>
                </div>
                <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs animate-fade-in-backdrop"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative z-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg animate-scale-up">
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
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 font-bold text-zinc-850 dark:text-zinc-200 uppercase placeholder:font-normal placeholder:text-zinc-400 transition-colors text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Tên đồ án / môn học</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  placeholder="VD: Đồ án Tốt nghiệp"
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 font-bold text-zinc-850 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors text-xs"
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

      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs animate-fade-in-backdrop"
            onClick={() => setEditingClass(null)}
          ></div>

          <div className="relative z-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg animate-scale-up">
            <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-150 dark:border-zinc-900 pb-3">
              <Pencil size={16} className="text-zinc-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Chỉnh sửa lớp học phần</h3>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Mã lớp học phần</label>
                <input
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 font-bold text-zinc-850 dark:text-zinc-200 uppercase text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Tên lớp / môn học</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 font-bold text-zinc-850 dark:text-zinc-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Học kỳ / ghi chú thời gian</label>
                <input
                  value={editTerm}
                  onChange={(e) => setEditTerm(e.target.value)}
                  type="text"
                  placeholder="VD: HK2 2025-2026"
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 font-bold text-zinc-850 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-150 dark:border-zinc-900">
              <button
                onClick={() => setEditingClass(null)}
                className="px-4 py-2 font-semibold text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleUpdateClass}
                disabled={!editCode.trim() || !editName.trim()}
                className="flex items-center gap-1 px-4 py-2 font-bold text-xs bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={12} /> Lưu lớp học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
