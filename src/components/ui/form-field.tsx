import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FormField({
  label,
  required,
  error,
  hint,
  children,
  style,
}: FormFieldProps): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text
          style={[styles.label, { color: colors.text }]}
          accessibilityRole="text"
        >
          {label}
          {required ? (
            <Text style={{ color: colors.destructive }}> *</Text>
          ) : null}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text
          style={[styles.error, { color: colors.destructive }]}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one },
  label: { fontSize: 14, fontWeight: "500" },
  error: { fontSize: 13, marginTop: 2 },
  hint: { fontSize: 13, marginTop: 2 },
});
