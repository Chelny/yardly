import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function BookingConfirmScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const { service, date, price } = useLocalSearchParams<{
    service?: string;
    date?: string;
    price?: string;
  }>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <CheckCircle2
          size={64}
          color={colors.primary}
        />
        <ThemedText
          type="h2"
          align="center"
          style={styles.title}
        >
          Booking confirmed
        </ThemedText>
        <ThemedText
          type="muted"
          align="center"
          style={styles.body}
        >
          {service ?? "Your service"} is scheduled for{" "}
          {date ?? "the selected date"}.
        </ThemedText>
        {price ? (
          <ThemedText
            type="body"
            align="center"
            style={styles.price}
          >
            Estimated total: {price}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          label="View my bookings"
          onPress={() => router.replace("/")}
        />
        <Button
          label="Book another service"
          variant="outline"
          onPress={() => router.replace("/services")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  title: { marginTop: Spacing.two },
  body: { maxWidth: 320 },
  price: { fontWeight: "600" },
  actions: { gap: Spacing.two, paddingBottom: Spacing.five },
});
