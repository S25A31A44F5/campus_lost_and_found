import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PERSONAS } from '../data/constants';
import { 
  Compass, 
  Search, 
  Sparkles, 
  LayoutDashboard, 
  ShieldAlert, 
  Bell, 
  PlusCircle, 
  Menu, 
  X, 
  CheckCheck,
  ChevronDown,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { getAllPotentialMatches } from '../utils/matching';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openReportModal: (initialType: 'lost' | 'found') => void;
  onSelectItem?: (itemId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  openReportModal,
  onSelectItem
}) => {
  const { 
    currentUser, 
    setCurrentUser, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    items,
    resetToSampleData 
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const potentialMatches = getAllPotentialMatches(items, 50);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'browse', label: 'Browse Items', icon: Search, badge: items.filter(i => i.status !== 'archived').length },
    { id: 'matches', label: 'Match Radar', icon: Sparkles, badge: potentialMatches.length > 0 ? potentialMatches.length : null, highlight: true },
    { id: 'dashboard', label: 'My Activity', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin Center', icon: ShieldAlert, adminOnly: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top micro-bar for Demo Notice & Persona Quick Switch */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-200">Campus Lost & Found Live Hub</span>
            <span className="hidden md:inline text-slate-400">• Official secure campus property exchange</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={resetToSampleData}
              className="text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white transition-colors"
              title="Reset data back to clean sample items and claims"
            >
              Reset Demo Data
            </button>
            <span className="text-slate-600">|</span>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 text-slate-200 hover:text-white font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
              >
                <span>Viewing as:</span>
                <span className="text-campus-300 font-semibold">{currentUser.name}</span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded">{currentUser.role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona (Demo Tool)
                  </div>
                  {DEMO_PERSONAS.map(persona => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setCurrentUser(persona);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                        currentUser.id === persona.id ? 'bg-campus-50/70 text-campus-900 font-semibold' : ''
                      }`}
                    >
                      <img 
                        src={persona.avatar} 
                        alt={persona.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate flex items-center justify-between">
                          <span>{persona.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            persona.role === 'Admin' ? 'bg-rose-100 text-rose-800' :
                            persona.role === 'Faculty' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {persona.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{persona.badge}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-campus-600 to-campus-400 flex items-center justify-center text-white shadow-md shadow-campus-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-campus-600 transition-colors">
                  Found on Campus
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-campus-100 text-campus-700 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Campus Lost & Found • Safe Desk Handoffs</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-campus-50 text-campus-700 font-semibold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-campus-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      link.highlight 
                        ? 'bg-amber-100 text-amber-800 animate-pulse' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Notifications */}
          <div className="flex items-center gap-2.5">
            {/* Quick Report Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => openReportModal('lost')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-rose-600" />
                <span>I Lost Something</span>
              </button>

              <button
                onClick={() => openReportModal('found')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20"
              >
                <PlusCircle className="w-4 h-4 text-emerald-100" />
                <span>I Found Something</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setShowNotifMenu(false)}
                >
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Campus Notifications</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {notifications.length}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-campus-600 hover:text-campus-800 font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.itemId && onSelectItem) {
                              onSelectItem(notif.itemId);
                              setShowNotifMenu(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                            !notif.read ? 'bg-campus-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 leading-tight">
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-campus-500 shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                            {notif.itemId && (
                              <span className="text-campus-600 font-medium flex items-center gap-0.5">
                                View Item <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 px-4 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setShowNotifMenu(false);
                      }}
                      className="text-xs text-campus-600 hover:text-campus-800 font-semibold"
                    >
                      View All in Activity Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {showMobileNav ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileNav && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                openReportModal('lost');
                setShowMobileNav(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
            >
              <PlusCircle className="w-4 h-4" />
              I Lost Something
            </button>
            <button
              onClick={() => {
                openReportModal('found');
                setShowMobileNav(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 text-white"
            >
              <PlusCircle className="w-4 h-4" />
              I Found Something
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setShowMobileNav(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-campus-50 text-campus-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

