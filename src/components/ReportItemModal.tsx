import React, { useState } from 'react';
import { ItemType, Category, CampusBuilding } from '../types';
import { CATEGORIES, CAMPUS_BUILDINGS, COMMON_COLORS, SAFE_HANDOFF_SPOTS, PRESET_PHOTOS } from '../data/constants';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Image as ImageIcon,
  MapPin
} from 'lucide-react';

interface ReportItemModalProps {
  initialType?: ItemType;
  isOpen: boolean;
  onClose: () => void;
  onItemCreated?: (itemId: string) => void;
}

export const ReportItemModal: React.FC<ReportItemModalProps> = ({
  initialType = 'lost',
  isOpen,
  onClose,
  onItemCreated
}) => {
  const { currentUser, addItem, addToast } = useApp();

  const [type, setType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [color, setColor] = useState(COMMON_COLORS[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<CampusBuilding>(CAMPUS_BUILDINGS[0]);
  const [locationDetails, setLocationDetails] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [secretVerificationHint, setSecretVerificationHint] = useState('');
  const [secretVerificationAnswer, setSecretVerificationAnswer] = useState('');
  const [safeHandoffPreference, setSafeHandoffPreference] = useState(SAFE_HANDOFF_SPOTS[0].name);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPresetGallery, setShowPresetGallery] = useState(false);

  // Sync initial type when opened
  React.useEffect(() => {
    setType(initialType);
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Please upload an image smaller than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          addToast('Image uploaded successfully!', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'Item title is required';
    if (!description.trim()) errs.description = 'Please provide a clear description';
    if (!date) errs.date = 'Date is required';
    if (!imageUrl) errs.imageUrl = 'Please select or upload a photo';
    if (!secretVerificationHint.trim()) {
      errs.secretVerificationHint = type === 'found'
        ? 'Please specify a verification challenge question for claimants'
        : 'Please specify a secret identifying detail to verify ownership';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const createdItem = addItem({
        type,
        title: title.trim(),
        category,
        color,
        description: description.trim(),
        location,
        locationDetails: locationDetails.trim() || undefined,
        date,
        imageUrl,
        reporterName: currentUser.name,
        reporterEmail: currentUser.email,
        reporterRole: currentUser.role,
        secretVerificationHint: secretVerificationHint.trim(),
        secretVerificationAnswer: secretVerificationAnswer.trim() || undefined,
        safeHandoffPreference
      });

      setIsSubmitting(false);
      onClose();
      if (onItemCreated) {
        onItemCreated(createdItem.id);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>{type === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Campus Hub
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill out the details below. Our automated radar will cross-match your item across campus.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Action Selector: LOST vs FOUND switch */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'lost' 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-200"></span>
              I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'found' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
              I Found Something
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Essential details */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Item Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === 'lost' ? 'e.g. Apple AirPods Pro (2nd Gen) in Clear Case' : 'e.g. Blue Hydro Flask with Stickers'}
                  className={`w-full p-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-campus-500 ${
                    errors.title ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-campus-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Color <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-campus-500"
                  >
                    {COMMON_COLORS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Building <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as CampusBuilding)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-campus-500"
                  >
                    {CAMPUS_BUILDINGS.map(bldg => (
                      <option key={bldg} value={bldg}>{bldg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Room / Spot (Optional)
                  </label>
                  <input
                    type="text"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder="e.g. 2nd Floor Silent Study Desk #14"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-campus-500"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date {type === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-campus-500"
                  />
                  <button
                    type="button"
                    onClick={() => setDate(new Date().toISOString().split('T')[0])}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe general appearance, brand, condition, or context. (Do not include private contact info or unique secret marks here!)"
                  className={`w-full p-2.5 rounded-xl border text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-campus-500 ${
                    errors.description ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
              </div>

              {/* Private Secret Verification Hint (CRITICAL REQUIREMENT) */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>
                    {type === 'found' ? 'Claimant Verification Challenge (Kept Private)' : 'Private Distinguishing Proof'}
                  </span>
                </div>

                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {type === 'found' 
                    ? 'Ask claimants a question only the true owner can answer before you hand it over.' 
                    : 'List a secret detail (e.g. wallpaper photo, engraving, hidden mark) that proves you are the genuine owner.'}
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    {type === 'found' ? 'Question to ask claimant:' : 'Your secret identifying hint:'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={secretVerificationHint}
                    onChange={(e) => setSecretVerificationHint(e.target.value)}
                    placeholder={
                      type === 'found'
                        ? 'e.g. What specific sticker is on the laptop lid?'
                        : 'e.g. Bluetooth device name shows my initials / Small cat sticker inside'
                    }
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.secretVerificationHint && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.secretVerificationHint}</p>
                  )}
                </div>

                {type === 'found' && (
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Expected Answer (Private Reference for you):
                    </label>
                    <input
                      type="text"
                      value={secretVerificationAnswer}
                      onChange={(e) => setSecretVerificationAnswer(e.target.value)}
                      placeholder="e.g. NASA sticker and Hackathon 2025 sticker"
                      className="w-full p-2 rounded-xl border border-amber-200 bg-white text-xs font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Safe Campus Handoff Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-campus-600" />
                  <span>Preferred Safe Campus Exchange Desk:</span>
                </label>
                <select
                  value={safeHandoffPreference}
                  onChange={(e) => setSafeHandoffPreference(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-campus-500"
                >
                  {SAFE_HANDOFF_SPOTS.map(spot => (
                    <option key={spot.id} value={spot.name}>
                      {spot.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Exchanges happen safely at verified campus service points with student staff oversight.
                </p>
              </div>

            </div>

            {/* Right Column: Photo Upload & Preset Gallery & Live Preview */}
            <div className="md:col-span-5 space-y-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-campus-600" />
                    <span>Item Photo</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPresetGallery(!showPresetGallery)}
                    className="text-[11px] font-bold text-campus-600 hover:text-campus-800"
                  >
                    {showPresetGallery ? 'Hide Presets' : 'Choose Campus Preset Photo'}
                  </button>
                </div>

                {/* Main Preview Box */}
                <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 relative group">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Upload Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-xs font-medium">No image selected</span>
                    </div>
                  )}

                  {/* Upload overlay trigger */}
                  <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-4 text-center">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Click to upload custom photo</span>
                    <span className="text-[10px] text-slate-200">(PNG, JPG up to 5MB)</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Upload Button */}
                <label className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 transition-colors text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Upload from Computer / Phone</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>

                {/* Presets Gallery Quick Selector */}
                {showPresetGallery && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Quick Demo Presets:
                    </span>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                      {PRESET_PHOTOS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImageUrl(preset.url);
                            if (!title) setTitle(preset.label);
                          }}
                          className={`relative rounded-lg overflow-hidden border-2 aspect-square group transition-all ${
                            imageUrl === preset.url ? 'border-campus-600 scale-95' : 'border-slate-200 hover:border-slate-400'
                          }`}
                          title={preset.label}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.label} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-1 transition-opacity">
                            <span className="text-[9px] text-white line-clamp-1 leading-tight">{preset.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-campus-50/60 border border-campus-200 text-xs space-y-2">
                <span className="text-[11px] font-bold text-campus-900 uppercase tracking-wider block">
                  Campus Board Preview:
                </span>
                <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                    <span className="text-[10px] text-slate-400">{date}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs line-clamp-1">
                    {title || 'Untitled Item'}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Posting as <strong>{currentUser.name}</strong> ({currentUser.email})</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                  type === 'lost' 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                }`}
              >
                {isSubmitting ? (
                  <span>Publishing Report...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish {type === 'lost' ? 'Lost Report' : 'Found Report'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

