/**
 * Configuration des couleurs Hearst
 * Charte graphique : Noir + Vert émeraude
 */

export const HEARST_COLORS = {
  // Noir Hearst (principal)
  black: '#000000',
  blackLight: '#1a1a1a',
  blackHover: '#2d2d2d',
  
  // Vert Hearst (accent)
  green: '#10b981',      // Vert émeraude
  greenLight: '#34d399',
  greenDark: '#059669',
  greenHover: '#0d9488',
  
  // Neutres
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Statuts
  success: '#10b981',    // Vert Hearst
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
} as const;

export const HEARST_GRADIENTS = {
  blackToGray: 'from-black to-gray-900',
  greenToEmerald: 'from-green-500 to-emerald-600',
  headerGradient: 'from-black via-gray-900 to-black',
  greenGlow: 'from-green-500/20 to-transparent'
} as const;

export type HearstColor = keyof typeof HEARST_COLORS;
export type HearstGradient = keyof typeof HEARST_GRADIENTS;
