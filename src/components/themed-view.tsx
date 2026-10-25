import { View, type ViewProps } from "react-native";
import { type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type = "background",
  ...otherProps
}: ThemedViewProps): React.JSX.Element {
  const { colors, scheme } = useTheme();
  const override: string | undefined =
    scheme === "dark" ? darkColor : lightColor;
  const backgroundColor: string = override ?? colors[type];

  return (
    <View
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
