import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Droplet,
  Droplets,
  Leaf,
  LucideIcon,
  Scissors,
  Search,
  Snowflake,
  Sprout,
  Star,
  Sun,
  Wind,
} from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Input } from "@/components/ui/input";
import { TextLink } from "@/components/ui/text-link";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  AddOn,
  findProviderById,
  formatDate,
  formatPriceUnit,
  formatSeasons,
  isSaleOpen,
  Offer,
  Provider,
  type SeasonFilter,
  SeasonFilterOption,
  SERVICES,
} from "@/lib/services-data";

const SEASON_FILTERS: SeasonFilterOption[] = [
  { id: "all", label: "All", icon: null },
  { id: "winter", label: "Winter", icon: Snowflake },
  { id: "spring", label: "Spring", icon: Sprout },
  { id: "summer", label: "Summer", icon: Sun },
  { id: "fall", label: "Fall", icon: Leaf },
];

const ICON_MAP: Record<Service["icon"], LucideIcon> = {
  snow: Snowflake,
  leaf: Leaf,
  hedge: Scissors,
  gutter: Droplet,
  pool: Droplets,
  "leaf-blow": Wind,
};

type Service = (typeof SERVICES)[number];

export default function ServicesScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState<string>("");
  const [season, setSeason] = useState<SeasonFilter>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (offerId: string): void => {
    setFavorites((prev: Set<string>) => {
      const next: Set<string> = new Set<string>(prev);
      if (next.has(offerId)) next.delete(offerId);
      else next.add(offerId);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q: string = query.trim().toLowerCase();
    return SERVICES.filter((service: Service) => {
      const matchesSeason: boolean =
        season === "all" || service.seasons.includes(season);
      const matchesQuery: boolean =
        q.length === 0 ||
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q);
      return matchesSeason && matchesQuery;
    });
  }, [query, season]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["bottom"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.header}>
          <ThemedText type="muted">
            Browse seasonal services and book what your yard needs.
          </ThemedText>
        </View>

        <Input
          label="Search"
          placeholder="Search services..."
          value={query}
          onChangeText={setQuery}
          leftIcon={
            <Search
              size={18}
              color={colors.textSecondary}
            />
          }
          testID="services_input-search_search"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filtersScroll}
        >
          {SEASON_FILTERS.map((filter: SeasonFilterOption, index: number) => {
            const isActive: boolean = season === filter.id;
            const Icon: LucideIcon | null = filter.icon;
            return (
              <Pressable
                key={filter.id}
                onPress={() => setSeason(filter.id)}
                testID={`services_filters_[${index}]_button_${filter.id}`}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.backgroundElement,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                {Icon ? (
                  <Icon
                    size={16}
                    color={
                      isActive ? colors.primaryForeground : colors.textSecondary
                    }
                  />
                ) : null}
                <ThemedText
                  type="label"
                  style={{
                    color: isActive ? colors.primaryForeground : colors.text,
                  }}
                >
                  {filter.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        {filtered.length === 0 ? (
          <View
            style={styles.empty}
            testID="services_search-results_no-results"
          >
            <ThemedText
              type="muted"
              align="center"
            >
              No services match your search.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((service: Service, serviceIndex: number) => {
              const Icon: LucideIcon = ICON_MAP[service.icon];
              const hasOffers: boolean = service.offers.length > 0;

              return (
                <View
                  key={service.id}
                  style={[styles.serviceBlock, { borderColor: colors.border }]}
                  testID={`services_card_[${serviceIndex}]_service-info`}
                >
                  <View style={styles.serviceHeader}>
                    <View
                      style={[
                        styles.iconBadge,
                        { backgroundColor: colors.backgroundSelected },
                      ]}
                    >
                      <Icon
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.serviceHeaderText}>
                      <ThemedText type="h3">{service.name}</ThemedText>
                      <ThemedText
                        type="caption"
                        themeColor="textSecondary"
                      >
                        {formatSeasons(service.seasons)}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText
                    type="body"
                    themeColor="textSecondary"
                  >
                    {service.description}
                  </ThemedText>

                  {hasOffers ? (
                    <View style={styles.offersList}>
                      {service.offers.map(
                        (offer: Offer, offerIndex: number) => {
                          const provider: Provider | null = findProviderById(
                            offer.providerId
                          );
                          const remaining: number | null =
                            offer.priceUnit === "season" &&
                            offer.seasonCap !== undefined
                              ? Math.max(offer.seasonCap - (offer.used ?? 0), 0)
                              : null;
                          const isExhausted: boolean = remaining === 0;
                          const saleOpen: boolean = isSaleOpen(
                            offer.saleWindow
                          );
                          const canBook: boolean = !isExhausted && saleOpen;

                          return (
                            <View
                              key={offer.id}
                              style={styles.offerCard}
                            >
                              <Pressable
                                onPress={() =>
                                  router.push({
                                    pathname: `/offers/[id]`,
                                    params: { id: offer.id },
                                  })
                                }
                                style={styles.offerContent}
                                testID={`services_button_[${serviceIndex}]_service-info_[${offerIndex}]_offer`}
                              >
                                <View style={styles.offerHeader}>
                                  <View style={styles.offerHeaderText}>
                                    <ThemedText type="label">
                                      {provider?.name ?? "Unknown provider"}
                                    </ThemedText>
                                    <View style={styles.offerHeaderRating}>
                                      <Star
                                        size={14}
                                        color={colors.primary}
                                        fill={colors.primary}
                                      />
                                      <ThemedText
                                        type="caption"
                                        themeColor="textSecondary"
                                      >
                                        {provider?.rating.toFixed(1)} (
                                        {provider?.reviewCount} reviews)
                                      </ThemedText>
                                    </View>
                                  </View>
                                  <View style={styles.offerHeaderActions}>
                                    <ThemedText
                                      type="body"
                                      style={styles.offerPrice}
                                    >
                                      ${offer.price.toFixed(2)}{" "}
                                      <ThemedText
                                        type="caption"
                                        themeColor="textSecondary"
                                      >
                                        {formatPriceUnit(offer.priceUnit)}
                                      </ThemedText>
                                    </ThemedText>
                                    <FavoriteButton
                                      isFavorite={favorites.has(offer.id)}
                                      onToggle={() => toggleFavorite(offer.id)}
                                      testID={`services_button_[${serviceIndex}]_service-info_[${offerIndex}]_offer_${favorites.has(offer.id) ? "remove-favorite" : "add-favorite"}`}
                                    />
                                  </View>
                                </View>

                                <ThemedText
                                  type="caption"
                                  themeColor="textSecondary"
                                >
                                  {offer.summary}
                                </ThemedText>

                                {remaining !== null ? (
                                  <ThemedText
                                    type="caption"
                                    themeColor={
                                      isExhausted
                                        ? "destructive"
                                        : "textSecondary"
                                    }
                                  >
                                    {isExhausted
                                      ? "Season cap reached"
                                      : `${remaining} of ${offer.seasonCap} visits left this season`}
                                  </ThemedText>
                                ) : null}

                                <ThemedText
                                  type="caption"
                                  themeColor={
                                    saleOpen ? "textSecondary" : "destructive"
                                  }
                                >
                                  {saleOpen
                                    ? `Book by ${formatDate(offer.saleWindow.closesAt)}`
                                    : `Booking closed · reopens ${formatDate(offer.saleWindow.opensAt)}`}
                                </ThemedText>

                                {offer.addOns.length > 0 ? (
                                  <View style={styles.addOnsList}>
                                    {offer.addOns.map((addOn: AddOn) => (
                                      <View
                                        key={addOn.id}
                                        style={styles.addOnRow}
                                      >
                                        <ThemedText
                                          type="caption"
                                          themeColor="textSecondary"
                                        >
                                          + {addOn.name}
                                        </ThemedText>
                                        <ThemedText
                                          type="caption"
                                          themeColor="textSecondary"
                                        >
                                          ${addOn.price.toFixed(2)}{" "}
                                          {formatPriceUnit(addOn.unit)}
                                        </ThemedText>
                                      </View>
                                    ))}
                                  </View>
                                ) : null}
                              </Pressable>

                              <Button
                                label={
                                  isExhausted
                                    ? "Season cap reached"
                                    : !saleOpen
                                      ? "Season closed"
                                      : `Book with ${provider?.name ?? "provider"}`
                                }
                                variant={canBook ? "default" : "outline"}
                                size="sm"
                                disabled={!canBook}
                                onPress={(event) => {
                                  event.stopPropagation();
                                  router.push({
                                    pathname: "/booking",
                                    params: {
                                      offerId: offer.id,
                                      serviceId: service.id,
                                    },
                                  });
                                }}
                                style={styles.offerAction}
                                testID={`services_button_[${serviceIndex}]_service-info_[${offerIndex}]_offer_${isExhausted ? "season-cap-reached" : !saleOpen ? "season-closed" : "book"}`}
                              />
                            </View>
                          );
                        }
                      )}
                    </View>
                  ) : (
                    <View
                      style={[styles.noOffers, { borderColor: colors.border }]}
                      testID="services_card_no-offers"
                    >
                      <ThemedText
                        type="caption"
                        themeColor="textSecondary"
                      >
                        No providers available in your area yet.
                      </ThemedText>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.footer}>
          <TextLink
            href="/booking"
            variant="muted"
            testID="services_link_view-booking"
          >
            Go to booking
          </TextLink>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    maxWidth: MaxContentWidth,
    width: "100%",
    gap: Spacing.three,
  },
  header: { gap: Spacing.one },
  filtersScroll: { flexGrow: 0 },
  filtersContent: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingHorizontal: 0,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
  },
  list: { gap: Spacing.four },
  serviceBlock: { gap: Spacing.three },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  serviceHeaderText: { flex: 1, gap: Spacing.half },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  offersList: { gap: Spacing.two },
  offerCard: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: 12,
    gap: Spacing.two,
  },
  offerContent: {},
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  offerHeaderText: { gap: Spacing.half, flexShrink: 1, flex: 1 },
  offerHeaderRating: {
    flexDirection: "row",
    gap: Spacing.half,
    alignItems: "center",
  },
  offerHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  offerPrice: { fontWeight: "600" },
  addOnsList: {
    gap: Spacing.half,
    paddingTop: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  addOnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  offerAction: {
    alignSelf: "flex-start",
    marginTop: Spacing.one,
    width: Platform.OS === "web" ? undefined : "100%",
  },
  noOffers: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },
  empty: { paddingVertical: Spacing.five, alignItems: "center" },
  footer: { alignItems: "center", marginTop: Spacing.three },
});
