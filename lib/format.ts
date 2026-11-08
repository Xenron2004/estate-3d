import type { PlotStatus } from './types';

export const M_TO_FT = 3.28084;
export const SQFT_PER_SQM = 10.7639;

/** Indian numbering: ₹1.63 Cr / ₹85.5 L / ₹42,000 */
export function formatINR(value: number): string {
  if (value >= 1e7) {
    const cr = value / 1e7;
    return `₹${cr.toFixed(2).replace(/\.?0+$/, '')} Cr`;
  }
  if (value >= 1e5) {
    const lakh = value / 1e5;
    return `₹${lakh.toFixed(1).replace(/\.0$/, '')} L`;
  }
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function formatINRFull(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function formatSqft(value: number): string {
  return `${Math.round(value).toLocaleString('en-IN')} sq ft`;
}

export function formatSqm(value: number): string {
  return `${Math.round(value).toLocaleString('en-IN')} m²`;
}

export function feet(metres: number): string {
  return `${Math.round(metres * M_TO_FT)} ft`;
}

export function dimensions(plot: { width: number; depth: number }): string {
  return `${feet(plot.width)} × ${feet(plot.depth)}`;
}

export function statusLabel(status: PlotStatus): string {
  switch (status) {
    case 'available':
      return 'Available';
    case 'booked':
      return 'Booked';
    case 'sold':
      return 'Sold';
  }
}

export function statusHint(status: PlotStatus): string {
  switch (status) {
    case 'available':
      return 'Open for reservation';
    case 'booked':
      return 'Reserved — under agreement';
    case 'sold':
      return 'Transferred — no longer available';
  }
}

export function distanceLabel(metres: number): string {
  if (metres < 150) return `${Math.round(metres / 10) * 10} m`;
  if (metres < 1000) return `${Math.round(metres / 50) * 50} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}

export function distanceBand(metres: number): string {
  if (metres < 150) return 'Under 150 m';
  if (metres < 400) return '150 – 400 m';
  if (metres < 700) return '400 – 700 m';
  return '700 m +';
}
