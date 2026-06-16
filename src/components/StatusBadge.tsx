import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, string> = {
    Good: "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1",
    Review: "bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1",
    Risk: "bg-rose-50 text-rose-700 border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1"
  };
  
  const icons: Record<string, React.ReactNode> = {
    Good: <CheckCircle2 size={12} className="text-emerald-500" />,
    Review: <AlertTriangle size={12} className="text-amber-500" />,
    Risk: <XCircle size={12} className="text-rose-500" />
  };

  return (
    <span className={configs[status] || configs.Review}>
      {icons[status]} {status}
    </span>
  );
}