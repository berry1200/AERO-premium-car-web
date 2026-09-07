import React, { useState } from 'react';
import { 
  Gauge, 
  Activity, 
  Flame, 
  Wind, 
  ChevronRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sparkles, 
  Info,
  X,
  Minimize2,
  Maximize2,
  Clock,
  Cpu,
  CornerDownRight,
  Share2
} from 'lucide-react';
import { CarSpec } from '../types';

interface CarBlueprintPosterProps {
  car: CarSpec;
  onBookTestDrive: (car: CarSpec) => void;
  onOpenStudio: () => void;
  onCloseSection?: () => void;
}

export const CarBlueprintPoster: React.FC<CarBlueprintPosterProps> = ({
  car,
  onBookTestDrive,
  onOpenStudio,
  onCloseSection,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [activeAngle, setActiveAngle] = useState<'ANGLED' | 'PROFILE' | 'CAD'>('ANGLED');

  // Technical Hotspots on the vehicle architecture
  const hotspots = [
    {
      id: 'aero-splitter',
      label: '01 // Front Aero Splitter & NACA Ducts',
      coords: { x: '82%', y: '58%' },
      title: 'Carbon-Kevlar Front Splitter & Clamshell NACA Ducts',
      detail: 'Directs high-velocity ambient airflow into the front cooling radiators and reduces aerodynamic front-axle lift.',
    },
    {
      id: 'powertrain',
      label: '02 // Twin-Turbo Mid-Engine V8',
      coords: { x: '45%', y: '45%' },
      title: `${car.engine} (${car.power})`,
      detail: `Delivering ${car.torque}. Twin water-cooled turbochargers with Behr intercoolers and dry sump high-G track scavenging.`,
    },
    {
      id: 'rear-wing',
      label: '03 // High-Downforce Integral Rear Wing',
      coords: { x: '16%', y: '28%' },
      title: 'Integral High-Downforce Carbon Wing',
      detail: `${car.downforce || 'Aerodynamic track downforce'}. Seamlessly sculpted into the composite clamshell for high-speed stability.`,
    },
    {
      id: 'suspension',
      label: '04 // Speedline Modular Alloy Wheels',
      coords: { x: '72%', y: '68%' },
      title: 'Star-Spoke Modular Alloys & Brembo Calipers',
      detail: 'Ultra-lightweight motorsport wheels wrapped in high-grip track compounds, paired with cross-drilled ventilated discs.',
    },
  ];

  // Specific data for reference image replication
  const isF40 = car.id === 'ferrari-f40';

  if (isMinimized) {
    return (
      <div className="w-full bg-white border-2 border-red-600 rounded-[2px] p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
          <span className="font-bold text-xs uppercase tracking-widest text-black">
            VIBRANT POSTER ARCHIVE // {car.brand} {car.model} (COLLAPSED)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-red-700 flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>EXPAND POSTER</span>
          </button>
          {onCloseSection && (
            <button
              type="button"
              onClick={onCloseSection}
              className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-[2px]"
              title="Close Section"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <section 
      id="car-blueprint-poster" 
      className="relative w-full overflow-hidden bg-white text-[#111111] border border-neutral-200 shadow-2xl rounded-[2px]"
    >
      {/* Dynamic Closing Tab & Section Control Bar (Requirement 1: add closing tab for some section) */}
      <div className="w-full bg-neutral-900 text-white px-4 py-2 flex items-center justify-between border-b border-neutral-800 text-[11px] font-mono select-none z-30 relative">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-white">
            EXHIBIT POSTER // {car.brand} {car.model}
          </span>
          <span className="hidden sm:inline-block text-neutral-400">
            [THE LEGEND LIVES FOREVER]
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Angle / Mode switcher */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-800 p-0.5 rounded-[2px]">
            {(['ANGLED', 'PROFILE', 'CAD'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setActiveAngle(m)}
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-[2px] transition-colors ${
                  activeAngle === m ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-[2px] transition-colors"
            title="Minimize Section"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] uppercase font-bold">MINIMIZE</span>
          </button>

          {onCloseSection && (
            <button
              type="button"
              onClick={onCloseSection}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-[2px] transition-colors text-[10px] uppercase tracking-wider"
              title="Close Section Tab"
            >
              <X className="w-3.5 h-3.5" />
              <span>CLOSE TAB</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Poster Canvas with Bold Editorial Geometry & High-Contrast Light Theme (Matching Reference Image car 3.jpg) */}
      <div className="relative p-6 sm:p-10 md:p-12 min-h-[750px] overflow-hidden bg-[#fafafa]">
        {/* Subtle dot matrix grid in top right corner (Reference Image item) */}
        <div className="absolute top-8 right-8 w-24 h-24 bg-dot-matrix opacity-40 pointer-events-none" />

        {/* Subtle dot matrix grid in bottom left corner (Reference Image item) */}
        <div className="absolute bottom-8 left-8 w-24 h-24 bg-dot-matrix opacity-40 pointer-events-none" />

        {/* Dynamic Slanted Sharp Racing Geometry - Vibrant Rosso Corsa Wedges */}
        {/* Giant Red Corner Wedge cutting from bottom right */}
        <div 
          className="absolute -bottom-24 -right-16 w-[65%] h-[80%] bg-[#dc2626] transform -skew-x-12 pointer-events-none z-0 shadow-2xl transition-colors duration-500"
          style={{ backgroundColor: isF40 ? '#dc2626' : car.accentColor }}
        />

        {/* Slanted Vibrant Yellow Speedline Trajectory (Reference Image item) */}
        <div className="absolute -bottom-10 right-0 w-[70%] h-[3px] bg-[#facc15] transform -skew-x-12 origin-bottom-right z-1 pointer-events-none shadow-md" />
        <div className="absolute top-1/2 right-12 w-64 h-[2px] bg-[#facc15] transform -rotate-12 z-1 pointer-events-none opacity-80" />

        {/* Top-Left Red Triangle Graphic cut */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-[#dc2626] transform rotate-45 pointer-events-none z-0" />

        {/* Massive Background Typography: FERRARI / BRAND running vertically/horizontally in Deep Black */}
        <div className="absolute top-12 right-10 lg:right-20 select-none pointer-events-none z-0 opacity-90">
          <div className="font-black text-6xl sm:text-8xl lg:text-[130px] xl:text-[150px] uppercase tracking-tighter text-[#141414] leading-[0.85] font-sans">
            {car.brand}
          </div>
        </div>

        {/* Massive Reverse Cutout Typography inside the red wedge: e.g. F40 */}
        <div className="absolute bottom-6 right-8 lg:right-16 select-none pointer-events-none z-1">
          <div className="font-black italic text-7xl sm:text-9xl lg:text-[160px] uppercase tracking-tighter text-white leading-none font-sans drop-shadow-md">
            {isF40 ? 'F40' : car.model.split(' ')[0]}
          </div>
        </div>

        {/* Poster Content Layout Layer */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Reference Specs & Telemetry Badge Stack */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top Brand Crest & Tagline: Reference Image Header */}
            <div className="flex items-center gap-4">
              {/* Prancing Horse / Shield Silhouette */}
              <div className="w-12 h-14 bg-neutral-900 text-yellow-400 flex flex-col items-center justify-center p-1 rounded-t-sm shadow-md border-b-2 border-red-600">
                <span className="text-xl">🐎</span>
                <span className="text-[8px] font-bold tracking-tighter uppercase text-white -mt-0.5">SCUDERIA</span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black italic tracking-tight text-red-600">
                    {isF40 ? 'F40' : car.model}
                  </span>
                  <span className="text-sm font-bold font-mono text-neutral-800">
                    {car.year}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-neutral-600 font-bold mt-0.5">
                  THE LEGEND LIVES FOREVER
                </div>
              </div>
            </div>

            {/* Editorial Paragraph with Red Left Accent Bar (Directly from Reference Image) */}
            <div className="flex items-start gap-3 bg-white/90 backdrop-blur-sm p-4 border border-neutral-200/80 rounded-[2px] shadow-sm">
              <div className="w-1.5 h-16 bg-red-600 shrink-0 rounded-full" />
              <p className="text-xs text-neutral-700 leading-relaxed font-sans font-medium">
                {car.description}
              </p>
            </div>

            {/* Telemetry Spec Badges with Clean Line Icons (Directly from Reference Image car 3.jpg) */}
            <div className="space-y-3">
              {/* TOP SPEED BADGE */}
              <div className="flex items-center gap-4 bg-white border border-neutral-300/80 p-3.5 rounded-[2px] shadow-sm hover:border-red-500 transition-colors group">
                <div className="w-11 h-11 rounded-[2px] border-2 border-red-600 flex items-center justify-center text-red-600 bg-red-50/50 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-bold">
                    TOP SPEED
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-black">
                      {car.topSpeed.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold font-mono text-red-600 uppercase">
                      KM / H
                    </span>
                  </div>
                </div>
              </div>

              {/* MAX POWER BADGE */}
              <div className="flex items-center gap-4 bg-white border border-neutral-300/80 p-3.5 rounded-[2px] shadow-sm hover:border-red-500 transition-colors group">
                <div className="w-11 h-11 rounded-[2px] border-2 border-red-600 flex items-center justify-center text-red-600 bg-red-50/50 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-bold">
                    MAX POWER
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-black">
                      {car.power.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold font-mono text-red-600 uppercase">
                      {car.power.includes('HP') ? 'HP' : 'PS'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 0-100 ACCELERATION BADGE */}
              <div className="flex items-center gap-4 bg-white border border-neutral-300/80 p-3.5 rounded-[2px] shadow-sm hover:border-red-500 transition-colors group">
                <div className="w-11 h-11 rounded-[2px] border-2 border-red-600 flex items-center justify-center text-red-600 bg-red-50/50 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-bold">
                    0 - 100 KM/H
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-black">
                      {car.acceleration.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold font-mono text-red-600 uppercase">
                      SEC
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Spec Sheet Table (Matching Reference Image Column Table) */}
            <div className="bg-white/95 border border-neutral-200 p-4 rounded-[2px] font-mono text-xs shadow-sm">
              <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 pb-2 border-b border-neutral-200 flex justify-between items-center">
                <span>FACTORY SPECIFICATION TABLE</span>
                <span className="text-red-600 font-bold">#ARCHIVE</span>
              </div>
              <div className="mt-2.5 space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Model Designation</span>
                  <span className="font-bold text-black">{car.brand} {car.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Project / Code</span>
                  <span className="font-bold text-black">{isF40 ? 'Project F120' : car.vin.slice(0, 10)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Powertrain</span>
                  <span className="font-bold text-black">{car.engine}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Torque</span>
                  <span className="font-bold text-black">{car.torque}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Dry Weight</span>
                  <span className="font-bold text-black">{car.weight}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Transmission</span>
                  <span className="font-bold text-black">{car.transmission}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Drivetrain</span>
                  <span className="font-bold text-red-600">{car.drivetrain}</span>
                </div>
              </div>
            </div>

            {/* Hallmark / Signature from Reference Image */}
            <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 pt-1">
              DESIGN BY POOGA RACING // AERO VELOCE ARCHIVE
            </div>
          </div>

          {/* Right Column: Dynamic Car Centerpiece, Angular Stance & Interactive Hotspot Map */}
          <div className="lg:col-span-8 relative">
            {/* Top Blueprint CAD Subhead */}
            <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500 pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="font-bold uppercase text-neutral-900">
                  {car.brand} {car.model} // COMPOSITE ARCHITECTURE
                </span>
              </div>
              <div className="text-neutral-600 hidden sm:block">
                VIN: <span className="font-bold text-black">{car.vin.slice(0, 12)}•••</span>
              </div>
            </div>

            {/* Artwork Container with Interactive Hotspots */}
            <div className="relative my-4 min-h-[420px] sm:min-h-[480px] flex items-center justify-center">
              {/* Dynamic SVG Vector Artwork of the Ferrari F40 / Supercar in High Contrast */}
              <div className="w-full relative z-10 drop-shadow-2xl">
                <svg viewBox="0 0 1000 480" className="w-full h-auto">
                  <defs>
                    {/* Ferrari Rosso Corsa Gloss Gradient */}
                    <linearGradient id="ferrariRed" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="30%" stopColor="#dc2626" />
                      <stop offset="70%" stopColor="#b91c1c" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>

                    {/* Windshield & Cabin Glass */}
                    <linearGradient id="cabinGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="50%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>

                    {/* Alloy Wheel Gradient */}
                    <radialGradient id="alloyStar">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="70%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#64748b" />
                    </radialGradient>
                  </defs>

                  {/* Ground Shadow */}
                  <ellipse cx="500" cy="420" rx="440" ry="24" fill="rgba(0,0,0,0.3)" />

                  {/* Yellow Trajectory Speedline through car wheel centers (Reference item) */}
                  <line x1="80" y1="380" x2="940" y2="380" stroke="#facc15" strokeWidth="2.5" strokeDasharray="16 8" />

                  {/* Car Silhouette: Iconic Ferrari F40 / GT Wedge Architecture */}
                  {/* Fixed Elevated Kevlar Rear Wing */}
                  <path 
                    d="M 80 180 L 160 170 L 180 190 L 85 200 Z" 
                    fill="#991b1b" 
                    stroke="#dc2626" 
                    strokeWidth="3" 
                  />
                  {/* Wing Vertical Endplates */}
                  <path d="M 75 160 L 95 160 L 95 240 L 75 240 Z" fill="#b91c1c" stroke="#dc2626" strokeWidth="2" />
                  <line x1="140" y1="190" x2="160" y2="250" stroke="#7f1d1d" strokeWidth="6" />

                  {/* Rear Deck Clamshell with Engine Slats */}
                  <path
                    d="M 170 250 
                       L 340 250 
                       L 440 170 
                       L 640 170 
                       L 760 250 
                       L 920 280 
                       L 950 350 
                       L 890 370 
                       L 870 330 
                       Q 800 290 730 330 
                       L 720 370 
                       L 340 370 
                       L 330 330 
                       Q 260 290 190 330 
                       L 180 370 
                       L 90 370 
                       L 90 280 
                       L 170 250 Z"
                    fill="url(#ferrariRed)"
                    stroke="#b91c1c"
                    strokeWidth="3"
                  />

                  {/* Rear Louvered Engine Lexan Cover (Iconic F40 Feature) */}
                  <path d="M 220 250 L 400 240 L 420 180 L 250 190 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="260" y1="210" x2="380" y2="210" stroke="#64748b" strokeWidth="3" />
                  <line x1="250" y1="225" x2="390" y2="225" stroke="#64748b" strokeWidth="3" />
                  <line x1="240" y1="240" x2="395" y2="240" stroke="#64748b" strokeWidth="3" />

                  {/* Cabin Windshield & Side Windows */}
                  <path
                    d="M 435 180 
                       L 625 180 
                       L 730 250 
                       L 410 250 Z"
                    fill="url(#cabinGlass)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                  />
                  {/* A-Pillar & Window Divider */}
                  <line x1="625" y1="180" x2="710" y2="250" stroke="#dc2626" strokeWidth="5" />

                  {/* Iconic NACA Ducts on Flank and Hood (Signature F40 feature) */}
                  <polygon points="320,290 370,285 365,300" fill="#020617" stroke="#475569" strokeWidth="1" />
                  <polygon points="800,270 850,265 845,280" fill="#020617" stroke="#475569" strokeWidth="1" />

                  {/* Front Pop-Up Headlamp Outlines & Turn Indicators */}
                  <rect x="850" y="275" width="45" height="15" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                  <rect x="890" y="300" width="30" height="12" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

                  {/* Carbon Fiber Front Splitter Lip */}
                  <path d="M 910 365 L 965 365 L 970 350 L 920 350 Z" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* REAR WHEEL: Speedline 5-Star Modular Rim */}
                  <circle cx="260" cy="350" r="64" fill="#09090b" stroke="#334155" strokeWidth="8" />
                  <circle cx="260" cy="350" r="46" fill="#1e293b" stroke="#94a3b8" strokeWidth="3" />
                  {/* Star Spoke Lines */}
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <line
                      key={i}
                      x1="260"
                      y1="350"
                      x2={260 + 38 * Math.cos((angle * Math.PI) / 180)}
                      y2={350 + 38 * Math.sin((angle * Math.PI) / 180)}
                      stroke="url(#alloyStar)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                  ))}
                  <circle cx="260" cy="350" r="16" fill="#475569" stroke="#f1f5f9" strokeWidth="2" />
                  {/* Caliper */}
                  <rect x="235" y="310" width="26" height="18" rx="3" fill="#dc2626" />

                  {/* FRONT WHEEL: Speedline 5-Star Modular Rim */}
                  <circle cx="800" cy="350" r="62" fill="#09090b" stroke="#334155" strokeWidth="8" />
                  <circle cx="800" cy="350" r="44" fill="#1e293b" stroke="#94a3b8" strokeWidth="3" />
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <line
                      key={i}
                      x1="800"
                      y1="350"
                      x2={800 + 36 * Math.cos((angle * Math.PI) / 180)}
                      y2={350 + 36 * Math.sin((angle * Math.PI) / 180)}
                      stroke="url(#alloyStar)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                  ))}
                  <circle cx="800" cy="350" r="15" fill="#475569" stroke="#f1f5f9" strokeWidth="2" />
                  {/* Caliper */}
                  <rect x="780" y="310" width="26" height="18" rx="3" fill="#dc2626" />

                  {/* Prancing Horse Pininfarina side badge */}
                  <circle cx="680" cy="310" r="7" fill="#fbbf24" stroke="#000" strokeWidth="1" />
                </svg>

                {/* Interactive Hotspot Buttons Overlay */}
                {hotspots.map((spot) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setSelectedHotspot(selectedHotspot === spot.id ? null : spot.id)}
                    style={{ top: spot.coords.y, left: spot.coords.x }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30 transition-transform ${
                      selectedHotspot === spot.id ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white text-[10px] font-mono font-bold text-white items-center justify-center shadow-md">
                        +
                      </span>
                    </span>
                    {/* Tooltip Label */}
                    <span className="hidden group-hover:block absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-neutral-900 text-white border border-neutral-700 px-2.5 py-1 rounded-[2px] text-[10px] font-mono whitespace-nowrap z-40 shadow-xl">
                      {spot.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Hotspot Detail Drawer with prominent Close Button */}
            {selectedHotspot && (
              <div className="bg-white border-2 border-red-600 p-4 rounded-[2px] font-mono text-xs shadow-xl animate-fadeIn">
                {(() => {
                  const active = hotspots.find((h) => h.id === selectedHotspot);
                  if (!active) return null;
                  return (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-red-600 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                          <CornerDownRight className="w-4 h-4" />
                          <span>{active.title}</span>
                        </div>
                        <p className="text-neutral-700 mt-1 font-sans text-sm leading-relaxed">
                          {active.detail}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedHotspot(null)}
                        className="text-neutral-600 hover:text-black hover:bg-neutral-100 px-3 py-1.5 border border-neutral-300 font-bold rounded-[2px] transition-colors shrink-0"
                      >
                        CLOSE [X]
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Key Aero & Engineering Highlights */}
            <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {car.aeroHighlights.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                  <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Bottom Action Strip: Open 3D Studio & Reserve VIP Test Drive */}
            <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-500 uppercase">STATUS:</span>
                <span className="font-bold text-black uppercase">{car.stockStatus}</span>
                <span className="text-neutral-400">({car.location})</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="px-6 py-3 border-2 border-neutral-900 bg-white hover:bg-neutral-900 hover:text-white text-black font-bold uppercase tracking-widest text-xs rounded-[2px] transition-all flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>3D CAD STUDIO</span>
                </button>

                <button
                  type="button"
                  onClick={() => onBookTestDrive(car)}
                  className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs rounded-[2px] shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>BOOK PRIVATE TRACK SESSION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
