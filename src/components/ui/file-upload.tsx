import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text } from "react-native";
import { FormField } from "@/components/ui/form-field";
import { Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface FileUploadProps {
  onFileSelected?: (file: DocumentPicker.DocumentPickerAsset) => void;
  accept?: string;
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelected,
  accept = "*/*",
  label,
  required,
  error,
  hint,
  placeholder = "Choose file",
  disabled,
}: FileUploadProps): React.JSX.Element {
  const { colors } = useTheme();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );

  const handlePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      setFile(result.assets[0]);
      onFileSelected?.(result.assets[0]);
    } catch {
      Alert.alert("Upload failed", "Could not open the file picker.");
    }
  };

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        disabled={disabled}
        onPress={handlePick}
        style={({ pressed }) => [
          styles.zone,
          {
            borderColor: error ? colors.destructive : colors.border,
            backgroundColor: pressed
              ? colors.secondary
              : colors.backgroundElement,
            opacity: disabled ? 0.5 : 1,
          },
          Platform.OS === "ios" && { borderRadius: 12 },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {file ? file.name : placeholder}
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          {file
            ? `${Math.round((file.size ?? 0) / 1024)} KB — tap to replace`
            : "Tap to browse"}
        </Text>
      </Pressable>
    </FormField>
  );
}

const styles = StyleSheet.create({
  zone: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: Radius.md,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
    minHeight: TouchTarget,
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  title: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 13, marginTop: Spacing.one },
});
