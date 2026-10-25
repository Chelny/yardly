import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";
import { Fonts, ThemeColor, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "subtitle"
    | "small"
    | "smallBold"
    | "caption"
    | "label"
    | "link"
    | "linkPrimary"
    | "code"
    | "h1"
    | "h2"
    | "h3"
    | "body"
    | "bodyLarge"
    | "muted"
    | "inherit";
  themeColor?: ThemeColor;
  align?: "left" | "center" | "right";
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  align,
  ...rest
}: ThemedTextProps): React.JSX.Element {
  const { colors } = useTheme();
  const isInherit = type === "inherit";

  return (
    <Text
      style={[
        isInherit ? undefined : (styles[type] as TextStyle),
        { color: colors[themeColor ?? defaultColorFor(type)] },
        align && { textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}

function defaultColorFor(type: ThemedTextProps["type"]): ThemeColor {
  switch (type) {
    case "muted":
    case "caption":
    case "small":
      return "textSecondary";
    case "link":
    case "linkPrimary":
      return "primary";
    default:
      return "text";
  }
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24, fontWeight: 500 },
  title: { fontSize: 48, fontWeight: 600, lineHeight: 52 },
  subtitle: { fontSize: 32, lineHeight: 44, fontWeight: 600 },
  small: { fontSize: 14, lineHeight: 20, fontWeight: 500 },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: 700 },
  link: {},
  linkPrimary: { fontWeight: 500 },
  code: {
    fontFamily: Fonts?.mono,
    fontWeight: Platform.select({ android: "700" as const }) ?? 500,
    fontSize: 12,
  },
  h1: Typography.h1,
  h2: Typography.h2,
  h3: Typography.h3,
  body: Typography.body,
  bodyLarge: Typography.bodyLarge,
  muted: Typography.muted,
  caption: Typography.caption,
  label: Typography.label,
});
