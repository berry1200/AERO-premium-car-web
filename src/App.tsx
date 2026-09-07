import React, { useState } from 'react';
import { 
  Flame, 
  Layers, 
  Building2, 
  ChevronRight, 
  Compass, 
  Activity, 
  Car,
  Zap, 
  Info,
  X,
  Plus,
  RotateCcw,
  Sparkles,
  Gauge,
  Clock,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { CAR_COLLECTION } from './data/cars';
import { CarSpec, BookingConfirmation } from './types';
import { Navbar } from './components/Navbar';
import { HeroVideoScrawler } from './components/HeroVideoScrawler';
import { CarBlueprintPoster } from './components/CarBlueprintPoster';
import { Car3DStudio } from './components/Car3DStudio';
import { InventoryManager } from './components/InventoryManager';
import { BookingModal } from './components/BookingModal';
import { GalleryModal } from './components/GalleryModal';
import { TachometerScrollIndicator } from './components/TachometerScrollIndicator';
import { playShiftGear, initAudio } from './utils/audioEngine';

export default function App() {
  const [cars, setCars] = useState<CarSpec[]>(CAR_COLLECTION);
  const [selectedCar, setSelectedCar] = useState<CarSpec>(CAR_COLLECTION[0]);
  const [currentColor, setCurrentColor] = useState<string>(CAR_COLLECTION[0].defaultPaintColor);
  const [activeTab, setActiveTab] = useState<'POSTER' | 'STUDIO' | 'INVENTORY'>('POSTER');

  // Section Visibility / Closing Tab Management (Requirement: "1. add closing tab for some section")
  const [showMotionReel, setShowMotionReel] = useState<boolean>(true);
  const [showPosterSection, setShowPosterSection] = useState<boolean>(true);
  const [showSanctuaries, setShowSanctuaries] = useState<boolean>(true);
  const [showDossierBanner, setShowDossierBanner] = useState<boolean>(true);
  const [showReferencePicker, setShowReferencePicker] = useState<boolean>(true);
  
  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [bookingCar, setBookingCar] = useState<CarSpec | null>(null);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);

  // When selected car changes, reset default paint color
  const handleSelectCar = (car: CarSpec) => {
    setSelectedCar(car);
    setCurrentColor(car.defaultPaintColor);
  };

  // Open booking for specific car
  const handleOpenBooking = (car?: CarSpec) => {
    initAudio();
    playShiftGear();
    setBookingCar(car || selectedCar);
    setIsBookingOpen(true);
  };

  // Update car inventory status in real-time
  const handleUpdateCarStatus = (carId: string, newStatus: CarSpec['stockStatus']) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id === carId) {
          return { ...c, stockStatus: newStatus };
        }
        return c;
      })
    );

    const target = cars.find((c) => c.id === carId);
    if (target) {
      setLiveNotification(`STATUS UPDATE // ${target.brand} ${target.model} is now ${newStatus}`);
      setTimeout(() => setLiveNotification(null), 4500);
    }
  };

  // When booking confirms, mark that vehicle as RESERVED in real-time
  const handleConfirmBooking = (confirmation: BookingConfirmation) => {
    handleUpdateCarStatus(confirmation.car.id, 'RESERVED');
    setLiveNotification(`ALLOCATION SECURED // ${confirmation.car.model} reserved by ${confirmation.details.customerName}`);
    setTimeout(() => setLiveNotification(null), 6000);
  };

  // Reset all closed sections
  const handleResetAllSections = () => {
    playShiftGear();
    setShowMotionReel(true);
    setShowPosterSection(true);
    setShowSanctuaries(true);
    setShowDossierBanner(true);
    setShowReferencePicker(true);
  };

  // Available units count
  const availableCount = cars.filter((c) => c.stockStatus === 'AVAILABLE').length;

  const anySectionClosed = !showMotionReel || !showPosterSection || !showSanctuaries || !showDossierBanner || !showReferencePicker;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#141414] flex flex-col font-sans selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      {/* High-Speed Tachometer Scroll Progress Indicator */}
      <TachometerScrollIndicator />

      {/* Top Navigation Bar with Crisp Light Styling */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        availableCount={availableCount}
      />

      {/* Live Activity Notification Pill */}
      {liveNotification && (
        <div className="fixed bottom-8 right-8 z-50 bg-neutral-900 border-2 border-red-600 text-white px-5 py-3.5 rounded-[2px] shadow-2xl font-mono text-xs flex items-center gap-3 animate-slideUp">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="tracking-wider uppercase font-bold">{liveNotification}</span>
        </div>
      )}

      {/* Dynamic Section Recovery Toolbar (Visible when any section is closed via Closing Tabs) */}
      {anySectionClosed && (
        <div className="bg-neutral-900 text-white px-4 py-2 border-b border-neutral-800 text-xs font-mono flex flex-wrap items-center justify-between gap-3 sticky top-20 z-30 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">CLOSED SECTIONS TABS:</span>
            <span className="text-neutral-400">Click to restore any closed view</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!showMotionReel && (
              <button
                type="button"
                onClick={() => setShowMotionReel(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] rounded-[2px] border border-neutral-700"
              >
                <Plus className="w-3 h-3 text-red-400" />
                <span>Motion Reel</span>
              </button>
            )}

            {!showReferencePicker && (
              <button
                type="button"
                onClick={() => setShowReferencePicker(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] rounded-[2px] border border-neutral-700"
              >
                <Plus className="w-3 h-3 text-red-400" />
                <span>Reference Designs</span>
              </button>
            )}

            {!showPosterSection && (
              <button
                type="button"
                onClick={() => setShowPosterSection(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] rounded-[2px] border border-neutral-700"
              >
                <Plus className="w-3 h-3 text-red-400" />
                <span>Editorial Poster</span>
              </button>
            )}

            {!showSanctuaries && (
              <button
                type="button"
                onClick={() => setShowSanctuaries(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] rounded-[2px] border border-neutral-700"
              >
                <Plus className="w-3 h-3 text-red-400" />
                <span>Global Vaults</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetAllSections}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-[2px] ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESTORE ALL</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-10 py-8 space-y-10 relative z-10">
        {/* Top Hero Section: Vibrant Editorial Typography & Reference Concept */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-2">
            <div className="max-w-2xl">
              {/* Eyebrow & Scuderia Badge */}
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[2px] w-10 bg-red-600" />
                <span className="text-xs uppercase tracking-[0.35em] text-red-600 font-black">
                  AERO // VELOCE ARCHIVE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded font-bold">
                  THE LEGEND LIVES FOREVER
                </span>
              </div>

              {/* Massive Vibrant Headline with Red Accent */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl leading-[0.88] font-black tracking-tighter uppercase italic text-black mb-4">
                LEGENDARY<br />
                <span className="text-red-600">SUPERCAR</span> ATELIER
              </h1>

              <p className="text-sm text-neutral-700 max-w-xl leading-relaxed font-medium">
                Inspired by the iconic Ferrari F40 racing blueprint poster archive. Featuring high-contrast technical schematics, active 3D CAD aerodynamics, real-time escrow allocation, and track telemetry.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('POSTER');
                    setShowPosterSection(true);
                    playShiftGear();
                  }}
                  className="px-8 py-3.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all rounded-[2px] shadow-lg shadow-red-600/20 flex items-center gap-2"
                >
                  <span>VIEW F40 POSTER SPEC</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('STUDIO');
                    playShiftGear();
                  }}
                  className="px-8 py-3.5 bg-white border-2 border-neutral-900 text-black font-black text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all rounded-[2px] flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>LAUNCH 3D CAD STUDIO</span>
                </button>
              </div>
            </div>

            {/* Telemetry Stats Card in High-Contrast White & Red */}
            <div className="flex items-center gap-4 sm:gap-6 bg-white border border-neutral-300 p-5 sm:p-6 rounded-[2px] shadow-md">
              <div className="flex flex-col gap-1 pr-6 border-r border-neutral-200">
                <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">F40 TOP SPEED</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black italic tracking-tighter text-black">324</span>
                  <span className="text-[10px] text-red-600 uppercase font-black">KM/H</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pr-6 border-r border-neutral-200">
                <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">MAX POWER</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black italic tracking-tighter text-black">478</span>
                  <span className="text-[10px] text-red-600 uppercase font-black">HP</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">AVAILABLE NOW</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black italic tracking-tighter text-emerald-600">{availableCount}</span>
                  <span className="text-[10px] text-emerald-700 uppercase font-bold">UNITS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cinematic Video Motion Reel with its own Closing Tab (Requirement 1) */}
          {showMotionReel && (
            <HeroVideoScrawler
              cars={cars}
              selectedCar={selectedCar}
              onSelectCar={handleSelectCar}
              onClose={() => setShowMotionReel(false)}
            />
          )}
        </section>

        {/* Available Designs in this Reference Gallery Strip */}
        {showReferencePicker && (
          <section className="bg-white border border-neutral-200 p-5 rounded-[2px] shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
                <h3 className="font-black italic text-base sm:text-lg uppercase tracking-tight text-black">
                  AVAILABLE DESIGNS IN THIS REFERENCE ARCHIVE
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs font-mono text-neutral-500">
                  Select a vehicle to inspect its vibrant poster
                </span>
                <button
                  type="button"
                  onClick={() => setShowReferencePicker(false)}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold text-neutral-400 hover:text-black"
                  title="Close Reference Designs Tab"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>CLOSE [X]</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {cars.map((car) => {
                const isSelected = selectedCar.id === car.id;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => {
                      handleSelectCar(car);
                      setActiveTab('POSTER');
                      setShowPosterSection(true);
                      playShiftGear();
                    }}
                    className={`p-3 text-left rounded-[2px] border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-50/50 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: car.accentColor }}
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-1">
                      <span>{car.year}</span>
                      <span className="font-bold text-black">{car.brand.split(' ')[0]}</span>
                    </div>
                    <div className="font-black italic text-sm text-black tracking-tight uppercase truncate mt-0.5">
                      {car.model}
                    </div>
                    <div className="text-[10px] font-mono text-red-600 font-bold mt-1">
                      {car.topSpeed.split(' ')[0]} KM/H
                    </div>
                    {isSelected && (
                      <div className="mt-1.5 flex items-center gap-1 text-[9px] font-mono font-bold text-red-600 uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ACTIVE</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* View Mode Switcher Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-neutral-200 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">CURRENT EXHIBIT //</span>
            <span className="text-sm font-black uppercase tracking-widest text-black">
              {selectedCar.brand} {selectedCar.model}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-200 p-1 rounded-[2px] text-[11px] uppercase tracking-widest font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('POSTER');
                setShowPosterSection(true);
                playShiftGear();
              }}
              className={`px-4 py-2 rounded-[2px] transition-all ${
                activeTab === 'POSTER' && showPosterSection
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:text-black'
              }`}
            >
              EDITORIAL POSTER
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('STUDIO');
                playShiftGear();
              }}
              className={`px-4 py-2 rounded-[2px] transition-all flex items-center gap-2 ${
                activeTab === 'STUDIO'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D CAD STUDIO</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('INVENTORY');
                playShiftGear();
              }}
              className={`px-4 py-2 rounded-[2px] transition-all flex items-center gap-2 ${
                activeTab === 'INVENTORY'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:text-black'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>INVENTORY ({availableCount})</span>
            </button>
          </div>
        </div>

        {/* Active Tab View */}
        {activeTab === 'POSTER' && showPosterSection && (
          <div className="space-y-6 animate-fadeIn">
            {/* Signature Car Blueprint & Editorial Poster Component with Closing Tab */}
            <CarBlueprintPoster
              car={selectedCar}
              onBookTestDrive={(car) => handleOpenBooking(car)}
              onOpenStudio={() => {
                setActiveTab('STUDIO');
                playShiftGear();
              }}
              onCloseSection={() => setShowPosterSection(false)}
            />

            {/* Quick Specs Dossier Drawer Button with Close Tab */}
            {showDossierBanner && (
              <div className="flex items-center justify-between bg-white border border-neutral-300 p-5 rounded-[2px] text-xs shadow-sm">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-neutral-700 tracking-wide font-sans font-medium">
                    Access factory engineering archives, aerodynamic wind tunnel telemetry, and certification data.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsGalleryOpen(true)}
                    className="px-5 py-2.5 bg-neutral-900 text-white hover:bg-black uppercase tracking-widest text-[11px] font-bold rounded-[2px] transition-colors shrink-0"
                  >
                    OPEN TECHNICAL DOSSIER →
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDossierBanner(false)}
                    className="p-1 text-neutral-400 hover:text-black"
                    title="Close banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* If poster section is closed in Poster tab, show notice to reopen */}
        {activeTab === 'POSTER' && !showPosterSection && (
          <div className="bg-white border-2 border-dashed border-neutral-300 p-8 rounded-[2px] text-center space-y-3 my-6">
            <div className="text-sm font-mono uppercase tracking-wider text-neutral-500">
              POSTER SECTION IS CURRENTLY CLOSED
            </div>
            <button
              type="button"
              onClick={() => setShowPosterSection(true)}
              className="px-6 py-2.5 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-red-700"
            >
              + RE-OPEN EDITORIAL POSTER
            </button>
          </div>
        )}

        {activeTab === 'STUDIO' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 p-4 rounded-[2px]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-bold">Interactive 360° CAD</span>
                </div>
                <h3 className="font-black italic text-2xl md:text-3xl text-black uppercase tracking-tight">
                  {selectedCar.brand} {selectedCar.model} // 3D VEHICLE ATELIER
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Drag to orbit 360° • Zoom • Toggle CAD Blueprint wireframe, Wind Tunnel aerodynamics, or Dyno test.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenBooking(selectedCar)}
                  className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 uppercase tracking-widest text-[11px] font-bold rounded-[2px] transition-all shadow-md"
                >
                  BOOK TEST DRIVE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('POSTER')}
                  className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 uppercase tracking-widest text-[11px] font-bold rounded-[2px] transition-all"
                  title="Close 3D Studio and Return to Poster"
                >
                  CLOSE STUDIO [X]
                </button>
              </div>
            </div>

            {/* Three.js 3D WebGL Vehicle Studio */}
            <Car3DStudio
              car={selectedCar}
              currentColor={currentColor}
              onColorChange={(newCol) => setCurrentColor(newCol)}
              onClose={() => setActiveTab('POSTER')}
            />
          </div>
        )}

        {activeTab === 'INVENTORY' && (
          <div className="animate-fadeIn">
            {/* Real-time Inventory Management with Closing Tab */}
            <InventoryManager
              cars={cars}
              onSelectCar={(car) => {
                handleSelectCar(car);
                setActiveTab('POSTER');
              }}
              onBookCar={(car) => handleOpenBooking(car)}
              onUpdateCarStatus={handleUpdateCarStatus}
              onClose={() => setActiveTab('POSTER')}
            />
          </div>
        )}

        {/* Global Hubs & Atelier Network with Closing Tab (Requirement 1) */}
        {showSanctuaries && (
          <section className="bg-white border border-neutral-200 rounded-[2px] p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-[2px] w-6 bg-red-600" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-600">
                    PRIVATE ACCESS NETWORK
                  </span>
                </div>
                <h4 className="font-black italic text-2xl md:text-3xl text-black uppercase tracking-tight">
                  GLOBAL ATELIER VAULTS & CIRCUITS
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
                  <Compass className="w-3.5 h-3.5 text-neutral-500" />
                  <span>6 SANCTUARIES</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSanctuaries(false)}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold text-neutral-400 hover:text-black p-1"
                  title="Close Network Section Tab"
                >
                  <X className="w-4 h-4" />
                  <span>CLOSE [X]</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {[
                { city: 'MARANELLO', desc: 'Factory Vault & Fiorano', country: 'Italy 🇮🇹' },
                { city: 'STUTTGART', desc: 'Motorsport Testing Hub', country: 'Germany 🇩🇪' },
                { city: 'AFFALTERBACH', desc: 'AMG Performance Lab', country: 'Germany 🇩🇪' },
                { city: 'LONDON', desc: 'Mayfair Sanctuary', country: 'UK 🇬🇧' },
                { city: 'DUBAI', desc: 'Autodrome VIP Club', country: 'UAE 🇦🇪' },
                { city: 'LOS ANGELES', desc: 'Private Canyon Atelier', country: 'USA 🇺🇸' },
              ].map((hub, idx) => (
                <div key={idx} className="bg-neutral-50 border border-neutral-200 p-4 rounded-[2px] hover:border-red-500 hover:bg-white transition-all">
                  <div className="text-black font-black tracking-wider">{hub.city}</div>
                  <div className="text-neutral-600 text-[11px] mt-0.5">{hub.country}</div>
                  <div className="text-red-600 text-[10px] mt-2 font-mono uppercase tracking-wider font-bold">{hub.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Bar with Vibrant High-Contrast Light Styling */}
      <footer className="w-full bg-white border-t border-neutral-200 py-8 mt-16 select-none font-sans relative z-10 text-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Telemetry Stat Blocks */}
          <div className="flex flex-wrap items-center gap-8 sm:gap-14">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold">Acceleration</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black italic tracking-tighter text-black">{selectedCar.acceleration.split(' ')[0]}</span>
                <span className="text-[10px] text-red-600 uppercase font-black">s 0-100</span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold">Top Speed</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black italic tracking-tighter text-black">{selectedCar.topSpeed.split(' ')[0]}</span>
                <span className="text-[10px] text-red-600 uppercase font-black">km/h</span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold">Output</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black italic tracking-tighter text-black">{selectedCar.power.split(' ')[0]}</span>
                <span className="text-[10px] text-red-600 uppercase font-black">hp</span>
              </div>
            </div>
          </div>

          {/* Currently Viewing Car & Segmented Indicator */}
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold mb-0.5">Active Reference</span>
              <span className="text-xs font-black tracking-widest text-black uppercase">{selectedCar.brand} {selectedCar.model}</span>
            </div>

            <div className="flex gap-1.5">
              <div className="w-8 sm:w-10 h-1.5 bg-red-600 rounded-full" />
              <div className="w-8 sm:w-10 h-1.5 bg-neutral-300 rounded-full" />
              <div className="w-8 sm:w-10 h-1.5 bg-neutral-300 rounded-full" />
              <div className="w-8 sm:w-10 h-1.5 bg-neutral-300 rounded-full" />
            </div>
          </div>
        </div>

        {/* Legal & Navigation sub-strip */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 mt-6 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 tracking-wider">
          <div className="flex items-center gap-6 uppercase font-bold">
            <button type="button" onClick={() => { setActiveTab('POSTER'); setShowPosterSection(true); }} className="hover:text-black transition-colors">
              Editorial Poster
            </button>
            <button type="button" onClick={() => setActiveTab('STUDIO')} className="hover:text-black transition-colors">
              3D Studio
            </button>
            <button type="button" onClick={() => setActiveTab('INVENTORY')} className="hover:text-black transition-colors">
              Inventory
            </button>
            <button type="button" onClick={() => handleOpenBooking()} className="text-red-600 hover:underline transition-colors font-bold">
              Book Test Drive
            </button>
          </div>
          <div className="mt-4 sm:mt-0 font-mono text-[10px] text-neutral-400">
            © 2026 AERO VELOCE // F40 POSTER & CAD ATELIER.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookingModal
        car={bookingCar}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />

      <GalleryModal
        car={selectedCar}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onBook={(car) => {
          setIsGalleryOpen(false);
          handleOpenBooking(car);
        }}
      />
    </div>
  );
}
