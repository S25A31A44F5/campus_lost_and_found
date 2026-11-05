import React, { useState, useMemo, useEffect } from 'react';
import { Item, FilterState } from '../types';
import { CATEGORIES, CAMPUS_BUILDINGS } from '../data/constants';
import { ItemCard } from './ItemCard';
import { StatusBadge } from './StatusBadge';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  LayoutGrid, 
  List, 
  Calendar, 
  Building, 
  Tag, 
  RotateCcw
} from 'lucide-react';

interface BrowseViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
  initialTypeFilter?: 'all' | 'lost' | 'found';
  initialSearchQuery?: string;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  items,
  onSelectItem,
  onOpenReportModal,
  initialTypeFilter = 'all',
  initialSearchQuery = ''
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearchQuery,
    type: initialTypeFilter,
    category: 'all',
    location: 'all',
    status: 'all',
    color: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync initial type filter or initial search query if changed
  useEffect(() => {
    if (initialTypeFilter) {
      setFilters(prev => ({ ...prev, type: initialTypeFilter }));
    }
  }, [initialTypeFilter]);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setFilters(prev => ({ ...prev, searchQuery: initialSearchQuery }));
    }
  }, [initialSearchQuery]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Exclude archived items unless specifically filtered
      if (item.status === 'archived' && filters.status !== 'archived') {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // Location filter
      if (filters.location !== 'all' && item.location !== filters.location) {
        return false;
      }

      // Color filter
      if (filters.color !== 'all' && !item.color.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const itemDate = new Date(item.date).getTime();
        const now = new Date().getTime();
        const diffDays = Math.round((now - itemDate) / (1000 * 60 * 60 * 24));

        if (filters.dateRange === 'today' && diffDays > 0) return false;
        if (filters.dateRange === '3days' && diffDays > 3) return false;
        if (filters.dateRange === 'week' && diffDays > 7) return false;
        if (filters.dateRange === 'month' && diffDays > 30) return false;
      }

      // Search Query (title, description, color, location, category)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery = 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.color.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        if (!matchesQuery) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [items, filters]);

  const activeFiltersCount = [
    filters.type !== 'all',
    filters.category !== 'all',
    filters.location !== 'all',
    filters.status !== 'all',
    filters.color !== 'all',
    filters.dateRange !== 'all',
    Boolean(filters.searchQuery)
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      type: 'all',
      category: 'all',
      location: 'all',
      status: 'all',
      color: 'all',
      dateRange: 'all',
      sortBy: 'newest'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Search */}
      <div className="bg-gradient-to-r from-campus-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-campus-500/20 text-campus-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>Campus Item Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Browse Lost & Found Items
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Search active campus reports, apply building and date filters, and discover potential matches safely.
          </p>
        </div>

        {/* Big Search Input */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by item name, color, building, or description (e.g. AirPods, Hydroflask, blue lanyard...)"
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-campus-400"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="sm:hidden flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 rounded-2xl text-xs font-bold text-white border border-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Type Toggle Pills & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.type === 'all' 
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items ({items.filter(i => i.status !== 'archived').length})
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, type: 'lost' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.type === 'lost' 
                ? 'bg-rose-600 text-white shadow-2xs' 
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Lost Items ({items.filter(i => i.type === 'lost' && i.status !== 'archived').length})
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, type: 'found' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.type === 'found' 
                ? 'bg-emerald-600 text-white shadow-2xs' 
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Found Items ({items.filter(i => i.type === 'found' && i.status !== 'archived').length})
          </button>
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Item Title (A-Z)</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Controls Row */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs ${
        showFiltersMobile ? 'block' : 'hidden sm:grid'
      }`}>
        {/* Category */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-campus-600" />
            <span>Category</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Building Location */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Building className="w-3 h-3 text-campus-600" />
            <span>Campus Location</span>
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
          >
            <option value="all">All Buildings</option>
            {CAMPUS_BUILDINGS.map(bldg => (
              <option key={bldg} value={bldg}>{bldg}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-campus-600" />
            <span>Status</span>
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open (Active)</option>
            <option value="claim_pending">Claim Pending</option>
            <option value="approved">Claim Approved</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-campus-600" />
            <span>Date Range</span>
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
          >
            <option value="all">Any Time</option>
            <option value="today">Today</option>
            <option value="3days">Past 3 Days</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold text-slate-500">Active filters:</span>
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-medium">
              Type: {filters.type.toUpperCase()}
              <button onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-medium">
              Category: {filters.category}
              <button onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.location !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-medium">
              Location: {filters.location}
              <button onClick={() => setFilters(prev => ({ ...prev, location: 'all' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-medium">
              Status: {filters.status}
              <button onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-medium">
              Date: {filters.dateRange}
              <button onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-medium">
              Query: "{filters.searchQuery}"
              <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-campus-600 hover:text-campus-800 font-bold ml-1 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <div>
          Showing <span className="text-slate-900 font-bold">{filteredItems.length}</span> campus {filteredItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Items Display: Grid or List */}
      {filteredItems.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">No matching campus items found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search terms, removing filters, or submit a new report if your item isn't listed yet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onOpenReportModal('lost')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-campus-600 hover:bg-campus-700 text-white transition-colors"
            >
              Post a Lost Report
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onClaim={onSelectItem}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-campus-300 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-20 h-20 rounded-xl object-cover shrink-0" 
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      item.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.type}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-[11px] font-semibold text-campus-600">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm hover:text-campus-600">
                    {item.title}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.date}
                    </span>
                    <span className="text-slate-400">• Color: {item.color}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-campus-600 transition-colors"
                >
                  View & Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

