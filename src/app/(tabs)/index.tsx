import { Link } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  CalendarDays,
  Droplet,
  Droplets,
  Leaf,
  LucideIcon,
  Receipt,
  Scissors,
  Snowflake,
  Wind,
} from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface UpcomingJob {
  id: string;
  service: string;
  date: string;
  provider: string;
}

interface SeasonalUsage {
  id: string;
  service: string;
  used: number;
  cap: number;
  icon: "snow" | "leaf" | "hedge" | "gutter" | "pool" | "leaf-blow";
}

const UPCOMING: UpcomingJob = {
  id: "job-1",
  service: "Snow removal — driveway",
  date: "Sat, Nov 15 · 7:00 AM",
  provider: "Snow Pros Inc.",
};

const USAGE: SeasonalUsage[] = [
  { id: "snow", service: "Snow removal", used: 3, cap: 8, icon: "snow" },
  { id: "lawn", service: "Lawn mowing", used: 6, cap: 12, icon: "leaf" },
  { id: "hedge", service: "Hedge trimming", used: 1, cap: 2, icon: "hedge" },
  { id: "gutter", service: "Gutter cleaning", used: 0, cap: 2, icon: "gutter" },
  { id: "pool", service: "Pool cleaning", used: 2, cap: 10, icon: "pool" },
  { id: "leaves", service: "Leaf blowing", used: 0, cap: 4, icon: "leaf-blow" },
];

const UNPAID_COUNT = 2;
const UNPAID_TOTAL = 145.0;

export default function OverviewScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const rescheduleStyle = StyleSheet.flatten([
    styles.cardAction,
    isDesktop && styles.cardActionDesktop,
  ]);

  const viewInvoicesStyle = StyleSheet.flatten([
    styles.cardAction,
    isDesktop && styles.cardActionDesktop,
  ]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <ThemedText type="h2">Welcome back</ThemedText>
        <ThemedText type="muted">
          Here&apos;s what&apos;s happening with your yard.
        </ThemedText>
      </View>

      <View style={styles.grid}>
        {/* Next visit */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.backgroundElement,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <CalendarDays
              size={18}
              color={colors.primary}
            />
            <ThemedText
              type="label"
              themeColor="textSecondary"
            >
              Next visit
            </ThemedText>
          </View>
          <ThemedText
            type="h3"
            style={styles.cardTitle}
          >
            {UPCOMING.service}
          </ThemedText>
          <ThemedText
            type="body"
            themeColor="textSecondary"
          >
            {UPCOMING.date}
          </ThemedText>
          <ThemedText
            type="caption"
            themeColor="textSecondary"
            style={styles.provider}
          >
            {UPCOMING.provider}
          </ThemedText>
          <Link
            href="/booking"
            asChild
            testID="overview_link_reschedule"
          >
            <Button
              label="Reschedule"
              variant="outline"
              style={rescheduleStyle}
            />
          </Link>
        </View>

        {/* Unpaid invoices */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.backgroundElement,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Receipt
              size={18}
              color={colors.primary}
            />
            <ThemedText
              type="label"
              themeColor="textSecondary"
            >
              Unpaid balance
            </ThemedText>
          </View>
          <ThemedText
            type="h2"
            style={styles.cardTitle}
          >
            ${UNPAID_TOTAL.toFixed(2)}
          </ThemedText>
          <ThemedText
            type="caption"
            themeColor="textSecondary"
          >
            Across {UNPAID_COUNT} invoices
          </ThemedText>
          <Link
            href="/invoices"
            asChild
            testID="overview_link_view-invoices"
          >
            <Button
              label="View invoices"
              style={viewInvoicesStyle}
            />
          </Link>
        </View>
      </View>

      {/* Seasonal usage */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h3">Seasonal usage</ThemedText>
          <TextLink
            href="/services"
            variant="muted"
            testID="overview_link_view-services"
          >
            View services
          </TextLink>
        </View>
        <View style={styles.usageList}>
          {USAGE.map((item: SeasonalUsage) => {
            const ratio: number = item.cap > 0 ? item.used / item.cap : 0;
            const Icon: LucideIcon =
              item.icon === "snow"
                ? Snowflake
                : item.icon === "pool"
                  ? Droplets
                  : item.icon === "leaf-blow"
                    ? Wind
                    : item.icon === "hedge"
                      ? Scissors
                      : item.icon === "gutter"
                        ? Droplet
                        : Leaf;
            return (
              <View
                key={item.id}
                style={[styles.usageRow, { borderBottomColor: colors.border }]}
              >
                <View style={styles.usageInfo}>
                  <Icon
                    size={18}
                    color={colors.primary}
                  />
                  <ThemedText
                    type="body"
                    style={styles.usageLabel}
                  >
                    {item.service}
                  </ThemedText>
                </View>
                <ThemedText
                  type="caption"
                  themeColor="textSecondary"
                >
                  {item.used} / {item.cap}
                </ThemedText>
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: colors.backgroundSelected },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${Math.min(ratio, 1) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.actions}>
        <Link
          href="/booking"
          asChild
          testID="overview_link_book-service"
        >
          <Button
            label="Book a service"
            style={styles.actionButton}
          />
        </Link>
        <Link
          href="/profile"
          asChild
          testID="overview_link_manage-profile"
        >
          <Button
            label="Manage profile"
            variant="outline"
            style={styles.actionButton}
          />
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    paddingTop: Platform.OS === "web" ? Spacing.six : Spacing.four,
    paddingBottom: Spacing.five,
    marginTop: Platform.OS === "web" ? Spacing.four : 0,
    maxWidth: MaxContentWidth,
    width: "100%",
    alignSelf: "center",
    gap: Spacing.four,
  },
  header: { gap: Spacing.one },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  card: {
    flex: 1,
    minWidth: 240,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: 12,
    gap: Spacing.two,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  cardTitle: { marginTop: Spacing.one },
  provider: { marginBottom: Spacing.one },
  cardAction: {
    alignSelf: "flex-start",
  },
  cardActionDesktop: {
    marginTop: "auto",
  },
  section: { gap: Spacing.three },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usageList: { gap: 0 },
  usageRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  usageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flex: 1,
    minWidth: 160,
  },
  usageLabel: { flexShrink: 1 },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: Spacing.one,
  },
  progressFill: { height: "100%", borderRadius: 3 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  actionButton: { flex: 1, minWidth: 160 },
});
