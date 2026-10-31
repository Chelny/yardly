import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CheckCircle2 } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAuthStore } from "@/utils/auth-store";

export default function OnboardingGetStarted(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthStore();

  const handleSignIn = (): void => {
    completeOnboarding();
    router.replace("/(auth)");
  };

  const handleSignUp = (): void => {
    completeOnboarding();
    router.replace("/(auth)/sign-up");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.six }]}>
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: colors.backgroundSelected },
          ]}
        >
          <CheckCircle2
            size={56}
            color={colors.primary}
          />
        </View>
        <ThemedText
          type="h1"
          style={styles.title}
        >
          Ready when you are
        </ThemedText>
        <ThemedText
          type="body"
          themeColor="textSecondary"
          style={styles.body}
        >
          Create an account to book your first service, or sign in if you
          already have one.
        </ThemedText>
      </View>
      <SafeAreaView
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom,
          },
        ]}
        edges={["bottom"]}
      >
        <Button
          label="Sign Up"
          onPress={handleSignUp}
          testID="onboarding_button_sign-up"
        />
        <Button
          label="Sign In"
          variant="outline"
          onPress={handleSignIn}
          testID="onboarding_button_sign-in"
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  iconBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    textAlign: "center",
  },
  body: { textAlign: "center" },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
});
