import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import { FormField } from "@/components/ui/form-field";
import { Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface Option<T extends string> {
  value: T;
  label: string;
}
interface SelectProps<T extends string> {
  value: T | null;
  onValueChange: (v: T) => void;
  options: Option<T>[];
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

export function Select<T extends string>({
  value,
  onValueChange,
  options,
  label,
  required,
  error,
  hint,
  placeholder = "Select…",
  leftIcon,
  disabled,
}: SelectProps<T>): React.JSX.Element {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
    >
      <Pressable
        accessibilityRole="combobox"
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            borderColor: error ? colors.destructive : colors.border,
            backgroundColor: colors.input,
            opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
          },
          Platform.OS === "ios" && { borderRadius: 10 },
        ]}
      >
        {leftIcon ? (
          <View style={{ marginRight: Spacing.two }}>{leftIcon}</View>
        ) : null}
        <Text
          style={[
            styles.triggerText,
            { color: selected ? colors.text : colors.textSecondary },
          ]}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown
          size={18}
          color={colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <ScrollView>
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  accessibilityRole="option"
                  accessibilityState={{ selected: opt.value === value }}
                  onPress={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      backgroundColor: pressed
                        ? colors.secondary
                        : "transparent",
                    },
                  ]}
                >
                  <Text style={{ color: colors.text }}>{opt.label}</Text>
                  {opt.value === value && (
                    <Text style={{ color: colors.primary }}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </FormField>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    minHeight: TouchTarget,
  },
  triggerText: { flex: 1, fontSize: 16 },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    maxHeight: 400,
    overflow: "hidden",
  },
  // backdrop: {
  //   flex: 1,
  //   justifyContent: 'flex-end', // Change from center to bottom
  //   backgroundColor: 'rgba(0,0,0,0.4)',
  // },
  // sheet: {
  //   borderTopLeftRadius: Radius.lg,
  //   borderTopRightRadius: Radius.lg,
  //   borderBottomLeftRadius: 0,
  //   borderBottomRightRadius: 0,
  //   borderWidth: 1,
  //   borderBottomWidth: 0,
  //   maxHeight: '50%', // Half-screen or adaptive height
  //   overflow: 'hidden',
  //   paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.three, // iOS home indicator safe area
  // },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    minHeight: TouchTarget,
  },
});
