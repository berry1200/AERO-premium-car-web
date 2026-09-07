import React, { useState } from 'react';
import { X, Layers, Compass, Wind, Gauge, Shield, Cpu, Activity } from 'lucide-react';
import { CarSpec } from '../types';
import { playShiftGear } from '../utils/audioEngine';

interface GalleryModalProps {
  car: CarSpec | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (car: CarSpec) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  car,
  isOpen,
  onClose,
  onBook,
}) => {
  if (!isOpen || !car) return null;

  const [activeGalleryTab, setActiveGalleryTab] = useState<'AERO' | 'POWERTRAIN' | 'CHASSIS' | 'SPECS'>('AERO');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-neutral-300 rounded-[2px] p-6 md:p-8 shadow-2xl my-8 text-neutral-900">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-[2px] bg-neutral-100 border border-neutral-300 text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-neutral-200 pb-5">
          <div className="flex items-center gap-2 font-mono text-xs text-red-600 font-bold">
            <span>{car.badgeFlag}</span>
            <span className="uppercase tracking-widest">{car.subTitle}</span>
          </div>
          <h3 className="font-black italic text-3xl md:text-5xl text-black uppercase tracking-tight mt-1">
            {car.brand} {car.model} // ARCHIVE
          </h3>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            TECHNICAL DOSSIER & COMPONENT CAD BLUEPRINTS
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 my-5 font-mono text-xs border-b border-neutral-200 pb-3">
          {(['AERO', 'POWERTRAIN', 'CHASSIS', 'SPECS'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveGalleryTab(tab);
                playShiftGear();
              }}
              className={`px-4 py-2 rounded-[2px] transition-all uppercase tracking-wider font-bold ${
                activeGalleryTab === tab
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[340px]">
          {activeGalleryTab === 'AERO' && (
            <div className="space-y-4 font-mono animate-fadeIn">
              <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-[2px]">
                <div className="text-xs text-black uppercase font-bold flex items-center gap-2">
                  <Wind className="w-4 h-4 text-red-600" />
                  AERODYNAMICS & DOWNFORCE ARCHITECTURE
                </div>
                <p className="text-neutral-700 text-sm mt-2 font-sans leading-relaxed">
                  {car.description}
                </p>

                {/* Downforce vs Speed Curve */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="text-[10px] text-neutral-500 uppercase mb-2 tracking-wider font-bold">
                    DOWNFORCE GENERATION CURVE (KG VS SPEED KM/H)
                  </div>
                  <div className="h-44 w-full bg-white rounded-[2px] p-3 border border-neutral-200 relative">
                    <svg viewBox="0 0 600 150" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="50" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="50" y1="60" x2="580" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="50" y1="100" x2="580" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="50" y1="130" x2="580" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />
                      <line x1="50" y1="10" x2="50" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Labels */}
                      <text x="45" y="25" fill="#64748b" fontSize="9" textAnchor="end">800 KG</text>
                      <text x="45" y="65" fill="#64748b" fontSize="9" textAnchor="end">500 KG</text>
                      <text x="45" y="105" fill="#64748b" fontSize="9" textAnchor="end">250 KG</text>
                      <text x="180" y="142" fill="#64748b" fontSize="9">100 KM/H</text>
                      <text x="350" y="142" fill="#64748b" fontSize="9">200 KM/H</text>
                      <text x="520" y="142" fill="#64748b" fontSize="9">300 KM/H</text>

                      {/* Quadratic Aero Curve */}
                      <path
                        d="M 50 130 Q 300 120 400 80 T 580 20"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="3"
                      />
                      <circle cx="400" cy="80" r="4" fill="#dc2626" />
                      <circle cx="580" cy="20" r="4" fill="#dc2626" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Aero Highlights Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {car.aeroHighlights.map((hl, i) => (
                  <div key={i} className="p-3 bg-neutral-50 border border-neutral-200 rounded-[2px] text-xs text-neutral-800">
                    <span className="text-red-600 font-bold mr-2">0{i + 1} //</span>
                    {hl}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeGalleryTab === 'POWERTRAIN' && (
            <div className="space-y-4 font-mono animate-fadeIn">
              <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-[2px]">
                <div className="text-xs text-black uppercase font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-red-600" />
                  POWERTRAIN & TRANSMISSION TELEMETRY
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 uppercase text-[10px] font-bold">ENGINE ARCHITECTURE</div>
                    <div className="text-sm font-bold text-black mt-1">{car.engine}</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 uppercase text-[10px] font-bold">OUTPUT POWER</div>
                    <div className="text-sm font-bold text-red-600 mt-1">{car.power}</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 uppercase text-[10px] font-bold">PEAK TORQUE</div>
                    <div className="text-sm font-bold text-black mt-1">{car.torque}</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 uppercase text-[10px] font-bold">GEARBOX</div>
                    <div className="text-sm font-bold text-black mt-1">{car.transmission}</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 uppercase text-[10px] font-bold">DRIVETRAIN</div>
                    <div className="text-sm font-bold text-red-600 mt-1">{car.drivetrain}</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 uppercase text-[10px] font-bold">0-100 KM/H</div>
                    <div className="text-sm font-bold text-black mt-1">{car.acceleration}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeGalleryTab === 'CHASSIS' && (
            <div className="space-y-4 font-mono animate-fadeIn">
              <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-[2px]">
                <div className="text-xs text-black uppercase font-bold flex items-center gap-2">
                  <Compass className="w-4 h-4 text-red-600" />
                  CHASSIS, WEIGHT & DIMENSIONS
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold">LENGTH</div>
                    <div className="text-sm font-bold text-black mt-1">{car.lengthMm} MM</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold">WIDTH</div>
                    <div className="text-sm font-bold text-black mt-1">{car.widthMm} MM</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold">HEIGHT</div>
                    <div className="text-sm font-bold text-black mt-1">{car.heightMm} MM</div>
                  </div>
                  <div className="bg-white p-3 rounded-[2px] border border-neutral-200">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold">DRY WEIGHT</div>
                    <div className="text-sm font-bold text-red-600 mt-1">{car.weight}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeGalleryTab === 'SPECS' && (
            <div className="space-y-4 font-mono animate-fadeIn">
              <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-[2px]">
                <div className="text-xs text-black uppercase font-bold flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-red-600" />
                  FULL HOMOLOGATION SUMMARY
                </div>
                <div className="divide-y divide-neutral-200 text-xs mt-3">
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-500">Official Model Designation</span>
                    <span className="font-bold text-black">{car.brand} {car.model}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-500">Chassis Production Number</span>
                    <span className="font-bold text-black">#{car.productionNumber}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-500">VIN Registration</span>
                    <span className="font-bold text-black">{car.vin}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-500">Allocation Status</span>
                    <span className="font-bold text-emerald-600">{car.stockStatus} ({car.location})</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-500">List Price</span>
                    <span className="font-black text-black">{car.price}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-5 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-neutral-500">
            AERO VELOCE TECHNICAL ARCHIVES // VERIFIED SPECS
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-[2px] bg-neutral-100 border border-neutral-300 text-neutral-700 hover:text-black font-mono text-xs uppercase tracking-wider font-bold"
            >
              CLOSE
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(car);
              }}
              className="px-6 py-2.5 rounded-[2px] bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md"
            >
              RESERVE THIS SUPERCAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
