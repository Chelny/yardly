/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { ColorSchemeName } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type Palette = typeof Colors.light;

export function useTheme(): {
  colors: Palette;
  scheme: ColorSchemeName | null;
} {
  const scheme: ColorSchemeName | null = useColorScheme();
  const palette: Palette = scheme === "dark" ? Colors.dark : Colors.light;
  return { colors: palette, scheme };
}
