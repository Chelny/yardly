import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FormField } from "@/components/ui/form-field";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface RadioProps<T extends string> {
  value: T | null;
  onValueChange: (v: T) => void;
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  inline?: boolean;
  children: React.ReactNode;
}

/** Group wrapper with shared label/error/hint */
export function RadioGroup<T extends string>({
  value,
  onValueChange,
  label,
  required,
  error,
  hint,
  disabled,
  inline,
  children,
}: RadioProps<T>): React.JSX.Element {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
    >
      <View
        accessibilityRole="radiogroup"
        style={{ gap: Spacing.two }}
      >
        <View
          style={{ gap: Spacing.two, flexDirection: inline ? "row" : "column" }}
        >
          {React.Children.map(children, (child) =>
            React.isValidElement<RadioItemProps<T>>(child)
              ? React.cloneElement(child, {
                  _groupValue: value,
                  _onGroupChange: onValueChange,
                  _disabled: disabled,
                })
              : child
          )}
        </View>
      </View>
    </FormField>
  );
}

interface RadioItemProps<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
  _groupValue?: T | null;
  _onGroupChange?: (v: T) => void;
  _disabled?: boolean;
}

/** Individual radio — use inside RadioGroup */
export function Radio({
  value,
  label,
  disabled,
  _groupValue,
  _onGroupChange,
  _disabled,
}: RadioItemProps): React.JSX.Element {
  const { colors } = useTheme();
  const selected = _groupValue === value;
  const isDisabled = disabled || _disabled;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => _onGroupChange?.(value)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      hitSlop={8}
    >
      <View
        style={[
          styles.outer,
          { borderColor: selected ? colors.primary : colors.border },
          Platform.OS === "ios" && { borderRadius: 11 },
        ]}
      >
        {selected && (
          <View style={[styles.inner, { backgroundColor: colors.primary }]} />
        )}
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
  },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 15 },
});
