import React from 'react';
import { Item } from '../types';
import { ItemCard } from './ItemCard';
import { SAFE_HANDOFF_SPOTS } from '../data/constants';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Lock, 
  Clock, 
  ArrowRight,
  HelpCircle,
  Building,
  HeartHandshake,
  Sparkles
} from 'lucide-react';

interface HomeViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
  onNavigateBrowse: (searchQuery?: string, type?: 'all' | 'lost' | 'found') => void;
  onNavigateMatches: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  onSelectItem,
  onOpenReportModal,
  onNavigateBrowse,
  onNavigateMatches
}) => {
  const [quickSearch, setQuickSearch] = React.useState('');

  const activeItems = items.filter(i => i.status !== 'archived');
  const lostCount = activeItems.filter(i => i.type === 'lost').length;
  const foundCount = activeItems.filter(i => i.type === 'found').length;
  const returnedCount = items.filter(i => i.status === 'returned').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigateBrowse(quickSearch.trim());
    } else {
      onNavigateBrowse();
    }
  };

  const popularPills = ['AirPods', 'Student ID', 'Hydro Flask', 'Keys', 'Backpack', 'Calculator', 'Jacket'];

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-campus-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-campus-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-campus-500/20 text-campus-300 border border-campus-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official University Safe Return Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Lost it? Found it? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-300 via-sky-200 to-emerald-300">
              Let’s get it back where it belongs.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The safe, verified way for campus students and faculty to report missing belongings, 
            discover instant matches, and coordinate secure handoffs at campus desks.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="What did you lose or find? (e.g., AirPods, TI-84, keys, jacket...)"
                className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-bold transition-all shadow-md shrink-0"
              >
                Search Campus
              </button>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-400">Common:</span>
              {popularPills.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onNavigateBrowse(tag)}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* TWO PRIMARY ACTIONS: I LOST / I FOUND */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* I Lost Card */}
            <div 
              onClick={() => onOpenReportModal('lost')}
              className="group p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-800 border-2 border-rose-500/40 hover:border-rose-400 transition-all text-left cursor-pointer shadow-lg hover:shadow-rose-500/10 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-800">
                  {lostCount} Active Reports
                </span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
                I Lost Something
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Report your lost item in 60 seconds. Our campus matching radar alerts you the moment a matching item is logged.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-400">
                <span>Start Lost Report</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* I Found Card */}
            <div 
              onClick={() => onOpenReportModal('found')}
              className="group p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-800 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all text-left cursor-pointer shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                  {foundCount} In Custody
                </span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                I Found Something
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Found an item on campus? Post it safely without giving out personal info. Require private proof before handing it over.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-400">
                <span>Turn in Found Item</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Campus Live Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{items.length}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Campus Reports Logged</div>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{returnedCount}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Safely Returned</div>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-campus-600">{foundCount}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Awaiting Owners</div>
          </div>

          <div className="space-y-1 border-t md:border-t-0 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">4 Desks</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Safe Pickup Points</div>
          </div>
        </div>
      </section>

      {/* How Safe Campus Handoff Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-campus-600 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Built For Campus Safety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How Found on Campus Keeps You Protected
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            We eliminate awkward meetups, public phone numbers, and false claims with a 3-step security verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden group hover:border-campus-400 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-campus-50 text-campus-600 font-black text-base flex items-center justify-center border border-campus-200">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-campus-600" />
              <span>Zero Public Contact Info</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your email, phone number, and student ID are never shown on listings. All matching and communication happens through shielded campus channels.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden group hover:border-campus-400 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 font-black text-base flex items-center justify-center border border-amber-200">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Private Verification Proof</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To claim an item, the claimant must state a hidden detail only the real owner knows (e.g. lock screen wallpaper, engraving, hidden sticker).
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden group hover:border-campus-400 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-base flex items-center justify-center border border-emerald-200">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Desk Exchange</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Handoffs occur at designated campus service desks with staff oversight. Approved claimants receive a secure 4-digit verification PIN.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Items Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-campus-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Recent Activity</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Latest Campus Listings
            </h2>
            <p className="text-xs text-slate-500">
              Check if someone found your missing item today or claim items waiting in storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateMatches}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Match Radar</span>
            </button>
            <button
              onClick={() => onNavigateBrowse(undefined, 'all')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-campus-700 bg-campus-50 hover:bg-campus-100 transition-colors flex items-center gap-1.5"
            >
              <span>View All ({activeItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeItems.slice(0, 4).map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onClaim={onSelectItem}
            />
          ))}
        </div>
      </section>

      {/* Campus Safe Handoff Desks Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Building className="w-3.5 h-3.5" />
              <span>Verified Campus Drop-off Locations</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Official Safe Exchange Points
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
              Never meet in private or secluded areas. The university provides staffed desks with video surveillance, temporary lockboxes, and student ID checks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {SAFE_HANDOFF_SPOTS.map(spot => (
              <div 
                key={spot.id} 
                className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-2 text-xs"
              >
                <div className="font-bold text-white text-sm line-clamp-1">
                  {spot.name.split('—')[0]}
                </div>
                <div className="text-campus-300 font-medium text-[11px] line-clamp-1">
                  {spot.name.split('—')[1] || spot.name}
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1 pt-1 border-t border-slate-700">
                  <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{spot.hours}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                  {spot.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
