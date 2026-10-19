import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Compass,
  Navigation,
  Car,
  Train,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RESTAURANT_CONTACT_INFO, RESTAURANT_HERO_IMAGE } from '../data/menuData';
import { GeofenceState } from '../types/restaurant';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'location' | 'about_us';
  geofenceState: GeofenceState;
  onOpenGeofenceRadar?: () => void;
  onOpenReservations: () => void;
}

export const VisitUsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'location',
  geofenceState,
  onOpenGeofenceRadar,
  onOpenReservations
}) => {
  const [activeTab, setActiveTab] = useState<'location' | 'about_us'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 my-auto flex flex-col max-h-[90vh]">
        {/* Top Header - Responsive, Optimized Icon & Texting, Cross Permanently Anchored */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-stone-950/95 border-b border-stone-800 shrink-0 select-none">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Optimized Dynamic Icon & Texting */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-amber-600/5 border border-amber-400/35 text-amber-400 flex items-center justify-center shrink-0 shadow-sm shadow-amber-400/10 transition-all duration-200">
                {activeTab === 'location' ? (
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform duration-200" />
                ) : (
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform duration-200" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400 block truncate leading-tight">
                  {activeTab === 'location' ? 'Flagship Destination' : 'Our Story & Heritage'}
                </span>
                <h2 className="text-sm sm:text-base md:text-lg font-serif-display font-bold text-amber-100 truncate leading-tight mt-0.5">
                  {activeTab === 'location' ? 'Location & Directions' : 'About Our Restaurant'}
                </h2>
              </div>
            </div>

            {/* Right: Desktop Tabs + Close Cross Button (Permanently Anchored) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop Sub-Nav Tab Switcher */}
              <div className="hidden sm:inline-flex items-center p-1 bg-stone-800/90 rounded-xl border border-stone-700/80 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('location')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                    activeTab === 'location'
                      ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Location & Transit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('about_us')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                    activeTab === 'about_us'
                      ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>About Us</span>
                </button>
              </div>

              {/* Close Button - Stays Permanently Visible with shrink-0 and High Touch Hitbox */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
              >
                <X className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
              </button>
            </div>
          </div>

          {/* Mobile Sub-Nav Tab Switcher (Underneath row on small screens so cross is NEVER squished or clipped) */}
          <div className="sm:hidden mt-2.5 pt-2 border-t border-stone-800/80">
            <div className="grid grid-cols-2 p-1 bg-stone-800/90 rounded-xl border border-stone-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                  activeTab === 'location'
                    ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Location & Transit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('about_us')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                  activeTab === 'about_us'
                    ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>About Us</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= LOCATION & DIRECTIONS ================= */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              {/* Address Hero */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="bg-stone-800/80 rounded-2xl border border-stone-700/60 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Connaught Place Flagship
                    </span>
                    <h3 className="text-xl font-serif-display font-bold text-white">
                      {RESTAURANT_CONTACT_INFO.name}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {RESTAURANT_CONTACT_INFO.address}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-stone-700/60 text-xs text-stone-300">
                      <div className="flex items-center gap-2">
                        <Train className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{RESTAURANT_CONTACT_INFO.metroStop}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Complimentary Valet Parking available at entrance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Direct Concierge: {RESTAURANT_CONTACT_INFO.phonePrimary}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href="https://maps.google.com/?q=Connaught+Place+New+Delhi"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Operating Hours & Radius Zone */}
                <div className="bg-stone-800/80 rounded-2xl border border-stone-700/60 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>Dining Room & Kitchen Hours</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-stone-700/60">
                      <span className="text-stone-300 font-medium">Lunch Service</span>
                      <span className="text-stone-100 font-mono">{RESTAURANT_CONTACT_INFO.hours.lunch}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-700/60">
                      <span className="text-stone-300 font-medium">Dinner Service</span>
                      <span className="text-stone-100 font-mono">{RESTAURANT_CONTACT_INFO.hours.dinner}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-700/60">
                      <span className="text-stone-300 font-medium">Cocktail Bar Lounge</span>
                      <span className="text-stone-100 font-mono">{RESTAURANT_CONTACT_INFO.hours.bar}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-stone-300 font-medium">Weekend Grand Buffet</span>
                      <span className="text-emerald-400 font-mono">{RESTAURANT_CONTACT_INFO.hours.buffet}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-700/60">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReservations();
                      }}
                      className="w-full py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Book a Table at Connaught Place</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABOUT US ================= */}
          {activeTab === 'about_us' && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[21/9] max-h-56">
                <img
                  src={RESTAURANT_HERO_IMAGE}
                  alt="Shankar Restaurant Ambiance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
                      Established 1974
                    </span>
                    <h3 className="text-2xl font-serif-display font-bold text-white">
                      Fifty Years of Culinary Grandeur
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-300">
                <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-2">
                  <span className="text-amber-400 font-bold block text-sm font-serif-display">
                    01. Hand-Pounded Masalas
                  </span>
                  <p className="leading-relaxed">
                    Whole spices roasted dry over iron tawas and stone-ground every dawn to unlock delicate essential oils without oxidation.
                  </p>
                </div>

                <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-2">
                  <span className="text-amber-400 font-bold block text-sm font-serif-display">
                    02. Terracotta Clay Tandoor
                  </span>
                  <p className="leading-relaxed">
                    Centuries-old clay ovens stoked exclusively with dried sal wood and charcoal, producing that incomparable smoky charred crust.
                  </p>
                </div>

                <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-2">
                  <span className="text-amber-400 font-bold block text-sm font-serif-display">
                    03. 24-Hour Embers Dal
                  </span>
                  <p className="leading-relaxed">
                    Our renowned Dal Shankar simmers continuously through the night with fresh churned white makhan, garlic, and slow-melted cream.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
