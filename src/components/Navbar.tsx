import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Layers, 
  Building2, 
  Gauge, 
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';
import { playShiftGear } from '../utils/audioEngine';

interface NavbarProps {
  activeTab: 'POSTER' | 'STUDIO' | 'INVENTORY';
  setActiveTab: (tab: 'POSTER' | 'STUDIO' | 'INVENTORY') => void;
  onOpenBooking: () => void;
  availableCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  availableCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'POSTER' | 'STUDIO' | 'INVENTORY') => {
    playShiftGear();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 select-none shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-20 flex items-center justify-between">
        {/* Brand Logo with Scuderia / Racing Aesthetic */}
        <div 
          onClick={() => handleTabClick('POSTER')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-red-600 rounded-[2px] flex items-center justify-center relative transition-transform group-hover:scale-105 shadow-md shadow-red-600/20">
            <span className="text-white text-base font-black italic tracking-tighter">AV</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg md:text-xl font-black tracking-[0.15em] uppercase text-black">
                AERO<span className="text-red-600">//</span>VELOCE
              </span>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 bg-neutral-100 border border-neutral-300 rounded text-neutral-800">
                1987-2026
              </span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-neutral-500 -mt-0.5">
              VIBRANT POSTER & CAD ATELIER
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-600">
          <button
            type="button"
            onClick={() => handleTabClick('POSTER')}
            className={`transition-all pb-1 ${
              activeTab === 'POSTER'
                ? 'text-red-600 border-b-2 border-red-600 font-black'
                : 'hover:text-black'
            }`}
          >
            EDITORIAL POSTER
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('STUDIO')}
            className={`transition-all pb-1 flex items-center gap-1.5 ${
              activeTab === 'STUDIO'
                ? 'text-red-600 border-b-2 border-red-600 font-black'
                : 'hover:text-black'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <span>3D CAD STUDIO</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('INVENTORY')}
            className={`transition-all pb-1 flex items-center gap-1.5 ${
              activeTab === 'INVENTORY'
                ? 'text-red-600 border-b-2 border-red-600 font-black'
                : 'hover:text-black'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>INVENTORY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </nav>

        {/* Live Status Pill & Booking CTA Button */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-[2px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{availableCount} READY FOR ALLOCATION</span>
          </div>

          <div className="h-6 w-[1px] bg-neutral-200" />

          <button
            type="button"
            onClick={onOpenBooking}
            className="text-xs uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 font-bold transition-all rounded-[2px] shadow-md shadow-red-600/20 flex items-center gap-2"
          >
            <span>BOOK TEST DRIVE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={onOpenBooking}
            className="text-[10px] uppercase tracking-widest bg-red-600 text-white px-3 py-2 font-bold rounded-[2px]"
          >
            Book
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-neutral-300 text-neutral-700 hover:text-black rounded-[2px]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-6 py-6 space-y-3 font-mono text-xs shadow-lg">
          <button
            type="button"
            onClick={() => handleTabClick('POSTER')}
            className={`w-full text-left px-4 py-3 rounded-[2px] border ${
              activeTab === 'POSTER' ? 'bg-red-600 text-white font-bold border-red-600' : 'border-neutral-200 text-neutral-700'
            }`}
          >
            EDITORIAL POSTER SPEC
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('STUDIO')}
            className={`w-full text-left px-4 py-3 rounded-[2px] border ${
              activeTab === 'STUDIO' ? 'bg-red-600 text-white font-bold border-red-600' : 'border-neutral-200 text-neutral-700'
            }`}
          >
            3D CAD STUDIO
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('INVENTORY')}
            className={`w-full text-left px-4 py-3 rounded-[2px] border ${
              activeTab === 'INVENTORY' ? 'bg-red-600 text-white font-bold border-red-600' : 'border-neutral-200 text-neutral-700'
            }`}
          >
            INVENTORY ({availableCount} READY)
          </button>
        </div>
      )}
    </header>
  );
};
