import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleReset = async () => {
    const nextErrors: FieldErrors = {};

    if (!password) nextErrors.password = "Password is required.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    if (password && confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (password && password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const { error: supaError } = await supabase.auth.updateUser({ password });

    if (!supaError) {
      router.dismissAll();
      router.replace("/sign-in");
    } else {
      setErrors({ confirmPassword: supaError.message });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.flex, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <ThemedText
          type="muted"
          style={styles.subtitle}
        >
          Make it strong and memorable.
        </ThemedText>

        <View style={styles.gap}>
          <Input
            label="New password"
            required
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            hint="At least 8 characters."
            testID="reset-password_input-password_new-password"
          />
          <Input
            label="Confirm password"
            required
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            testID="reset-password_input-password_confirm-password"
          />
          <Button
            label="Update password"
            testID="reset-password_button_update-password"
            onPress={handleReset}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
  },
  subtitle: { marginBottom: Spacing.five },
  gap: { gap: Spacing.three },
});
