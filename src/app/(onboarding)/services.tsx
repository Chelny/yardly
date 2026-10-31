import { StyleSheet, View } from "react-native";
import {
  Droplets,
  Leaf,
  LucideIcon,
  Snowflake,
  Wind,
} from "lucide-react-native";
import { OnboardingStep } from "@/components/onboarding-step";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const SERVICES: { icon: LucideIcon; label: string; description: string }[] = [
  {
    icon: Snowflake,
    label: "Snow removal",
    description: "Driveway, walkway, steps",
  },
  {
    icon: Leaf,
    label: "Lawn & hedges",
    description: "Mowing, trimming, fertilizing",
  },
  {
    icon: Droplets,
    label: "Pool cleaning",
    description: "Skim, vacuum, balance",
  },
  { icon: Wind, label: "Leaf blowing", description: "Yard, gutters, walkway" },
];

export default function OnboardingServices(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <OnboardingStep
      nextHref="/(onboarding)/seasons"
      testID="onboarding_button_next"
    >
      <ThemedText
        type="h1"
        style={styles.title}
      >
        Everything your yard needs
      </ThemedText>
      <ThemedText
        type="body"
        themeColor="textSecondary"
        style={styles.body}
      >
        Pick à la carte services, or bundle them into a seasonal plan.
      </ThemedText>
      <View style={styles.grid}>
        {SERVICES.map(({ icon: Icon, label, description }) => (
          <View
            key={label}
            style={[
              styles.card,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.backgroundSelected },
              ]}
            >
              <Icon
                size={24}
                color={colors.primary}
              />
            </View>
            <ThemedText type="label">{label}</ThemedText>
            <ThemedText
              type="caption"
              themeColor="textSecondary"
            >
              {description}
            </ThemedText>
          </View>
        ))}
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: Spacing.three,
  },
  body: { marginBottom: Spacing.four },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  card: {
    width: "48%",
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
