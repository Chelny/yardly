import { StyleSheet, View } from "react-native";
import { CalendarDays, DollarSign, Layers } from "lucide-react-native";
import { OnboardingStep } from "@/components/onboarding-step";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Seasonal availability",
    description: "See which services run in winter, spring, summer, or fall.",
  },
  {
    icon: Layers,
    title: "Usage caps per season",
    description: "Track how many visits are left before you book.",
  },
  {
    icon: DollarSign,
    title: "Price per provider",
    description: "Compare what each local provider charges — no surprises.",
  },
];

export default function OnboardingSeasons(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <OnboardingStep
      nextHref="/(onboarding)/get-started"
      testID="onboarding_button_next"
    >
      <ThemedText
        type="h1"
        style={styles.title}
      >
        Book by season, pay per visit
      </ThemedText>
      <ThemedText
        type="body"
        themeColor="textSecondary"
        style={styles.body}
      >
        Know what's available, how many visits are left, and what each provider
        charges — before you book.
      </ThemedText>
      <View style={styles.list}>
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <View
            key={title}
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
                size={22}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardText}>
              <ThemedText type="label">{title}</ThemedText>
              <ThemedText
                type="caption"
                themeColor="textSecondary"
              >
                {description}
              </ThemedText>
            </View>
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
  list: { gap: Spacing.two },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1, gap: Spacing.half },
});
