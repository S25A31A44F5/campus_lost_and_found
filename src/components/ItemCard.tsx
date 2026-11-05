import React from 'react';
import { Item } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, Lock, Sparkles, MessageSquare } from 'lucide-react';
import { findMatchesForItem } from '../utils/matching';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onClaim?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, onClaim }) => {
  const { items } = useApp();
  const matches = findMatchesForItem(item, items, 50);
  const topMatch = matches[0];

  const isLost = item.type === 'lost';
  const hasClaims = item.claims.length > 0;

  return (
    <div 
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-campus-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image Thumbnail with Overlay Badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // Fallback image if broken
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 pointer-events-none" />

        {/* Type Badge (LOST / FOUND) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md ${
            isLost 
              ? 'bg-rose-600 text-white shadow-rose-600/30' 
              : 'bg-emerald-600 text-white shadow-emerald-600/30'
          }`}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 shadow-md rounded-full overflow-hidden">
          <StatusBadge status={item.status} size="sm" />
        </div>

        {/* Match highlight if top match exists */}
        {topMatch && item.status === 'open' && (
          <div className="absolute bottom-3 left-3 bg-amber-500/95 backdrop-blur-sm text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-amber-900" />
            <span>{topMatch.score}% Match Found</span>
          </div>
        )}

        {/* Color Pill */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
          {item.color}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="text-[11px] font-semibold text-campus-600 uppercase tracking-wider mb-1">
            {item.category}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-campus-600 transition-colors">
            {item.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Date Details */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item.date}</span>
            </div>

            {hasClaims && (
              <span className="flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                <MessageSquare className="w-3 h-3" />
                {item.claims.length} {item.claims.length === 1 ? 'claim' : 'claims'}
              </span>
            )}
          </div>
        </div>

        {/* Privacy Guard Notice & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400" title="Contact details are shielded. Private verification required.">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Private Proof Required</span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isLost && item.status === 'open' && onClaim && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClaim(item);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-campus-50 text-campus-700 hover:bg-campus-100 transition-colors"
              >
                Claim
              </button>
            )}
            <button
              onClick={() => onSelect(item)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-campus-600 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

