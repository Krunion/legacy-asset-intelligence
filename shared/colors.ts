/**
 * Unified Color Scheme for Legacy Asset Intelligence
 * Premium Enterprise Design with Gold Accents
 */

export const COLORS = {
  // Primary Colors
  charcoal: "#0F1419",      // Deep black background
  gold: "#D4AF37",          // Premium gold accents
  
  // Secondary Colors
  emerald: "#1B4D3E",       // Deep emerald
  teal: "#0D9488",          // Teal accent
  
  // Text Colors
  text: "#FFFFFF",          // White text on dark backgrounds
  textDark: "#1E293B",      // Dark text on light backgrounds
  textMuted: "#B0B5BD",     // Muted text
  
  // Backgrounds
  bgDark: "#0F1419",        // Dark background
  bgLight: "#FAFBFC",       // Light background
  cardBg: "#FFFFFF",        // Card background
  
  // Borders & Accents
  border: "#E5E7EB",        // Light border
  borderDark: "#2C3E50",    // Dark border
  
  // Utility Colors
  platinum: "#E8E9EB",      // Light platinum
  platinumDark: "#D1D5DB",  // Dark platinum
  slate: "#2C3E50",         // Slate gray
  slateLight: "#3D5A73",    // Light slate
  
  // Legacy Support (deprecated - use primary colors instead)
  navy: "#1A2332",
  amber: "#D4AF37",
  goldLight: "#E8C547",
  tealLight: "#14B8A6",
  tealPale: "#CCFBF1",
  amberPale: "#FEF3C7",
} as const;

export type ColorKey = keyof typeof COLORS;
