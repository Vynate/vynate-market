import { db } from "@/lib/db";
import type { ThemeConfig } from "@/types";

// Default theme configuration
export const defaultTheme: ThemeConfig = {
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  accentColor: "#f59e0b",
  fontFamily: "Geist",
  borderRadius: "0.5rem",
  buttonStyle: "filled",
  darkMode: "system",
  logoPosition: "left",
  homepageLayout: "default",
};

// Available font families
export const fontFamilies = [
  { value: "Geist", label: "Geist" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans" },
  { value: "Inter", label: "Inter" },
  { value: "Outfit", label: "Outfit" },
  { value: "Sora", label: "Sora" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Poppins", label: "Poppins" },
];

// Border radius presets
export const borderRadiusPresets = [
  { value: "0", label: "Sharp" },
  { value: "0.25rem", label: "Subtle" },
  { value: "0.5rem", label: "Rounded" },
  { value: "0.75rem", label: "More Rounded" },
  { value: "1rem", label: "Pill" },
];

// Button style options
export const buttonStyles = [
  { value: "filled", label: "Filled" },
  { value: "outlined", label: "Outlined" },
  { value: "soft", label: "Soft" },
];

// Dark mode options
export const darkModeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Always Light" },
  { value: "dark", label: "Always Dark" },
];

// Homepage layout options
export const homepageLayouts = [
  { value: "default", label: "Default" },
  { value: "minimal", label: "Minimal" },
  { value: "grid-focused", label: "Grid Focused" },
];

/**
 * Get theme settings from database
 */
export async function getThemeSettings(): Promise<ThemeConfig> {
  try {
    const settings = await db.themeSettings.findFirst();
    
    if (!settings) {
      return defaultTheme;
    }

    return {
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      accentColor: settings.accentColor,
      fontFamily: settings.fontFamily,
      borderRadius: settings.borderRadius,
      buttonStyle: settings.buttonStyle as "filled" | "outlined" | "soft",
      darkMode: settings.darkMode as "system" | "light" | "dark",
      logoPosition: settings.logoPosition as "left" | "center",
      customCSS: settings.customCSS || undefined,
      homepageLayout: settings.homepageLayout,
    };
  } catch (error) {
    console.error("Failed to get theme settings:", error);
    return defaultTheme;
  }
}

/**
 * Generate CSS variables from theme config
 */
export function generateThemeCSSVariables(theme: ThemeConfig): string {
  const primary = hexToHSL(theme.primaryColor);
  const secondary = hexToHSL(theme.secondaryColor);
  const accent = hexToHSL(theme.accentColor);

  return `
    :root {
      --primary: ${primary};
      --primary-foreground: 0 0% 100%;
      --secondary: ${secondary};
      --secondary-foreground: 0 0% 100%;
      --accent: ${accent};
      --accent-foreground: 0 0% 0%;
      --radius: ${theme.borderRadius};
      --font-sans: "${theme.fontFamily}", system-ui, sans-serif;
    }
    ${theme.customCSS || ""}
  `;
}

/**
 * Convert hex color to HSL string
 */
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Generate color palette from a base color
 */
export function generateColorPalette(baseHex: string): Record<string, string> {
  const hsl = hexToHSL(baseHex);
  const [h, s, l] = hsl.split(" ").map((v) => parseFloat(v));

  return {
    50: hslToHex(h!, Math.max(s! - 40, 10), Math.min(l! + 45, 98)),
    100: hslToHex(h!, Math.max(s! - 30, 15), Math.min(l! + 35, 95)),
    200: hslToHex(h!, Math.max(s! - 20, 20), Math.min(l! + 25, 90)),
    300: hslToHex(h!, Math.max(s! - 10, 30), Math.min(l! + 15, 80)),
    400: hslToHex(h!, s!, Math.min(l! + 5, 70)),
    500: baseHex,
    600: hslToHex(h!, Math.min(s! + 5, 100), Math.max(l! - 10, 30)),
    700: hslToHex(h!, Math.min(s! + 10, 100), Math.max(l! - 20, 25)),
    800: hslToHex(h!, Math.min(s! + 15, 100), Math.max(l! - 30, 20)),
    900: hslToHex(h!, Math.min(s! + 20, 100), Math.max(l! - 40, 15)),
    950: hslToHex(h!, Math.min(s! + 25, 100), Math.max(l! - 50, 10)),
  };
}

/**
 * Convert HSL values to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}
