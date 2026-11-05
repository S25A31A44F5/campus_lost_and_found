import React from 'react';
import { ItemStatus } from '../types';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: ItemStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  switch (status) {
    case 'open':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Open
        </span>
      );
    case 'claim_pending':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Claim Pending
        </span>
      );
    case 'approved':
      return (
        <span className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses[size]}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          Claim Approved
        </span>
      );
    case 'declined':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses[size]}`}>
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          Claim Declined
        </span>
      );
    case 'returned':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Returned
        </span>
      );
    case 'archived':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses[size]}`}>
          <Archive className="w-3.5 h-3.5 text-slate-400" />
          Archived
        </span>
      );
    default:
      return null;
  }
};

