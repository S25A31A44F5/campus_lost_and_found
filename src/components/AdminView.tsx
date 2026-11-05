import React, { useState } from 'react';
import { Item } from '../types';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { SAFE_HANDOFF_SPOTS } from '../data/constants';
import { 
  ShieldAlert, 
  Trash2, 
  Archive, 
  Flag, 
  CheckCircle2, 
  Search, 
  AlertTriangle, 
  RotateCcw,
  Building,
  Clock,
  Eye
} from 'lucide-react';

interface AdminViewProps {
  onSelectItem: (item: Item) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onSelectItem }) => {
  const { 
    items, 
    deleteItem, 
    archiveItem, 
    unflagItem, 
    flagItem, 
    resetToSampleData
  } = useApp();

  const [adminSearch, setAdminSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState<'all' | 'flagged' | 'archived' | 'open'>('all');

  // Metrics
  const totalItems = items.length;
  const flaggedCount = items.filter(i => i.isFlagged).length;
  const archivedCount = items.filter(i => i.status === 'archived').length;
  const returnedCount = items.filter(i => i.status === 'returned').length;
  const returnRate = totalItems > 0 ? Math.round((returnedCount / totalItems) * 100) : 0;

  // Filter items
  const displayedItems = items.filter(item => {
    if (adminFilter === 'flagged' && !item.isFlagged) return false;
    if (adminFilter === 'archived' && item.status !== 'archived') return false;
    if (adminFilter === 'open' && item.status !== 'open') return false;

    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.reporterName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Safety & Police Moderation Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Campus Lost & Found Administration
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Audit posts across campus, moderate flagged or prohibited submissions, coordinate custody at safety desks, and manage archiving.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetToSampleData}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Reload default sample dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-campus-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Database</span>
          <div className="text-2xl font-black text-slate-900">{totalItems}</div>
          <span className="text-[10px] text-slate-400">All campus records</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            <span>Flagged Posts</span>
          </span>
          <div className="text-2xl font-black text-rose-600">{flaggedCount}</div>
          <span className="text-[10px] text-rose-500">Requires moderation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Archived Items</span>
          <div className="text-2xl font-black text-slate-700">{archivedCount}</div>
          <span className="text-[10px] text-slate-400">&gt;30 day retention</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Successful Returns</span>
          <div className="text-2xl font-black text-emerald-600">{returnedCount}</div>
          <span className="text-[10px] text-emerald-600">Reunited with owner</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1 col-span-2 md:col-span-1">
          <span className="text-[11px] font-bold text-campus-600 uppercase tracking-wider block">Campus Return Rate</span>
          <div className="text-2xl font-black text-campus-600">{returnRate}%</div>
          <span className="text-[10px] text-campus-600">High efficiency hub</span>
        </div>
      </div>

      {/* Flagged Alert Banner if any flagged items exist */}
      {flaggedCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-950">
                {flaggedCount} item(s) flagged by students or staff
              </h4>
              <p className="text-xs text-rose-800">
                Review flagged submissions below and choose to either dismiss the flag or delete the inappropriate post.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminFilter('flagged')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shrink-0"
          >
            Filter Flagged Only
          </button>
        </div>
      )}

      {/* Moderation Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            placeholder="Search report title, reporter name, location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setAdminFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setAdminFilter('flagged')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminFilter === 'flagged' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Flagged ({flaggedCount})
          </button>
          <button
            onClick={() => setAdminFilter('open')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminFilter === 'open' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setAdminFilter('archived')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminFilter === 'archived' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>
      </div>

      {/* Moderation Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Item Details</th>
                <th className="p-4">Type & Status</th>
                <th className="p-4">Reporter & Date</th>
                <th className="p-4">Location</th>
                <th className="p-4">Private Claims</th>
                <th className="p-4 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No items match the current admin filters.
                  </td>
                </tr>
              ) : (
                displayedItems.map(item => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      item.isFlagged ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    {/* Item Details */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200" 
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-slate-900 truncate hover:text-campus-600 cursor-pointer" onClick={() => onSelectItem(item)}>
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            Cat: {item.category} • Color: {item.color}
                          </div>
                          {item.isFlagged && (
                            <div className="text-[10px] text-rose-600 font-bold mt-0.5 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Flag Reason: {item.flagReason || 'Reported inappropriate'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type & Status */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.type}
                        </span>
                        <div>
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                      </div>
                    </td>

                    {/* Reporter & Date */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-900">{item.reporterName}</div>
                        <div className="text-[11px] text-slate-400">{item.reporterRole}</div>
                        <div className="text-[10px] text-slate-400">{item.date}</div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4 text-slate-600">
                      <div className="max-w-[180px] truncate" title={item.location}>
                        {item.location}
                      </div>
                      {item.locationDetails && (
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.locationDetails}
                        </div>
                      )}
                    </td>

                    {/* Private Claims */}
                    <td className="p-4">
                      <span className="font-bold text-slate-700">
                        {item.claims.length} {item.claims.length === 1 ? 'claim' : 'claims'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Inspect Item"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {item.isFlagged ? (
                          <button
                            onClick={() => unflagItem(item.id)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Clear Flag"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => flagItem(item.id, 'Moderator flag')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Flag Item"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        )}

                        {item.status !== 'archived' && (
                          <button
                            onClick={() => archiveItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Archive Post"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Permanently remove "${item.title}" from campus lost & found?`)) {
                              deleteItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete / Remove Inappropriate Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campus Help Desks Storage Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-campus-600" />
            <h3 className="font-bold text-base text-slate-900">
              Campus Safe Storage Custody Locations
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Monitored by Student Life & Campus Safety
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {SAFE_HANDOFF_SPOTS.map(spot => (
            <div key={spot.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">{spot.name}</div>
              <div className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{spot.hours}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {spot.description}
              </p>
              <div className="pt-2 border-t border-slate-200/60 text-[10px] text-campus-700 font-semibold">
                {spot.recommendedFor}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
