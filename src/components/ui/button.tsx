import {
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Fonts, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { Palette, useTheme } from "@/hooks/use-theme";

type Variant =
  "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends Omit<PressableProps, "style"> {
  variant?: Variant;
  size?: Size;
  label: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  variant = "default",
  size = "default",
  label,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: bgFor(variant, colors),
          borderColor: variant === "outline" ? colors.border : "transparent",
          borderWidth: variant === "outline" ? 1 : 0,
        },
        pressed && { opacity: Platform.OS === "ios" ? 0.7 : 0.85 },
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          { color: textColorFor(variant, colors) },
          Platform.OS === "ios" && styles.textIos,
          disabled && styles.textDisabled,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function bgFor(v: Variant, c: Palette): string {
  switch (v) {
    case "default":
      return c.primary;
    case "outline":
      return "transparent";
    case "ghost":
      return "transparent";
    case "destructive":
      return c.destructive;
    case "secondary":
      return c.secondary;
    case "link":
      return "transparent";
  }
}

function textColorFor(v: Variant, c: Palette): string {
  switch (v) {
    case "default":
      return c.primaryForeground;
    case "outline":
      return c.text;
    case "ghost":
      return c.text;
    case "destructive":
      return c.destructiveForeground;
    case "secondary":
      return c.secondaryForeground;
    case "link":
      return c.primary;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "ios"
      ? { borderRadius: 100 }
      : { borderRadius: Radius.md }),
    minHeight: TouchTarget,
    ...(Platform.OS === "web"
      ? { cursor: "pointer", transitionDuration: "150ms" }
      : {}),
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? Fonts.sans : undefined,
  },
  textIos: { fontWeight: "600", letterSpacing: -0.2 },
  disabled: { opacity: 0.5 },
  textDisabled: { opacity: 0.9 },
});

const sizeStyles = StyleSheet.create({
  default: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  sm: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  lg: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  icon: { width: TouchTarget, height: TouchTarget },
});
