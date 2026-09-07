export interface CarSpec {
  id: string;
  brand: string;
  model: string;
  subTitle: string;
  year: number;
  tagline: string;
  quote?: string;
  quoteAuthor?: string;
  heroHeadline: string;
  badgeText: string;
  price: number;
  currency: string;
  accentColor: string;
  accentGradient: string;
  badgeFlag?: string; // e.g. "🇮🇹", "🇩🇪", "🇺🇸"
  
  // Performance Telemetry
  engine: string;
  power: string; // e.g. "1,000 HP" or "525 PS"
  powerHp: number;
  torque: string; // e.g. "800 NM"
  acceleration: string; // e.g. "2.5 SEC"
  accelerationSec: number;
  topSpeed: string; // e.g. "340 KM/H"
  topSpeedKmh: number;
  drivetrain: string; // e.g. "AWD" or "RWD"
  transmission: string;
  weight: string; // e.g. "1,570 KG"
  downforce?: string; // e.g. "409 KG @ 200 KM/H"
  nurburgringTime?: string; // e.g. "6:49.328"
  fioranoTime?: string; // e.g. "1:19.5"

  // Dimensions & Tech CAD
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  camberAngle?: string;

  // Design Texture & Colors
  defaultPaintColor: string;
  availableColors: { name: string; hex: string }[];
  aeroHighlights: string[];
  description: string;

  // Real-time Inventory Info
  vin: string;
  productionNumber: string;
  stockStatus: 'AVAILABLE' | 'RESERVED' | 'ALLOCATION' | 'DELIVERY_PENDING';
  location: string;
  mileageKm: number;
  stockUnits: number;
}

export interface BookingFormState {
  carId: string;
  customerName: string;
  email: string;
  phone: string;
  preferredDate: string;
  timeSlot: string;
  trackLocation: string;
  experienceLevel: 'Track Novice' | 'Track Intermediate' | 'Pro / FIA License';
  conciergeServices: string[];
  notes: string;
}

export interface BookingConfirmation {
  referenceId: string;
  bookingTime: string;
  car: CarSpec;
  details: BookingFormState;
  qrCodeUrl: string;
}

export type View3DMode = 'STUDIO' | 'BLUEPRINT' | 'WIND_TUNNEL' | 'X_RAY';
