import React, { useState } from 'react';
import { Item, Claim } from '../types';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { 
  FileText, 
  Inbox, 
  Bell, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  MapPin, 
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  onSelectItem: (item: Item) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectItem,
  onOpenReportModal
}) => {
  const { 
    currentUser, 
    items, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    approveClaim, 
    declineClaim, 
    markReturned 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'claims' | 'notifs'>('reports');
  const [responseNotes, setResponseNotes] = useState<{ [claimId: string]: string }>({});

  // 1. Items reported by current user
  const userItems = items.filter(
    i => i.reporterEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // 2. Claims made by current user across all items
  const userClaims: { item: Item; claim: Claim }[] = [];
  items.forEach(item => {
    item.claims.forEach(c => {
      if (c.claimantEmail.toLowerCase() === currentUser.email.toLowerCase()) {
        userClaims.push({ item, claim: c });
      }
    });
  });

  // 3. User notifications
  const userNotifs = notifications.filter(
    n => n.userId === currentUser.id || n.userId === currentUser.email
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-campus-500 shadow-md" 
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentUser.name}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                currentUser.role === 'Admin' ? 'bg-rose-100 text-rose-800' :
                currentUser.role === 'Faculty' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email} • {currentUser.badge}</p>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Verified Member</span>
            </div>
          </div>
        </div>

        {/* Quick Report CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenReportModal('lost')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            + Report Lost
          </button>
          <button
            onClick={() => onOpenReportModal('found')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            + Report Found
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Reported Items</span>
          <span className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.2 rounded-full">
            {userItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'claims' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>My Claims on Other Items</span>
          <span className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.2 rounded-full">
            {userClaims.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notifs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notifs' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Activity Notifications</span>
          <span className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.2 rounded-full">
            {userNotifs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: MY REPORTED ITEMS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {userItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">You haven’t posted any reports yet</h3>
              <p className="text-xs text-slate-500">
                Did you misplace something or find someone's belongings? Log a report to start tracking.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => onOpenReportModal('lost')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white"
                >
                  Report Lost
                </button>
                <button
                  onClick={() => onOpenReportModal('found')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white"
                >
                  Report Found
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userItems.map(item => {
                const isLost = item.type === 'lost';

                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-16 h-16 rounded-xl object-cover shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isLost ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.type}
                            </span>
                            <StatusBadge status={item.status} size="sm" />
                            <span className="text-xs text-slate-400">• {item.category}</span>
                          </div>
                          <h3 
                            onClick={() => onSelectItem(item)}
                            className="font-bold text-slate-900 text-base hover:text-campus-600 cursor-pointer"
                          >
                            {item.title}
                          </h3>
                          <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {item.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {item.status !== 'returned' && (
                          <button
                            onClick={() => markReturned(item.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Returned
                          </button>
                        )}
                        <button
                          onClick={() => onSelectItem(item)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-campus-600 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Claims Section for this Item */}
                    {item.claims.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">
                            Claim Verification Requests ({item.claims.length}):
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Review private proofs below to confirm rightful ownership
                          </span>
                        </div>

                        <div className="space-y-2">
                          {item.claims.map(claim => (
                            <div 
                              key={claim.id}
                              className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                                claim.status === 'approved' ? 'bg-emerald-50/70 border-emerald-300' :
                                claim.status === 'declined' ? 'bg-slate-100/70 border-slate-200 opacity-60' :
                                'bg-slate-50 border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-semibold text-slate-900">
                                  {claim.claimantName} ({claim.claimantRole})
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  claim.status === 'approved' ? 'bg-emerald-200 text-emerald-800' :
                                  claim.status === 'declined' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {claim.status.toUpperCase()}
                                </span>
                              </div>

                              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                  Submitted Private Proof:
                                </span>
                                <p className="text-slate-800 font-medium italic">
                                  "{claim.secretProof}"
                                </p>
                              </div>

                              {claim.status === 'approved' && (
                                <div className="p-2 bg-emerald-100/60 rounded-lg text-emerald-900 font-medium flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Handoff PIN: <strong>{claim.handoffPin}</strong></span>
                                  </div>
                                  <span className="text-[11px] text-emerald-800">
                                    Meeting at: {claim.handoffLocation}
                                  </span>
                                </div>
                              )}

                              {claim.status === 'pending' && (
                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <input 
                                    type="text" 
                                    placeholder="Optional note / feedback"
                                    value={responseNotes[claim.id] || ''}
                                    onChange={(e) => setResponseNotes({ ...responseNotes, [claim.id]: e.target.value })}
                                    className="text-xs p-1.5 rounded-lg border border-slate-200 flex-1 max-w-xs"
                                  />
                                  <button
                                    onClick={() => declineClaim(item.id, claim.id, responseNotes[claim.id])}
                                    className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => approveClaim(item.id, claim.id, responseNotes[claim.id])}
                                    className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
                                  >
                                    Approve Proof
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY CLAIMS ON OTHER ITEMS */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {userClaims.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-3">
              <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No active claims submitted</h3>
              <p className="text-xs text-slate-500">
                If you see an item that belongs to you on the campus board, submit a private claim with your identifying proof.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userClaims.map(({ item, claim }) => {
                const isApproved = claim.status === 'approved';
                const isDeclined = claim.status === 'declined';
                const isPending = claim.status === 'pending';

                return (
                  <div 
                    key={claim.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-16 h-16 rounded-xl object-cover shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Found Item Post
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isApproved ? 'bg-emerald-100 text-emerald-800' :
                              isDeclined ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              Your Claim: {claim.status.toUpperCase()}
                            </span>
                          </div>
                          <h3 
                            onClick={() => onSelectItem(item)}
                            className="font-bold text-slate-900 text-base hover:text-campus-600 cursor-pointer"
                          >
                            {item.title}
                          </h3>
                          <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                            <span>Found at: {item.location}</span>
                            <span>•</span>
                            <span>Date: {item.date}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectItem(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-campus-600 transition-colors self-end sm:self-center"
                      >
                        Inspect Listing
                      </button>
                    </div>

                    {/* What you submitted as proof */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                        Your Submitted Private Proof:
                      </span>
                      <p className="text-slate-800 font-medium italic">
                        "{claim.secretProof}"
                      </p>
                    </div>

                    {/* APPROVED: SAFE HANDOFF INSTRUCTIONS & PIN */}
                    {isApproved && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-emerald-950 flex items-center gap-2 text-sm">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <span>Claim Approved! Safe Campus Handoff Active</span>
                          </div>
                          <div className="font-mono text-base font-black px-3 py-1 bg-white rounded-lg border border-emerald-300 text-emerald-700">
                            PIN: {claim.handoffPin}
                          </div>
                        </div>

                        <p className="text-emerald-900 leading-relaxed">
                          The poster verified your proof! Your item is ready for pickup or exchange at the designated campus service point.
                        </p>

                        <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 space-y-1">
                          <div className="font-bold text-slate-900">
                            Safe Handoff Location: {claim.handoffLocation}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Bring your student ID card and quote your 4-digit PIN (<strong>{claim.handoffPin}</strong>) to the desk attendant.
                          </div>
                          {claim.posterResponseNote && (
                            <div className="text-[11px] text-campus-700 pt-1 font-medium">
                              Poster's note: "{claim.posterResponseNote}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DECLINED NOTICE */}
                    {isDeclined && (
                      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Proof Not Verified</span>
                        </div>
                        <p className="text-rose-800 text-[11px]">
                          The poster reviewed your submitted identifying details and was unable to confirm ownership.
                          {claim.posterResponseNote ? ` Poster's feedback: "${claim.posterResponseNote}"` : ''}
                        </p>
                      </div>
                    )}

                    {/* PENDING NOTICE */}
                    {isPending && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Awaiting poster review. You will receive an alert once they evaluate your proof.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === 'notifs' && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Campus Alerts Log</span>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-campus-600 hover:text-campus-800 font-semibold"
            >
              Mark all as read
            </button>
          </div>

          {userNotifs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No recent notifications for your account.
            </div>
          ) : (
            userNotifs.map(n => (
              <div 
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !n.read ? 'bg-campus-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-campus-500"></span>}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
