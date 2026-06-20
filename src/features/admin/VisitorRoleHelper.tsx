import { DoorOpen, Eye, LockKeyhole, ShieldCheck, UserPlus } from 'lucide-react';

export const VISITOR_ROLE_CRITERIA = [
  {
    code: 'V1',
    title: 'Truy cập công khai',
    description: 'Người vãng lai được xem landing, tính năng, tài liệu giới thiệu và liên hệ mà không cần tài khoản.',
    acceptance: 'Không gọi API nghiệp vụ và không cần JWT.',
  },
  {
    code: 'V2',
    title: 'Không chạm dữ liệu riêng tư',
    description: 'Không được xem lớp, assignment, submission, report, audit log hoặc cấu hình hệ thống.',
    acceptance: 'Mọi route nghiệp vụ vẫn bị ProtectedRoute chặn.',
  },
  {
    code: 'V3',
    title: 'Dùng thử có kiểm soát',
    description: 'Nếu mở demo sau MVP, dữ liệu phải là mẫu public hoặc sandbox, không trộn với dữ liệu giảng viên.',
    acceptance: 'Demo không ghi vào bảng production hoặc phải gắn scope riêng.',
  },
  {
    code: 'V4',
    title: 'Chuyển đổi thành tài khoản',
    description: 'Người vãng lai có thể đăng ký hoặc được admin cấp tài khoản để chuyển sang student/lecturer/admin.',
    acceptance: 'Sau khi login, quyền được lấy lại từ role chính thức.',
  },
];

const VISITOR_CAPABILITIES = [
  'Xem trang giới thiệu và tài liệu public',
  'Xem mô tả Trust Score và quy trình xử lý ở mức tổng quan',
  'Đăng ký hoặc liên hệ để được cấp tài khoản',
];

const VISITOR_BLOCKED_ACTIONS = [
  'Không upload file thật',
  'Không xem report/submission',
  'Không truy cập dashboard/admin',
  'Không gọi API cần Bearer JWT',
];

export default function VisitorRoleHelper() {
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm p-5 space-y-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
            <DoorOpen size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-100">
              Helper mở rộng role: Người vãng lai (Guest)
            </h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-450 mt-1 leading-relaxed max-w-3xl">
              Role này chứng minh hệ thống có thể tăng trưởng theo lớp quyền mới mà không phá vỡ RBAC hiện tại:
              public visitor chỉ xem nội dung giới thiệu, còn dữ liệu học thuật vẫn được bảo vệ bằng route guard và JWT.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 bg-zinc-50/70 dark:bg-zinc-900/30 px-3 py-2">
          <p className="text-[9px] uppercase tracking-wider font-black text-zinc-400">Role code</p>
          <p className="text-xs font-black text-zinc-850 dark:text-zinc-100">GUEST</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-green-150 dark:border-green-900/50 bg-green-50/25 dark:bg-green-950/10 p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xs mb-3">
            <Eye size={14} /> Được phép
          </div>
          <div className="space-y-2">
            {VISITOR_CAPABILITIES.map((item) => (
              <p key={item} className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-350">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-rose-150 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10 p-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs mb-3">
            <LockKeyhole size={14} /> Bị chặn
          </div>
          <div className="space-y-2">
            {VISITOR_BLOCKED_ACTIONS.map((item) => (
              <p key={item} className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-350">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {VISITOR_ROLE_CRITERIA.map((criterion) => (
          <div key={criterion.code} className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3 bg-zinc-50/50 dark:bg-zinc-900/25">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black text-zinc-500">{criterion.code}</span>
              <ShieldCheck size={13} className="text-zinc-400" />
            </div>
            <p className="text-xs font-bold text-zinc-850 dark:text-zinc-100 mt-2">{criterion.title}</p>
            <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-450 mt-1 leading-relaxed">
              {criterion.description}
            </p>
            <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-250 mt-2">
              Tiêu chí: {criterion.acceptance}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-zinc-150 dark:border-zinc-900 bg-zinc-50/60 dark:bg-zinc-900/25 p-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
        <UserPlus size={14} className="text-zinc-450 shrink-0" />
        Khi guest được cấp tài khoản, hệ thống chỉ cần đổi role sang student/lecturer/admin và dùng lại helper quyền hiện tại.
      </div>
    </div>
  );
}
