import React, { cloneElement, isValidElement, useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { FormField } from "@/components/ui/form-field";
import { Fonts, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: TextInputProps["style"];
}

type ColorableIconProps = { color?: string };

export function Input({
  label,
  required,
  error,
  hint,
  leftIcon,
  containerStyle,
  style,
  secureTextEntry,
  onFocus,
  onBlur,
  editable = true,
  ...props
}: InputProps): React.JSX.Element {
  const { colors } = useTheme();
  const [focused, setFocused] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(!!secureTextEntry);
  const isPassword = !!secureTextEntry;

  const iconColor = error
    ? colors.destructive
    : focused
      ? colors.primary
      : colors.textSecondary;

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
            opacity: editable ? 1 : 0.6,
          },
          containerStyle,
        ]}
      >
        {leftIcon ? (
          <View style={styles.icon}>
            {isValidElement<ColorableIconProps>(leftIcon)
              ? cloneElement(leftIcon, { color: iconColor })
              : leftIcon}
          </View>
        ) : null}

        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword ? hidden : false}
          editable={editable}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />

        {isPassword ? (
          <Pressable
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            style={styles.icon}
            onPress={() => setHidden((h: boolean) => !h)}
          >
            {hidden ? (
              <EyeOff
                size={20}
                color={colors.textSecondary}
              />
            ) : (
              <Eye
                size={20}
                color={colors.textSecondary}
              />
            )}
          </Pressable>
        ) : null}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Platform.OS === "ios" ? 10 : Radius.md,
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.two,
    ...(Platform.OS === "web" ? { outlineWidth: 0 } : {}),
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    fontFamily: Platform.OS === "ios" ? Fonts.sans : undefined,
    ...(Platform.OS === "web" ? { outlineWidth: 0 } : {}),
  },
  icon: { marginInline: Spacing.one },
});
