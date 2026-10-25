import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextLink } from "@/components/ui/text-link";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SignInScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (): Promise<void> => {
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : authError.message
      );
      return;
    }

    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.flex, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1200",
            }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.gradient}
          />
        </View>

        <View style={styles.form}>
          <ThemedText
            type="h1"
            style={styles.title}
          >
            Yardly
          </ThemedText>
          <ThemedText
            type="muted"
            style={styles.subtitle}
          >
            Sign in to manage your yard services.
          </ThemedText>

          <View style={styles.gap}>
            {error ? (
              <ThemedText
                type="caption"
                themeColor="destructive"
              >
                {error}
              </ThemedText>
            ) : null}

            <Input
              label="Email"
              required
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              testID="sign-in_email-input_email"
            />
            <Input
              label="Password"
              required
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              testID="sign-in_password-input_password"
            />

            <View style={styles.forgotRow}>
              <TextLink
                href="/forgot-password"
                variant="muted"
                testID="sign-in_link_forgot-password"
              >
                Forgot password?
              </TextLink>
            </View>

            <Button
              label={loading ? "Signing in…" : "Sign In"}
              disabled={loading}
              style={styles.submit}
              testID="sign-in_button_sign-in"
              onPress={handleSignIn}
            />

            <View style={styles.footer}>
              <ThemedText type="muted">Don&apos;t have an account? </ThemedText>
              <TextLink
                href="/sign-up"
                testID="sign-in_link_sign-up"
              >
                Sign Up
              </TextLink>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  hero: { height: SCREEN_HEIGHT * 0.45, position: "relative" },
  gradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 440 },
  form: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    justifyContent: "center",
  },
  title: { marginBottom: Spacing.two },
  subtitle: { marginBottom: Spacing.five },
  gap: { gap: Spacing.three },
  forgotRow: { alignItems: "flex-end" },
  submit: { marginTop: Spacing.two },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.four,
  },
});
