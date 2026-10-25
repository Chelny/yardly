import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface SwitchProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

export function Switch({
  value,
  onValueChange,
  label,
  required,
  error,
  hint,
  disabled,
}: SwitchProps): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        onPress={() => onValueChange(!value)}
        style={({ pressed }) => [
          styles.row,
          pressed && { opacity: 0.8 },
          disabled && { opacity: 0.5 },
        ]}
        hitSlop={8}
      >
        <View
          style={[
            styles.track,
            {
              backgroundColor: value
                ? colors.primary
                : colors.backgroundSelected,
            },
            Platform.OS === "ios" ? styles.trackIos : styles.trackAndroid,
          ]}
        >
          <View
            style={[
              styles.thumb,
              Platform.OS === "ios" ? styles.thumbIos : styles.thumbAndroid,
              value &&
                (Platform.OS === "ios"
                  ? styles.thumbOnIos
                  : styles.thumbOnAndroid),
            ]}
          />
        </View>
        {label ? (
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
            {required ? (
              <Text style={{ color: colors.destructive }}> *</Text>
            ) : null}
          </Text>
        ) : null}
      </Pressable>
      {error ? (
        <Text style={[styles.error, { color: colors.destructive }]}>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
  },
  track: { justifyContent: "center" },
  trackIos: { width: 51, height: 31, borderRadius: 16 },
  trackAndroid: { width: 36, height: 20, borderRadius: 10 },
  thumb: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  thumbIos: { width: 27, height: 27, borderRadius: 14, marginLeft: 2 },
  thumbAndroid: { width: 16, height: 16, borderRadius: 8, marginLeft: 2 },
  thumbOnIos: { marginLeft: 22 },
  thumbOnAndroid: { marginLeft: 18 },
  label: { fontSize: 15, flexShrink: 1 },
  error: { fontSize: 13 },
  hint: { fontSize: 13 },
});
