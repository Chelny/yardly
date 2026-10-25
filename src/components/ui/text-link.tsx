import { Link, type LinkProps } from "expo-router";
import { Platform, Pressable } from "react-native";
import { ThemedText, type ThemedTextProps } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

type TextLinkVariant = "inline" | "standalone" | "muted";

interface TextLinkProps extends Omit<LinkProps, "children" | "style"> {
  children: string;
  variant?: TextLinkVariant;
  textProps?: Omit<ThemedTextProps, "children">;
}

export function TextLink({
  children,
  variant = "standalone",
  textProps,
  ...linkProps
}: TextLinkProps): React.JSX.Element {
  const { colors } = useTheme();
  const color: string =
    variant === "muted" ? colors.textSecondary : colors.primary;
  const underline: boolean = variant !== "muted";

  const linkStyle = {
    color,
    ...(underline && Platform.OS === "web"
      ? { textDecorationLine: "underline" as const }
      : {}),
  };

  if (variant === "inline") {
    return (
      <Link
        {...linkProps}
        asChild
      >
        <ThemedText
          type="inherit"
          style={linkStyle}
          {...textProps}
        >
          {children}
        </ThemedText>
      </Link>
    );
  }

  return (
    <Link
      {...linkProps}
      asChild
    >
      <Pressable accessibilityRole="link">
        <ThemedText
          type={underline ? "linkPrimary" : "body"}
          style={linkStyle}
          {...textProps}
        >
          {children}
        </ThemedText>
      </Pressable>
    </Link>
  );
}
