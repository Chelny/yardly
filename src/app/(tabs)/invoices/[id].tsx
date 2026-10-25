import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface InvoiceLine {
  service: string;
  date: string;
  provider: string;
  amount: string;
}

const MOCK_LINES: InvoiceLine[] = [
  {
    service: "Snow removal — walkway",
    date: "2026-11-15",
    provider: "Snow Pros Inc.",
    amount: "$25.00",
  },
  {
    service: "Snow removal — driveway",
    date: "2026-11-15",
    provider: "Snow Pros Inc.",
    amount: "$45.00",
  },
];

export default function InvoiceDetailScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const total = MOCK_LINES.reduce(
    (sum, line) => sum + Number(line.amount.replace("$", "")),
    0
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <ThemedText
        type="h2"
        style={styles.title}
      >
        Invoice #{id}
      </ThemedText>
      <ThemedText
        type="muted"
        style={styles.subtitle}
      >
        Status:{" "}
        <ThemedText
          type="label"
          themeColor="primary"
        >
          Paid
        </ThemedText>
      </ThemedText>

      <View style={styles.lines}>
        {MOCK_LINES.map((line, index) => (
          <View
            key={index}
            style={[styles.line, { borderBottomColor: colors.border }]}
          >
            <View style={styles.lineInfo}>
              <ThemedText type="body">{line.service}</ThemedText>
              <ThemedText
                type="caption"
                themeColor="textSecondary"
              >
                {line.date} · {line.provider}
              </ThemedText>
            </View>
            <ThemedText
              type="body"
              style={styles.amount}
            >
              {line.amount}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={[styles.total, { borderTopColor: colors.border }]}>
        <ThemedText type="label">Total</ThemedText>
        <ThemedText type="h3">${total.toFixed(2)}</ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.four, gap: Spacing.two },
  title: { marginBottom: Spacing.one },
  subtitle: { marginBottom: Spacing.four },
  lines: { gap: 0 },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  lineInfo: { flex: 1, gap: Spacing.half },
  amount: { fontWeight: "600" },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.three,
    marginTop: Spacing.two,
    borderTopWidth: 1,
  },
});
