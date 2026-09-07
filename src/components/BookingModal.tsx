import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  Award, 
  Download, 
  Printer, 
  ChevronRight, 
  Car,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CarSpec, BookingFormState, BookingConfirmation } from '../types';
import { TRACK_LOCATIONS } from '../data/cars';
import { playShiftGear } from '../utils/audioEngine';

interface BookingModalProps {
  car: CarSpec | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (confirmation: BookingConfirmation) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  car,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  if (!isOpen || !car) return null;

  const [form, setForm] = useState<BookingFormState>({
    carId: car.id,
    customerName: '',
    email: '',
    phone: '',
    preferredDate: '2026-09-18',
    timeSlot: '10:00 AM - Morning Track Session',
    trackLocation: TRACK_LOCATIONS[0].name,
    experienceLevel: 'Track Intermediate',
    conciergeServices: ['FIA Certified Factory Racing Instructor'],
    notes: '',
  });

  const [confirmedData, setConfirmedData] = useState<BookingConfirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available upgrades
  const upgrades = [
    { id: 'instructor', label: 'FIA Certified Factory Racing Instructor', price: 1500 },
    { id: 'telemetry', label: 'In-Car 4K Telemetry & Drone Video Suite', price: 850 },
    { id: 'gear', label: 'Bespoke Carbon Racing Helmet & Nomex Gear', price: 1200 },
    { id: 'heli', label: 'Private Helicopter Airport Transfer', price: 2400 },
  ];

  const toggleUpgrade = (label: string) => {
    playShiftGear();
    if (form.conciergeServices.includes(label)) {
      setForm({ ...form, conciergeServices: form.conciergeServices.filter((s) => s !== label) });
    } else {
      setForm({ ...form, conciergeServices: [...form.conciergeServices, label] });
    }
  };

  const calculateTotalDeposit = () => {
    let base = 2500; // Refundable deposit
    upgrades.forEach((u) => {
      if (form.conciergeServices.includes(u.label)) {
        base += u.price;
      }
    });
    return base;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const refId = `AERO-VIP-${Math.floor(100000 + Math.random() * 900000)}`;
      const confirmation: BookingConfirmation = {
        referenceId: refId,
        bookingTime: new Date().toISOString(),
        car,
        details: form,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(refId)}`,
      };

      setConfirmedData(confirmation);
      setIsSubmitting(false);
      onConfirmBooking(confirmation);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#dc2626', '#ef4444', '#facc15', '#111111', '#ffffff'],
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-neutral-300 rounded-[2px] p-6 md:p-8 shadow-2xl my-8 text-neutral-900">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-[2px] bg-neutral-100 border border-neutral-300 text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmedData ? (
          /* Booking Form Screen */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-red-600 uppercase tracking-[0.25em] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ATELIER CONCIERGE // VIP BOOKING</span>
              </div>
              <h3 className="font-black italic text-3xl md:text-4xl text-black uppercase tracking-tight mt-1">
                PRIVATE TRACK & TEST DRIVE RESERVATION
              </h3>
              <p className="text-xs font-mono text-neutral-500 mt-1">
                Selected Vehicle: <strong className="text-black">{car.brand} {car.model}</strong> — VIN: {car.vin}
              </p>
            </div>

            {/* Vehicle Card Snapshot */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-[2px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-neutral-500">{car.subTitle}</div>
                <div className="font-black italic text-xl text-black mt-0.5">{car.brand} {car.model}</div>
                <div className="text-xs font-mono text-red-600 font-bold mt-1">{car.power} // {car.topSpeed}</div>
              </div>
              <div className="text-right font-mono">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">LOCATION ALLOCATION</div>
                <div className="text-xs font-bold text-neutral-800">{car.location}</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● PRIORITY RESERVATION OPEN</div>
              </div>
            </div>

            {/* Grid of Choices: Track Location, Date, Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {/* Track Location */}
              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px] tracking-wider">
                  Track / Circuit Venue
                </label>
                <select
                  value={form.trackLocation}
                  onChange={(e) => setForm({ ...form, trackLocation: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-[2px] px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-red-600"
                >
                  {TRACK_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px] tracking-wider">
                  Preferred Session Date
                </label>
                <input
                  type="date"
                  value={form.preferredDate}
                  min="2026-09-08"
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  required
                  className="w-full bg-white border border-neutral-300 rounded-[2px] px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px] tracking-wider">
                  Time Slot
                </label>
                <select
                  value={form.timeSlot}
                  onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-[2px] px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-red-600"
                >
                  <option value="09:00 AM - Morning Golden Hour">09:00 AM - Morning Golden Hour Session</option>
                  <option value="11:30 AM - High Noon Track Run">11:30 AM - High Noon Track Run</option>
                  <option value="02:30 PM - Afternoon Aerodynamic Run">02:30 PM - Afternoon Aerodynamic Run</option>
                  <option value="05:30 PM - Sunset Twilight Run">05:30 PM - Sunset Twilight Run</option>
                </select>
              </div>

              {/* Driver Experience Level */}
              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px] tracking-wider">
                  Driver Experience Level
                </label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) => setForm({ ...form, experienceLevel: e.target.value as any })}
                  className="w-full bg-white border border-neutral-300 rounded-[2px] px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-red-600"
                >
                  <option value="Track Novice">Track Novice (Guided Pacing)</option>
                  <option value="Track Intermediate">Track Intermediate (Sport Mode Unlocked)</option>
                  <option value="Pro / FIA License">Pro / FIA Competition License (Full Corsa / ESC Off)</option>
                </select>
              </div>
            </div>

            {/* Concierge Services Upgrades */}
            <div>
              <label className="block font-mono text-[10px] text-neutral-600 uppercase tracking-wider font-bold mb-2">
                Bespoke Atelier Concierge Upgrades
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {upgrades.map((up) => {
                  const isChecked = form.conciergeServices.includes(up.label);
                  return (
                    <button
                      key={up.id}
                      type="button"
                      onClick={() => toggleUpgrade(up.label)}
                      className={`p-3 rounded-[2px] border text-left flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-red-50 border-red-600 text-red-900 font-bold'
                          : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      <span className="text-[11px] leading-tight">{up.label}</span>
                      <span className={`text-xs font-bold shrink-0 ml-2 ${isChecked ? 'text-red-700' : 'text-neutral-900'}`}>
                        +€{up.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px] tracking-wider">
                  Client Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sebastian Vance"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-[2px] px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px] tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. s.vance@atelier-club.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-[2px] px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Refundable Deposit & CTA */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">REFUNDABLE VIP ESCROW DEPOSIT</div>
                <div className="text-2xl font-mono font-black text-black">
                  €{calculateTotalDeposit().toLocaleString()} <span className="text-xs text-emerald-600 font-bold">100% Fully Refundable</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-[2px] bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>AUTHORIZING ALLOCATION...</span>
                ) : (
                  <>
                    <span>CONFIRM VIP RESERVATION</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Pass Screen */
          <div className="space-y-6 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <span className="font-mono text-xs text-emerald-600 uppercase tracking-widest font-bold">
                RESERVATION CONFIRMED // ALLOCATION SECURED
              </span>
              <h3 className="font-black italic text-3xl md:text-5xl text-black uppercase tracking-tight mt-1">
                OFFICIAL VIP TRACK PASS
              </h3>
              <p className="text-xs font-mono text-neutral-500 mt-1">
                Booking Reference: <strong className="text-black font-bold">{confirmedData.referenceId}</strong>
              </p>
            </div>

            {/* Printable Ticket Pass Badge */}
            <div className="bg-neutral-50 border-2 border-red-600 rounded-[2px] p-6 text-left font-mono max-w-lg mx-auto shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                VIP ADMITTANCE
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">SUPERCAR SPECIFICATION</div>
                  <div className="text-xl font-bold text-black uppercase mt-0.5">{car.brand} {car.model}</div>
                  <div className="text-xs text-neutral-600 mt-1">{car.engine}</div>
                </div>
                <img
                  src={confirmedData.qrCodeUrl}
                  alt="QR Code"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 bg-white p-1 rounded-[2px] border border-neutral-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-200 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">CLIENT NAME</div>
                  <div className="text-black font-bold">{confirmedData.details.customerName || 'VIP Guest'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">DATE & SESSION</div>
                  <div className="text-neutral-800">{confirmedData.details.preferredDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">CIRCUIT VENUE</div>
                  <div className="text-neutral-800">{confirmedData.details.trackLocation}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">EXPERIENCE LEVEL</div>
                  <div className="text-emerald-700 font-bold">{confirmedData.details.experienceLevel}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-[2px] bg-neutral-100 border border-neutral-300 text-neutral-800 hover:text-black hover:bg-neutral-200 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT PASS</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-[2px] bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md"
              >
                RETURN TO SHOWROOM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
