/**
 * Legacy Asset Intelligence — Executive Color System
 * Dark, sophisticated palette with gold and silver accents
 * Inspired by McKinsey, Bain, and top-tier consulting firms
 */

export const COLORS = {
  // Primary Backgrounds
  charcoal: "#0B0F13",        // Deepest background
  navy: "#111820",            // Section backgrounds
  slate: "#1A2230",           // Card/panel backgrounds
  
  // Accent Colors
  gold: "#C9A84C",            // Primary accent — warm gold
  goldLight: "#DFC06A",       // Hover/active gold
  goldMuted: "rgba(201,168,76,0.15)", // Subtle gold wash
  silver: "#C8D0D8",          // Secondary accent — brighter silver
  silverLight: "#E0E6EC",     // Light silver for headings — near white
  
  // Functional Colors
  emerald: "#1B4D3E",         // Success/positive
  teal: "#0D9488",            // Charts/data accent
  tealLight: "#14B8A6",       // Chart secondary
  
  // Text Colors
  text: "#F5F7FA",            // Primary text on dark — near white
  textMuted: "#B0BAC5",       // Secondary/muted text — significantly brighter
  textDark: "#1E293B",        // Text on light surfaces (forms)
  
  // Borders
  border: "rgba(168,178,189,0.12)",   // Subtle border on dark
  borderLight: "rgba(168,178,189,0.25)", // Visible border
  
  // Backgrounds (legacy support)
  bgDark: "#0B0F13",
  bgLight: "#0B0F13",         // Now dark everywhere
  cardBg: "#1A2230",          // Dark card background
  
  // Legacy aliases (kept for compatibility)
  amber: "#C9A84C",
  platinum: "#A8B2BD",
  platinumDark: "#B0BAC5",
  slateLight: "#2A3A4E",
  goldPale: "rgba(201,168,76,0.08)",
  tealPale: "rgba(13,148,136,0.1)",
  amberPale: "rgba(201,168,76,0.08)",
} as const;

export type ColorKey = keyof typeof COLORS;

// Background Image — Office scene with LAI logo on wall
export const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-hero-2oLJZvt3jJ23DVAW3Npj4G.webp";
