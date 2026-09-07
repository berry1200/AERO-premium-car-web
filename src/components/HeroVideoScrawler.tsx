import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Film, 
  X, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { CarSpec } from '../types';
import { playShiftGear } from '../utils/audioEngine';

interface HeroVideoScrawlerProps {
  cars: CarSpec[];
  selectedCar: CarSpec;
  onSelectCar: (car: CarSpec) => void;
  onClose?: () => void;
}

export const HeroVideoScrawler: React.FC<HeroVideoScrawlerProps> = ({
  cars,
  selectedCar,
  onSelectCar,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [timecode, setTimecode] = useState('00:04:18:12');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserInteractingRef = useRef(false);

  // Timecode generator simulating broadcast video frame counter
  useEffect(() => {
    let frame = 12;
    let sec = 18;
    let min = 4;
    const interval = setInterval(() => {
      if (!isPlaying) return;
      frame += Math.round(speed * 2);
      if (frame >= 30) {
        frame = 0;
        sec += 1;
        if (sec >= 60) {
          sec = 0;
          min += 1;
        }
      }
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimecode(`00:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Video-type smooth continuous scrawling motion
  useEffect(() => {
    let animId: number;
    const scrollStep = () => {
      if (isPlaying && !isUserInteractingRef.current && scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        el.scrollLeft += 0.85 * speed;

        // Infinite loop wrap-around
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speed]);

  const handleManualScrollPrev = () => {
    playShiftGear();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleManualScrollNext = () => {
    playShiftGear();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (isMinimized) {
    return (
      <div className="w-full bg-white border border-neutral-200 p-3 flex items-center justify-between rounded-[2px] shadow-sm my-4">
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-600">
          <Film className="w-4 h-4 text-red-600" />
          <span className="font-bold uppercase tracking-wider text-black">CINEMATIC MOTION REEL // SCRAWLER (COLLAPSED)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="px-3 py-1 bg-neutral-900 text-white hover:bg-black font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>EXPAND REEL</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-[2px]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="video-reel-scrawler" className="w-full bg-white border border-neutral-200 rounded-[2px] py-4 my-6 select-none shadow-md">
      {/* Video Scrawler Header & Controls Strip with Closing Tab */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-wrap items-center justify-between gap-4 mb-3 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>CINEMATIC REEL // COLLECTION TRACK</span>
          </div>

          {/* Timecode Readout */}
          <div className="bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-[2px] font-mono text-xs text-black font-bold tracking-widest">
            {timecode} <span className="text-[10px] text-neutral-500">60 FPS</span>
          </div>
        </div>

        {/* Video Reel Playback Controls & Closing Tab (Requirement 1) */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-[2px] border transition-colors ${
              isPlaying ? 'bg-neutral-100 border-neutral-300 text-black hover:bg-neutral-200' : 'bg-red-600 text-white border-red-600'
            }`}
            title={isPlaying ? 'Pause Motion Reel' : 'Play Motion Reel'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-neutral-100 border border-neutral-300 rounded-[2px] p-0.5">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold transition-colors ${
                  speed === s ? 'bg-white text-black shadow-xs font-black' : 'text-neutral-500 hover:text-black'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Jog Left / Right buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleManualScrollPrev}
              className="p-1 rounded-[2px] bg-neutral-100 border border-neutral-300 text-neutral-700 hover:text-black hover:bg-neutral-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleManualScrollNext}
              className="p-1 rounded-[2px] bg-neutral-100 border border-neutral-300 text-neutral-700 hover:text-black hover:bg-neutral-200"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimize / Close Tab Buttons */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-[2px] ml-1"
            title="Minimize Reel"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2 py-1 bg-neutral-200 hover:bg-red-600 hover:text-white text-neutral-800 text-[10px] font-bold uppercase rounded-[2px] transition-colors"
              title="Close Reel Section"
            >
              <X className="w-3 h-3" />
              <span>CLOSE</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Continuous Reel Track */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => { isUserInteractingRef.current = true; }}
        onMouseLeave={() => { isUserInteractingRef.current = false; }}
        onTouchStart={() => { isUserInteractingRef.current = true; }}
        onTouchEnd={() => { isUserInteractingRef.current = false; }}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 md:px-6 py-2 cursor-grab active:cursor-grabbing"
      >
        {/* Double the list for infinite seamless reel effect */}
        {[...cars, ...cars].map((car, index) => {
          const isSelected = selectedCar.id === car.id && index < cars.length;
          return (
            <div
              key={`${car.id}-${index}`}
              onClick={() => {
                onSelectCar(car);
                playShiftGear();
              }}
              className={`shrink-0 w-72 md:w-80 group relative rounded-[2px] border p-4 transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-red-50/40 border-2 border-red-600 shadow-md scale-[1.01]'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
              }`}
            >
              {/* Dynamic Color Accent Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: car.accentColor }}
              />

              <div className="mt-1 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{car.badgeFlag || '🏁'}</span>
                    <span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase font-bold">
                      {car.brand}
                    </span>
                  </div>
                  <h4 className="font-black italic text-xl text-black tracking-wide uppercase mt-0.5 transition-colors">
                    {car.model}
                  </h4>
                </div>

                {/* Status Pill */}
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-[2px] border uppercase ${
                    car.stockStatus === 'AVAILABLE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : car.stockStatus === 'RESERVED'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                  }`}
                >
                  {car.stockStatus}
                </span>
              </div>

              {/* Telemetry Snapshot in Crisp High Contrast */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-200 font-mono">
                <div>
                  <div className="text-[9px] text-neutral-500 uppercase font-bold">POWER</div>
                  <div className="text-xs font-black text-black mt-0.5">{car.power.split(' ')[0]}</div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-500 uppercase font-bold">0-100</div>
                  <div className="text-xs font-black text-red-600 mt-0.5">{car.acceleration}</div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-500 uppercase font-bold">SPEED</div>
                  <div className="text-xs font-black text-black mt-0.5">{car.topSpeed.split(' ')[0]}</div>
                </div>
              </div>

              {/* Interactive Hover Indicator */}
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-neutral-500 group-hover:text-black pt-2 border-t border-neutral-200">
                <span className="font-bold">{car.productionNumber}</span>
                <span className="flex items-center gap-1 font-black text-red-600">
                  {isSelected ? 'IN FOCUS ●' : 'VIEW POSTER →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
