import React, { useState } from 'react';
import { Item } from '../types';
import { getAllPotentialMatches } from '../utils/matching';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface MatchesViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  items,
  onSelectItem,
  onOpenReportModal
}) => {
  const [minScoreFilter, setMinScoreFilter] = useState<number>(40);
  const matches = getAllPotentialMatches(items, minScoreFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-campus-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus AI Match Radar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Automated Cross-Match Discoveries
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Our smart matching engine continuously pairs Lost reports with Found posts using category classification, 
            color similarity, location proximity, date delta, and keyword overlaps.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-200">Score Sensitivity:</span>
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl">
              <button
                onClick={() => setMinScoreFilter(40)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  minScoreFilter === 40 ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                All Matches (≥40%)
              </button>
              <button
                onClick={() => setMinScoreFilter(65)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  minScoreFilter === 65 ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                High Confidence (≥65%)
              </button>
              <button
                onClick={() => setMinScoreFilter(80)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  minScoreFilter === 80 ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                Near Certain (≥80%)
              </button>
            </div>
          </div>

          <div className="text-amber-200 font-semibold">
            {matches.length} {matches.length === 1 ? 'match pair' : 'match pairs'} discovered
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto text-amber-500">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">No matches above {minScoreFilter}% right now</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            As students and staff submit new lost or found reports, our engine automatically updates this radar.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setMinScoreFilter(40)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Lower Sensitivity to 40%
            </button>
            <button
              onClick={() => onOpenReportModal('lost')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-campus-600 hover:bg-campus-700 text-white"
            >
              Report an Item
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map(({ lostItem, foundItem, score, reasons }, idx) => (
            <div 
              key={`${lostItem.id}-${foundItem.id}-${idx}`}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all overflow-hidden p-6 space-y-6"
            >
              {/* Match Header with Score Gauge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0 shadow-md ${
                    score >= 80 ? 'bg-gradient-to-tr from-emerald-600 to-teal-500' :
                    score >= 60 ? 'bg-gradient-to-tr from-amber-500 to-yellow-500' : 'bg-gradient-to-tr from-campus-600 to-blue-400'
                  }`}>
                    <span className="text-lg leading-none">{score}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold opacity-90">Match</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-campus-600">
                        Pair #{idx + 1}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {score >= 80 ? 'High probability match' : 'Possible match candidate'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                      "{lostItem.title}" ⟷ "{foundItem.title}"
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectItem(foundItem)}
                    className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Inspect Found Item & Claim
                  </button>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Lost Item Card */}
                <div 
                  onClick={() => onSelectItem(lostItem)}
                  className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 hover:border-rose-400 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      Lost Item Report
                    </span>
                    <StatusBadge status={lostItem.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-3">
                    <img 
                      src={lostItem.imageUrl} 
                      alt={lostItem.title} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {lostItem.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {lostItem.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="font-medium">Color: {lostItem.color}</span>
                        <span>•</span>
                        <span>{lostItem.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-2 border-t border-rose-200/60">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{lostItem.location}</span>
                  </div>
                </div>

                {/* Found Item Card */}
                <div 
                  onClick={() => onSelectItem(foundItem)}
                  className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-400 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Found Item Log
                    </span>
                    <StatusBadge status={foundItem.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-3">
                    <img 
                      src={foundItem.imageUrl} 
                      alt={foundItem.title} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {foundItem.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {foundItem.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="font-medium">Color: {foundItem.color}</span>
                        <span>•</span>
                        <span>{foundItem.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-2 border-t border-emerald-200/60">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{foundItem.location}</span>
                  </div>
                </div>

              </div>

              {/* Explainable Score Breakdown Factors */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Explainable Match Breakdown ({score} / 100 points):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {reasons.map((r, rIdx) => (
                    <div 
                      key={rIdx} 
                      className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                        r.matched ? 'bg-white border-slate-200' : 'bg-slate-100/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${r.matched ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{r.label}</span>
                          <span className={`font-mono text-[11px] font-extrabold ${r.matched ? 'text-campus-600' : 'text-slate-400'}`}>
                            +{r.points} / {r.maxPoints} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {r.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
