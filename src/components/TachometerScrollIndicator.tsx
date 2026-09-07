import React, { useEffect, useState } from 'react';

export const TachometerScrollIndicator: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      
      setProgress(currentProgress);
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Tachometer calculations
  // Idle: 1,000 RPM, Redline: 9,000 RPM (starts redlining at ~7,800 RPM / 85% progress)
  const currentRpm = Math.round(1000 + (progress / 100) * 8000);
  const isRedline = progress >= 85;
  const isRevLimiter = progress >= 96;

  // Gear emulation based on speed/progress
  const getGear = (pct: number) => {
    if (pct < 3) return 'N';
    if (pct < 20) return '1';
    if (pct < 40) return '2';
    if (pct < 60) return '3';
    if (pct < 80) return '4';
    if (pct < 95) return '5';
    return '6';
  };

  const gear = getGear(progress);

  // Speed estimation (0 to 324 km/h F40 top speed)
  const speedKmh = Math.round((progress / 100) * 324);

  return (
    <div 
      id="tachometer-progress-hud"
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none select-none font-mono"
      aria-label="High speed scroll tachometer"
    >
      {/* Background Track with Subtle Micro Ticks */}
      <div className="relative w-full h-[3px] bg-neutral-900/10 backdrop-blur-xs overflow-hidden">
        {/* Subtle Tachometer Segment Dividers (0 to 9x1000 RPM marks) */}
        <div className="absolute inset-0 flex justify-between px-1 opacity-40">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className={`h-full w-[1px] ${
                i >= 8 ? 'bg-red-500/80' : 'bg-neutral-400/50'
              }`}
            />
          ))}
        </div>

        {/* The Active Filling High-Speed Red Laser Line */}
        <div
          className={`h-full transition-all duration-75 ease-out relative ${
            isRedline
              ? 'bg-gradient-to-r from-red-700 via-red-600 to-red-500'
              : 'bg-gradient-to-r from-red-600 to-red-500'
          }`}
          style={{ width: `${progress}%` }}
        >
          {/* Laser Head Glow / Leading Edge Beam */}
          <div 
            className={`absolute right-0 top-1/2 -translate-y-1/2 h-full w-8 bg-gradient-to-r from-transparent to-white/90 ${
              isRedline ? 'shadow-[0_0_12px_#ef4444,0_0_4px_#ffffff]' : 'shadow-[0_0_8px_rgba(239,68,68,0.8)]'
            }`}
          />

          {/* Rev Limiter Shift Strobe at Tip */}
          {isRevLimiter && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-ping" />
          )}
        </div>
      </div>

      {/* Redline Warning Zone Marker on the far right (85% to 100%) */}
      <div className="absolute top-0 right-0 w-[15%] h-[3px] pointer-events-none bg-red-600/10 border-l border-red-500/40" />

      {/* Ultra-Minimalist Floating Telemetry HUD Capsule (Visible when scrolling or hover) */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-end">
        <div
          className={`mt-1.5 transition-all duration-300 transform ${
            isScrolling
              ? 'opacity-100 translate-y-0'
              : 'opacity-70 hover:opacity-100 translate-y-0'
          }`}
        >
          <div className="inline-flex items-center gap-2.5 px-2.5 py-1 rounded-[2px] bg-black/85 backdrop-blur-md text-white border border-neutral-800 shadow-lg text-[10px] tracking-wider leading-none">
            {/* Shift Light Indicator LED */}
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isRevLimiter
                    ? 'bg-red-500 animate-ping'
                    : isRedline
                    ? 'bg-red-500 animate-pulse'
                    : progress > 50
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="text-[9px] text-neutral-400 font-bold uppercase">
                {isRedline ? 'REDLINE' : 'TACH'}
              </span>
            </div>

            <span className="text-neutral-600">|</span>

            {/* Live RPM Readout */}
            <div className="flex items-baseline gap-0.5">
              <span className={`font-black tracking-tight ${isRedline ? 'text-red-400 font-extrabold' : 'text-neutral-100'}`}>
                {currentRpm.toLocaleString()}
              </span>
              <span className="text-[8px] text-neutral-400 font-bold">RPM</span>
            </div>

            <span className="text-neutral-600">|</span>

            {/* Gear Indicator */}
            <div className="flex items-baseline gap-0.5">
              <span className="text-[8px] text-neutral-400">GEAR</span>
              <span className="font-bold text-red-500">{gear}</span>
            </div>

            <span className="text-neutral-600 hidden sm:inline">|</span>

            {/* Estimated Velocity */}
            <div className="hidden sm:flex items-baseline gap-0.5">
              <span className="font-bold text-neutral-200">{speedKmh}</span>
              <span className="text-[8px] text-neutral-400">KM/H</span>
            </div>

            <span className="text-neutral-600">|</span>

            {/* Scroll Progress % */}
            <div className="text-neutral-400">
              <span className="text-neutral-200 font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
