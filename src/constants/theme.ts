import { Platform, type TextStyle } from "react-native";

export interface Palette {
  text: string;
  textSecondary: string;
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  primary: string;
  primaryForeground: string;
  primaryPressed: string;
  border: string;
  input: string;
  destructive: string;
  destructiveForeground: string;
  secondary: string;
  secondaryForeground: string;
}

export const Colors: { light: Palette; dark: Palette } = {
  light: {
    text: "#0f172a",
    textSecondary: "#60646C",
    background: "#f8fafc",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",

    // Green primary
    primary: "#16a34a",
    primaryForeground: "#ffffff",
    primaryPressed: "#15803d",

    // Form / borders
    border: "#e2e8f0",
    input: "#ffffff",

    // Destructive
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",

    // Secondary surface
    secondary: "#f1f5f9",
    secondaryForeground: "#0f172a",
  },
  dark: {
    text: "#e2e8f0",
    textSecondary: "#B0B4BA",
    background: "#18181b",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",

    primary: "#22c55e",
    primaryForeground: "#052e16",
    primaryPressed: "#16a34a",

    border: "#334155",
    input: "#0f172a",

    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    secondary: "#334155",
    secondaryForeground: "#e2e8f0",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    serif: "ui-serif, Georgia, serif",
    rounded: "ui-rounded, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
});

export const Typography = {
  h1: { fontSize: 32, fontWeight: "800", lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: "700", lineHeight: 32, letterSpacing: -0.3 },
  h3: { fontSize: 19, fontWeight: "600", lineHeight: 26 },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 23 },
  bodyLarge: { fontSize: 17, fontWeight: "400", lineHeight: 25 },
  muted: { fontSize: 15, fontWeight: "400", lineHeight: 23 },
  small: { fontSize: 13, fontWeight: "400", lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: "500", lineHeight: 16 },
  label: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  link: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
    textDecorationLine: "underline" as const,
  },
  code: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    fontFamily: "monospace",
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;

export type TypographyColor =
  "default" | "muted" | "primary" | "destructive" | "inverse";

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 8,
  lg: 12,
} as const;

export const TouchTarget = Platform.select({
  ios: 44,
  android: 48,
  default: 44,
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
