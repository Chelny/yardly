import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Mail } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";

interface FieldErrors {
  email?: string;
}

export default function ForgotPasswordScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    const nextErrors: FieldErrors = {};

    if (!email) nextErrors.email = "Email is required.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "yardly://reset-password",
    });

    setSent(true);
  };

  if (sent) {
    return (
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <View style={styles.sentPage}>
          <View style={styles.sentIcon}>
            <Mail
              size={48}
              color={colors.primary}
            />
          </View>
          <ThemedText
            type="h3"
            align="center"
            style={styles.sentTitle}
          >
            Check your inbox
          </ThemedText>
          <ThemedText
            type="muted"
            align="center"
            style={styles.sentBody}
            testID="forgot-password_text_sent-body"
          >
            We sent a reset link to{" "}
            <ThemedText
              type="muted"
              style={styles.emailBold}
            >
              {email}
            </ThemedText>
            . Click it to choose a new password.
          </ThemedText>
          <Button
            label="Back to Sign In"
            variant="outline"
            testID="forgot-password_button_back-to-sign-in"
            onPress={() => router.replace("/sign-in")}
          />
        </View>
      </View>
    );
  }

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
          Enter your email and we&apos;ll send you a reset link.
        </ThemedText>

        <View style={styles.gap}>
          <Input
            label="Email"
            required
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="forgot-password_input-email_email"
            error={errors.email}
          />
          <Button
            label="Send reset link"
            testID="forgot-password_button_send-reset-link"
            onPress={handleSubmit}
          />
          <View style={styles.footer}>
            <Button
              label="Back to Sign In"
              variant="outline"
              testID="forgot-password_button_back-to-sign-in"
              onPress={() => router.replace("/sign-in")}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sentPage: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.five,
  },
  sentIcon: {
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  emailBold: { fontWeight: "bold" },
  page: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
  },
  subtitle: { marginBottom: Spacing.five },
  sentTitle: { marginBottom: Spacing.two },
  sentBody: { marginBottom: Spacing.five },
  gap: { gap: Spacing.three },
  footer: { alignItems: "center", marginTop: Spacing.three },
});
