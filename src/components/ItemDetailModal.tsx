import React, { useState } from 'react';
import { Item } from '../types';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { findMatchesForItem } from '../utils/matching';
import { SAFE_HANDOFF_SPOTS } from '../data/constants';
import { 
  X, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Clock,
  KeyRound,
  AlertTriangle,
  Building,
  User,
  Share2
} from 'lucide-react';

interface ItemDetailModalProps {
  item: Item | null;
  onClose: () => void;
  onOpenReportModal?: (type: 'lost' | 'found') => void;
  onSelectOtherItem?: (item: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onSelectOtherItem
}) => {
  const { 
    currentUser, 
    items, 
    submitClaim, 
    approveClaim, 
    declineClaim, 
    markReturned, 
    flagItem,
    addToast 
  } = useApp();

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimProof, setClaimProof] = useState('');
  const [claimHandoffDesk, setClaimHandoffDesk] = useState(SAFE_HANDOFF_SPOTS[0].name);
  const [responseNotes, setResponseNotes] = useState<{ [claimId: string]: string }>({});
  const [flagReasonInput, setFlagReasonInput] = useState('');
  const [showFlagBox, setShowFlagBox] = useState(false);
  const [submittingClaim, setSubmittingClaim] = useState(false);

  if (!item) return null;

  const isPoster = currentUser.email.toLowerCase() === item.reporterEmail.toLowerCase() || currentUser.role === 'Admin';
  const isLost = item.type === 'lost';
  const hasUserClaimed = item.claims.some(c => c.claimantEmail.toLowerCase() === currentUser.email.toLowerCase());

  // Calculate suggested matches
  const matches = findMatchesForItem(item, items, 40);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimProof.trim()) {
      addToast('Please provide your private identifying detail.', 'error');
      return;
    }
    setSubmittingClaim(true);
    setTimeout(() => {
      submitClaim(item.id, claimProof, claimHandoffDesk);
      setShowClaimForm(false);
      setClaimProof('');
      setSubmittingClaim(false);
    }, 400);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Item share link copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header with Title and Close button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              isLost ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isLost ? 'Lost Item Report' : 'Found Item Report'}
            </span>
            <StatusBadge status={item.status} size="md" />
            {item.isFlagged && (
              <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                Flagged for Review
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Share Item"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Location Card */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg">
                Color: <span className="font-semibold">{item.color}</span>
              </div>
            </div>

            {/* Campus Location Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Building className="w-4 h-4 text-campus-600" />
                <span>Campus Location</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">{item.location}</div>
                  {item.locationDetails && (
                    <div className="text-slate-500 mt-0.5">{item.locationDetails}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 pt-2 border-t border-slate-200/60">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Date: <strong className="text-slate-800">{item.date}</strong></span>
              </div>
            </div>

            {/* Designated Safe Handoff Point */}
            <div className="p-4 rounded-2xl bg-campus-50/70 border border-campus-200 text-xs space-y-2">
              <div className="font-bold text-campus-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-campus-600" />
                <span>Designated Campus Safe Handoff</span>
              </div>
              <p className="text-campus-800 leading-relaxed">
                {item.safeHandoffPreference}
              </p>
              <div className="text-[11px] text-campus-600 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Monitored desk with ID verification & safe storage.
              </div>
            </div>

            {/* Reporter Profile (Masked for Privacy) */}
            <div className="p-3.5 rounded-xl bg-slate-100/70 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>Reported by: <strong>{isPoster ? `${item.reporterName} (You)` : `${item.reporterName} (${item.reporterRole})`}</strong></span>
              </div>
              <span className="text-[10px] text-slate-400">Email Hidden</span>
            </div>
          </div>

          {/* Right Column: Descriptions, Privacy Guard, Claims & Actions */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-bold text-campus-600 uppercase tracking-wider mb-1">
                {item.category}
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-snug">
                {item.title}
              </h2>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {item.description}
              </p>
            </div>

            {/* Privacy Shield Box */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Campus Privacy & Theft Prevention:</span>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Personal phone numbers and emails are never published. To claim an item, you must provide a private identifying detail that only the legitimate owner would know.
                </p>
              </div>
            </div>

            {/* Verification Prompt for Claimants */}
            {item.secretVerificationHint && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>{isLost ? "Poster's Identifying Prompt:" : "Finder's Verification Challenge:"}</span>
                </div>
                <p className="italic text-blue-800 font-medium pl-5">
                  "{item.secretVerificationHint}"
                </p>
                {isPoster && item.secretVerificationAnswer && (
                  <div className="mt-2 pt-2 border-t border-blue-200/60 text-[11px] text-blue-700">
                    <strong>Your private answer reference:</strong> {item.secretVerificationAnswer}
                  </div>
                )}
              </div>
            )}

            {/* POSTER VIEW: Manage Submitted Claims */}
            {isPoster && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>Private Claims Received</span>
                    <span className="bg-campus-100 text-campus-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                      {item.claims.length}
                    </span>
                  </h4>

                  {item.status !== 'returned' && item.claims.some(c => c.status === 'approved') && (
                    <button
                      onClick={() => markReturned(item.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as Returned!
                    </button>
                  )}
                </div>

                {item.claims.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                    No claims submitted yet. We’ll notify you when someone provides matching proof.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {item.claims.map(claim => {
                      const isClaimApproved = claim.status === 'approved';
                      const isClaimDeclined = claim.status === 'declined';
                      const isPending = claim.status === 'pending';

                      return (
                        <div 
                          key={claim.id} 
                          className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                            isClaimApproved 
                              ? 'bg-emerald-50/70 border-emerald-300' 
                              : isClaimDeclined
                              ? 'bg-slate-100/60 border-slate-200 opacity-60'
                              : 'bg-white border-slate-300 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-slate-900">
                              Claimant: {claim.claimantName} ({claim.claimantRole})
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isClaimApproved ? 'bg-emerald-200 text-emerald-800' :
                              isClaimDeclined ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {claim.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Claimant's Private Proof:
                            </div>
                            <p className="text-slate-800 font-medium">
                              "{claim.secretProof}"
                            </p>
                          </div>

                          {isClaimApproved && (
                            <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <KeyRound className="w-4 h-4 text-emerald-600" />
                                <span>Active Handoff PIN: <strong>{claim.handoffPin}</strong></span>
                              </div>
                              <p className="text-[11px] text-emerald-700">
                                Safe Exchange Point: {claim.handoffLocation}
                              </p>
                            </div>
                          )}

                          {isPending && (
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              <input
                                type="text"
                                placeholder="Optional note for claimant (e.g. Meet Friday at 2pm)"
                                value={responseNotes[claim.id] || ''}
                                onChange={(e) => setResponseNotes({ ...responseNotes, [claim.id]: e.target.value })}
                                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-campus-500"
                              />
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => declineClaim(item.id, claim.id, responseNotes[claim.id])}
                                  className="px-3 py-1.5 rounded-lg font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Decline Proof
                                </button>
                                <button
                                  onClick={() => approveClaim(item.id, claim.id, responseNotes[claim.id])}
                                  className="px-3.5 py-1.5 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Approve & Issue PIN
                                </button>
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

            {/* NON-POSTER ACTIONS: Submit Claim or Help */}
            {!isPoster && (
              <div className="pt-4 border-t border-slate-200">
                {item.status === 'returned' ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-sm">
                    🎉 This item has already been safely returned to its rightful owner!
                  </div>
                ) : hasUserClaimed ? (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>You have a claim submitted for this item</span>
                    </div>
                    <p className="text-blue-700">
                      Check your <strong className="text-blue-900">My Activity</strong> dashboard to track the poster's review status.
                    </p>
                  </div>
                ) : !showClaimForm ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!isLost ? (
                      <button
                        onClick={() => setShowClaimForm(true)}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-campus-600 hover:bg-campus-700 text-white shadow-md shadow-campus-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>This is Mine — Submit Private Claim</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowClaimForm(true)}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>I Found This Item — Notify Poster</span>
                      </button>
                    )}
                  </div>
                ) : (
                  /* Claim Form */
                  <form onSubmit={handleClaimSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3.5 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900">
                        {!isLost ? 'Submit Verification Proof' : 'Notify Owner You Found It'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowClaimForm(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Private Identifying Detail (Required):
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={claimProof}
                        onChange={(e) => setClaimProof(e.target.value)}
                        placeholder={
                          item.secretVerificationHint
                            ? `Answer the question: ${item.secretVerificationHint}`
                            : 'Describe stickers, engravings, contents, wallpapers, or marks not visible in the public photo...'
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-campus-500 text-xs"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        🔒 Only the person who posted this item will see this detail.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Preferred Campus Safe Pickup Spot:
                      </label>
                      <select
                        value={claimHandoffDesk}
                        onChange={(e) => setClaimHandoffDesk(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                      >
                        {SAFE_HANDOFF_SPOTS.map(spot => (
                          <option key={spot.id} value={spot.name}>
                            {spot.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowClaimForm(false)}
                        className="px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingClaim}
                        className="px-4 py-2 rounded-xl font-bold bg-campus-600 hover:bg-campus-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        {submittingClaim ? 'Submitting...' : 'Submit Private Claim'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Moderation / Flag actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">Item ID: {item.id}</span>
              <button
                onClick={() => setShowFlagBox(!showFlagBox)}
                className="hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px]"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Inappropriate Content</span>
              </button>
            </div>

            {showFlagBox && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-rose-900">Why are you flagging this item?</span>
                <input
                  type="text"
                  placeholder="Spam, prohibited item, harassment, fake report..."
                  value={flagReasonInput}
                  onChange={(e) => setFlagReasonInput(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-rose-300 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowFlagBox(false)}
                    className="px-2 py-1 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (flagReasonInput.trim()) {
                        flagItem(item.id, flagReasonInput);
                        setShowFlagBox(false);
                        setFlagReasonInput('');
                      }
                    }}
                    className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg"
                  >
                    Submit Flag
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Matches Section at Bottom */}
        {matches.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Campus Match Radar ({matches.length} possible {isLost ? 'found' : 'lost'} items)
                </h4>
                <p className="text-xs text-slate-500">
                  Calculated using category, color similarity, date proximity, and campus building.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matches.slice(0, 2).map(({ matchedWith, score }) => (
                <div 
                  key={matchedWith.id}
                  onClick={() => onSelectOtherItem && onSelectOtherItem(matchedWith)}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-campus-400 hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group"
                >
                  <img 
                    src={matchedWith.imageUrl} 
                    alt={matchedWith.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0" 
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">
                        {score}% Match
                      </span>
                      <span className="text-[10px] text-slate-400">{matchedWith.date}</span>
                    </div>
                    <div className="font-bold text-slate-900 truncate group-hover:text-campus-600">
                      {matchedWith.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {matchedWith.location}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-campus-600 font-semibold mt-1">
                      <span>Inspect Match</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

