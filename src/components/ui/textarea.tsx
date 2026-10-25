import { useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { FormField } from "@/components/ui/form-field";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface TextareaProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  minHeight?: number;
}

export function Textarea({
  label,
  required,
  error,
  hint,
  style,
  minHeight = 100,
  onFocus,
  onBlur,
  ...props
}: TextareaProps): React.JSX.Element {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.input,
            borderColor: error
              ? colors.destructive
              : focused
                ? colors.primary
                : colors.border,
            minHeight,
          },
        ]}
      >
        <TextInput
          multiline
          textAlignVertical="top"
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.textSecondary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    ...(Platform.OS === "ios" ? { borderRadius: 10 } : {}),
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    padding: 0,
    minHeight: 80,
    fontFamily: Platform.OS === "ios" ? Fonts.sans : undefined,
    ...(Platform.OS === "web" ? { outlineStyle: undefined } : {}),
  },
});
