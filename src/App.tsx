import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { MatchesView } from './components/MatchesView';
import { DashboardView } from './components/DashboardView';
import { AdminView } from './components/AdminView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ReportItemModal } from './components/ReportItemModal';
import { ToastContainer } from './components/ToastContainer';
import { Item, ItemType } from './types';
import { 
  Building2, 
  ShieldCheck, 
  ArrowUp
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { items, resetToSampleData } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<ItemType>('lost');
  const [browseSearchQuery, setBrowseSearchQuery] = useState<string | undefined>(undefined);
  const [browseTypeFilter, setBrowseTypeFilter] = useState<'all' | 'lost' | 'found'>('all');

  const handleOpenReportModal = (type: ItemType) => {
    setReportModalType(type);
    setReportModalOpen(true);
  };

  const handleNavigateBrowse = (searchQuery?: string, type?: 'all' | 'lost' | 'found') => {
    setBrowseSearchQuery(searchQuery);
    if (type) setBrowseTypeFilter(type);
    setCurrentTab('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemSelectById = (itemId: string) => {
    const found = items.find(i => i.id === itemId);
    if (found) {
      setSelectedItem(found);
    }
  };

  const handleItemCreated = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-campus-100 selection:text-campus-900">
      
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openReportModal={handleOpenReportModal}
        onSelectItem={handleItemSelectById}
      />

      {/* Main Views Container */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            items={items}
            onSelectItem={setSelectedItem}
            onOpenReportModal={handleOpenReportModal}
            onNavigateBrowse={handleNavigateBrowse}
            onNavigateMatches={() => {
              setCurrentTab('matches');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'browse' && (
          <BrowseView
            items={items}
            onSelectItem={setSelectedItem}
            onOpenReportModal={handleOpenReportModal}
            initialTypeFilter={browseTypeFilter}
            initialSearchQuery={browseSearchQuery}
          />
        )}

        {currentTab === 'matches' && (
          <MatchesView
            items={items}
            onSelectItem={setSelectedItem}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onSelectItem={setSelectedItem}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            onSelectItem={setSelectedItem}
          />
        )}
      </main>

      {/* Modals */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenReportModal={handleOpenReportModal}
        onSelectOtherItem={(item) => setSelectedItem(item)}
      />

      <ReportItemModal
        initialType={reportModalType}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onItemCreated={handleItemCreated}
      />

      {/* Toast Notifications Overlay */}
      <ToastContainer />

      {/* Campus Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-8 h-8 rounded-xl bg-campus-600 flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base tracking-tight">Found on Campus</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                The centralized campus lost-and-found hub designed for students, faculty, and staff. Safe, private, and verified.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected by Campus Public Safety</span>
              </div>
            </div>

            {/* Col 2: Fast Navigation */}
            <div className="space-y-2">
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Quick Navigation
              </div>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Home Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('browse'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Browse All Items
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('matches'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Match Radar
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    My Activity & Claims
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Campus Safety Admin Panel
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Safe Exchange Points */}
            <div className="space-y-2">
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Safe Campus Desks
              </div>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>Central Library Circulation Desk (8am - 11pm)</li>
                <li>Student Union Info Desk (7:30am - 9pm)</li>
                <li>Campus Public Safety HQ (24/7 Monitored)</li>
                <li>Engineering Tech Hub Help Bar (8:30am - 6pm)</li>
              </ul>
            </div>

            {/* Col 4: Safety & Demo reset */}
            <div className="space-y-3">
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Privacy & Data
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                🔒 Data is stored securely in your browser's persistent LocalStorage for demo reliability. No external tracking.
              </p>
              <div className="pt-2">
                <button
                  onClick={resetToSampleData}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-campus-300 font-semibold text-[11px] transition-colors border border-slate-700"
                >
                  Reset Demo Sample Data
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 Found on Campus. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Zero-Harassment Protocol</span>
              <span>•</span>
              <span>Verified Desk Custody</span>
              <span>•</span>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
