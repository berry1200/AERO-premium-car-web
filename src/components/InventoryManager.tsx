import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Car,
  ChevronRight,
  X,
  Minimize2
} from 'lucide-react';
import { CarSpec } from '../types';
import { playShiftGear } from '../utils/audioEngine';

interface InventoryManagerProps {
  cars: CarSpec[];
  onSelectCar: (car: CarSpec) => void;
  onBookCar: (car: CarSpec) => void;
  onUpdateCarStatus: (carId: string, newStatus: CarSpec['stockStatus']) => void;
  onClose?: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  cars,
  onSelectCar,
  onBookCar,
  onUpdateCarStatus,
  onClose,
}) => {
  const [filterBrand, setFilterBrand] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Brand list
  const brands = ['ALL', 'FERRARI', 'PORSCHE', 'MERCEDES-AMG', 'BMW M', 'AUDI SPORT', 'DODGE SRT'];

  // Filtered cars
  const filteredCars = cars.filter((car) => {
    const matchesBrand = filterBrand === 'ALL' || car.brand.toUpperCase() === filterBrand;
    const matchesStatus = filterStatus === 'ALL' || car.stockStatus === filterStatus;
    const matchesSearch =
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesStatus && matchesSearch;
  });

  // Stock summary counts
  const availableCount = cars.filter((c) => c.stockStatus === 'AVAILABLE').length;
  const reservedCount = cars.filter((c) => c.stockStatus === 'RESERVED').length;

  return (
    <div id="real-time-inventory-section" className="w-full bg-white border border-neutral-200 rounded-[2px] p-6 md:p-10 my-8 shadow-xl select-none text-neutral-900">
      {/* Header with Live Ticker & Closing Tab */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-red-600">
              REAL-TIME GLOBAL INVENTORY ARCHIVE
            </span>
          </div>
          <h3 className="font-black italic text-3xl md:text-4xl text-black uppercase tracking-tight">
            SHOWROOM ALLOCATIONS & FLEET
          </h3>
        </div>

        {/* Global Inventory Metrics Pill & Close Tab */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-[2px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 font-medium">AVAILABLE:</span>
            <span className="text-emerald-900 font-bold">{availableCount}</span>
          </div>
          <div className="bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-[2px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-700 font-medium">RESERVED:</span>
            <span className="text-amber-900 font-bold">{reservedCount}</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-red-600 hover:text-white text-neutral-700 font-bold uppercase rounded-[2px] transition-colors border border-neutral-300"
              title="Close Inventory Section"
            >
              <X className="w-3.5 h-3.5" />
              <span>CLOSE [X]</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="py-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Model, Brand, VIN, or Atelier City..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-[2px] pl-10 pr-4 py-2.5 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <span className="text-neutral-500 text-[10px] uppercase tracking-widest mr-2 font-bold">STATUS:</span>
          {['ALL', 'AVAILABLE', 'RESERVED', 'ALLOCATION'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setFilterStatus(st);
                playShiftGear();
              }}
              className={`px-3 py-1.5 rounded-[2px] border text-[11px] font-bold tracking-wider transition-colors ${
                filterStatus === st
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white border-neutral-300 text-neutral-600 hover:text-black hover:border-neutral-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-neutral-200 font-mono text-xs">
        {brands.map((brand) => (
          <button
            key={brand}
            type="button"
            onClick={() => {
              setFilterBrand(brand);
              playShiftGear();
            }}
            className={`px-3.5 py-1.5 rounded-[2px] shrink-0 transition-colors uppercase tracking-wider text-[11px] font-bold ${
              filterBrand === brand
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => {
          const isAvailable = car.stockStatus === 'AVAILABLE';
          return (
            <div
              key={car.id}
              className="bg-neutral-50/70 border border-neutral-200 rounded-[2px] p-5 flex flex-col justify-between hover:border-red-500 hover:shadow-lg transition-all group relative overflow-hidden"
            >
              {/* Color Accent Indicator Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all"
                style={{ backgroundColor: car.accentColor }}
              />

              <div>
                {/* Top Row: Brand & Status Pill */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span>{car.badgeFlag}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                      {car.brand}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-[2px] border uppercase ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : car.stockStatus === 'RESERVED'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                    }`}
                  >
                    {car.stockStatus}
                  </span>
                </div>

                {/* Car Title & Subtitle */}
                <h4 className="font-black italic text-2xl text-black tracking-tight uppercase group-hover:text-red-600 transition-colors">
                  {car.model}
                </h4>
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  VIN: {car.vin} • #{car.productionNumber}
                </div>

                {/* Spec Highlights Table */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-white border border-neutral-200 rounded-[2px] text-center font-mono">
                  <div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">POWER</div>
                    <div className="text-xs font-bold text-black mt-0.5">{car.power.split(' ')[0]}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">0-100</div>
                    <div className="text-xs font-bold text-red-600 mt-0.5">{car.acceleration}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">TOP SPEED</div>
                    <div className="text-xs font-bold text-black mt-0.5">{car.topSpeed.split(' ')[0]}</div>
                  </div>
                </div>

                {/* Location & Pricing */}
                <div className="space-y-1 text-xs font-mono text-neutral-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Location: <strong className="text-neutral-900">{car.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Price: <strong className="text-black font-bold text-sm">{car.price}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectCar(car)}
                  className="flex-1 px-3 py-2 bg-white hover:bg-neutral-900 hover:text-white text-black border border-neutral-300 font-mono text-[10px] font-bold uppercase rounded-[2px] tracking-wider transition-colors text-center"
                >
                  VIEW POSTER
                </button>

                <button
                  type="button"
                  onClick={() => onBookCar(car)}
                  className={`flex-1 px-3 py-2 font-mono text-[10px] font-bold uppercase rounded-[2px] tracking-wider transition-colors text-center ${
                    isAvailable
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  }`}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'RESERVE NOW' : 'LOCKED IN ESCROW'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
