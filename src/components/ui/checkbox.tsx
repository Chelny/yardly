import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Check } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label?: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  testID?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  required,
  error,
  hint,
  disabled,
  testID,
}: CheckboxProps): React.JSX.Element {
  const { colors } = useTheme();
  const hasLabel: boolean = label !== undefined && label !== null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
          accessibilityLabel={typeof label === "string" ? label : undefined}
          disabled={disabled}
          onPress={() => onCheckedChange(!checked)}
          style={({ pressed }) => [
            pressed && { opacity: 0.7 },
            disabled && { opacity: 0.5 },
          ]}
          hitSlop={8}
          testID={testID}
        >
          <View
            style={[
              styles.box,
              {
                borderColor: error
                  ? colors.destructive
                  : checked
                    ? colors.primary
                    : colors.border,
                backgroundColor: checked ? colors.primary : colors.input,
              },
              Platform.OS === "ios" && { borderRadius: 6 },
            ]}
          >
            {checked && (
              <Check
                size={16}
                color={colors.primaryForeground}
                strokeWidth={3}
              />
            )}
          </View>
        </Pressable>

        {hasLabel ? (
          <Pressable
            onPress={() => onCheckedChange(!checked)}
            disabled={disabled}
            style={styles.labelArea}
            hitSlop={8}
          >
            {typeof label === "string" ? (
              <ThemedText
                type="body"
                style={styles.label}
              >
                {label}
                {required ? (
                  <ThemedText
                    type="body"
                    themeColor="destructive"
                  >
                    {" "}
                    *
                  </ThemedText>
                ) : null}
              </ThemedText>
            ) : (
              label
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <ThemedText
          type="caption"
          themeColor="destructive"
          style={styles.message}
        >
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText
          type="caption"
          themeColor="textSecondary"
          style={styles.message}
        >
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  labelArea: { flexShrink: 1, flex: 1 },
  label: { flexShrink: 1 },
  message: { marginLeft: 30 },
});
