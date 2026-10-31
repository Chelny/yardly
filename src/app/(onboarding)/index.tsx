import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { OnboardingStep } from "@/components/onboarding-step";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function OnboardingIntro(): React.JSX.Element {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const heroHeight = height * 0.45;

  return (
    <OnboardingStep
      nextHref="/(onboarding)/services"
      testID="onboarding_button_next"
      safeTop={false}
      hero={
        <View style={[styles.hero, { height: heroHeight, width }]}>
          <Image
            source={require("@/assets/images/404/winter.jpg")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.gradient}
          />
        </View>
      }
    >
      <ThemedText
        type="h1"
        style={styles.title}
      >
        Your yard, handled season by season
      </ThemedText>
      <ThemedText
        type="body"
        themeColor="textSecondary"
      >
        Snow, lawn, hedges, pool — book trusted local providers and track every
        visit in one place.
      </ThemedText>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: "relative",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: Spacing.three,
  },
});
