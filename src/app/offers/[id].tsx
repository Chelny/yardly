import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Globe, Mail, Phone, Star } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  AddOn,
  findOfferById,
  findProviderById,
  formatDate,
  formatPriceUnit,
  formatSeasons,
  isSaleOpen,
  Provider,
  Review,
} from "@/lib/services-data";

export default function OfferDetailScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const found = offerId ? findOfferById(offerId) : null;

  if (!found) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["top", "bottom"]}
      >
        <View
          style={styles.emptyState}
          testID="offer-detail_view_not-found"
        >
          <ThemedText type="h3">Offer not found</ThemedText>
          <Button
            label="Back to services"
            variant="outline"
            onPress={() => router.back()}
            testID="offer-detail_button_back-to-services"
          />
        </View>
      </SafeAreaView>
    );
  }

  const { service, offer } = found;
  const provider: Provider | null = findProviderById(offer.providerId);
  const saleOpen: boolean = isSaleOpen(offer.saleWindow);
  const remaining: number | null =
    offer.priceUnit === "season" && offer.seasonCap !== undefined
      ? Math.max(offer.seasonCap - (offer.used ?? 0), 0)
      : null;
  const isExhausted: boolean = remaining === 0;
  const canBook: boolean = !isExhausted && saleOpen;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: false,
          headerTitleAlign: "center",
          headerTitle: provider ? provider.name : "Offer",
          headerRight: () => (
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={() => setIsFavorite((v: boolean) => !v)}
              testID={`offer-detail_button_${isFavorite ? "remove-favorite" : "add-favorite"}`}
            />
          ),
        }}
      />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["bottom"]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {provider ? (
            <View style={styles.providerHeader}>
              <View
                style={[styles.logo, { backgroundColor: provider.logoColor }]}
                testID={"offer-detail_image_company-logo"}
              >
                <ThemedText
                  type="h2"
                  style={styles.logoText}
                >
                  {provider.logoInitial}
                </ThemedText>
              </View>
              <View style={styles.providerHeaderText}>
                <ThemedText type="h2">{provider.name}</ThemedText>
                <View style={styles.ratingRow}>
                  <Star
                    size={16}
                    color={colors.primary}
                    fill={colors.primary}
                  />
                  <ThemedText type="label">
                    {provider.rating.toFixed(1)}
                  </ThemedText>
                  <ThemedText
                    type="caption"
                    themeColor="textSecondary"
                  >
                    ({provider.reviewCount} reviews)
                  </ThemedText>
                </View>
                <ThemedText
                  type="caption"
                  themeColor="textSecondary"
                >
                  {provider.languages.join(" · ")}
                </ThemedText>
              </View>
            </View>
          ) : null}

          <View style={[styles.section, { borderColor: colors.border }]}>
            <ThemedText type="h3">{service.name}</ThemedText>
            <ThemedText
              type="body"
              themeColor="textSecondary"
            >
              {offer.summary}
            </ThemedText>
            <ThemedText
              type="caption"
              themeColor="textSecondary"
            >
              Available in: {formatSeasons(service.seasons)}
            </ThemedText>
          </View>

          <View style={[styles.section, { borderColor: colors.border }]}>
            <View style={styles.priceRow}>
              <ThemedText type="h2">${offer.price.toFixed(2)}</ThemedText>
              <ThemedText type="muted">
                {formatPriceUnit(offer.priceUnit)}
              </ThemedText>
            </View>
            {remaining !== null ? (
              <ThemedText
                type="caption"
                themeColor={isExhausted ? "destructive" : "textSecondary"}
              >
                {isExhausted
                  ? "Season cap reached"
                  : `${remaining} of ${offer.seasonCap} visits left this season`}
              </ThemedText>
            ) : null}
            <ThemedText
              type="caption"
              themeColor={saleOpen ? "textSecondary" : "destructive"}
            >
              {saleOpen
                ? `Booking open until ${formatDate(offer.saleWindow.closesAt)}`
                : `Booking closed · reopens ${formatDate(offer.saleWindow.opensAt)}`}
            </ThemedText>
          </View>

          {offer.addOns.length > 0 ? (
            <View style={[styles.section, { borderColor: colors.border }]}>
              <ThemedText type="h3">Add-ons</ThemedText>
              {offer.addOns.map((addOn: AddOn) => (
                <View
                  key={addOn.id}
                  style={styles.addOnRow}
                >
                  <ThemedText type="body">{addOn.name}</ThemedText>
                  <ThemedText
                    type="caption"
                    themeColor="textSecondary"
                  >
                    ${addOn.price.toFixed(2)} {formatPriceUnit(addOn.unit)}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {provider ? (
            <View style={[styles.section, { borderColor: colors.border }]}>
              <ThemedText type="h3">Contact</ThemedText>
              <View style={styles.contactRow}>
                <Phone
                  size={18}
                  color={colors.textSecondary}
                />
                <ThemedText type="body">{provider.phone}</ThemedText>
              </View>
              <View style={styles.contactRow}>
                <Mail
                  size={18}
                  color={colors.textSecondary}
                />
                <ThemedText type="body">{provider.email}</ThemedText>
              </View>
              {provider.website ? (
                <View style={styles.contactRow}>
                  <Globe
                    size={18}
                    color={colors.textSecondary}
                  />
                  <ThemedText type="body">{provider.website}</ThemedText>
                </View>
              ) : null}
            </View>
          ) : null}

          {provider ? (
            <View style={[styles.section, { borderColor: colors.border }]}>
              <ThemedText type="h3">Service areas</ThemedText>
              <View style={styles.areaTags}>
                {provider.serviceAreas.map((area: string) => (
                  <View
                    key={area}
                    style={[
                      styles.areaTag,
                      {
                        backgroundColor: colors.backgroundElement,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <ThemedText type="caption">{area}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {provider && provider.description ? (
            <View style={[styles.section, { borderColor: colors.border }]}>
              <ThemedText type="h3">About</ThemedText>
              <ThemedText
                type="body"
                themeColor="textSecondary"
              >
                {provider.description}
              </ThemedText>
            </View>
          ) : null}

          {provider && provider.reviews.length > 0 ? (
            <View style={[styles.section, { borderColor: colors.border }]}>
              <ThemedText type="h3">Reviews</ThemedText>
              {provider.reviews.map((review: Review, reviewIndex: number) => (
                <View
                  key={review.id}
                  style={[styles.reviewCard, { borderColor: colors.border }]}
                  testID={`offer-detail_card_[${reviewIndex}]_review`}
                >
                  <View style={styles.reviewHeader}>
                    <ThemedText type="label">{review.author}</ThemedText>
                    <ThemedText
                      type="caption"
                      themeColor="textSecondary"
                    >
                      {formatDate(review.date)}
                    </ThemedText>
                  </View>
                  <View style={styles.ratingRow}>
                    {Array.from({ length: 5 }).map((_, i: number) => (
                      <Star
                        key={i}
                        size={12}
                        color={
                          i < review.rating ? colors.primary : colors.border
                        }
                        fill={
                          i < review.rating ? colors.primary : "transparent"
                        }
                      />
                    ))}
                  </View>
                  <ThemedText
                    type="caption"
                    themeColor="textSecondary"
                  >
                    {review.comment}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.stickyFooter,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + Spacing.two,
            },
          ]}
        >
          <Button
            label={
              isExhausted
                ? "Season cap reached"
                : !saleOpen
                  ? "Season closed"
                  : "Book this offer"
            }
            variant={canBook ? "default" : "outline"}
            disabled={!canBook}
            onPress={() =>
              router.push({
                pathname: "/booking",
                params: { offerId: offer.id, serviceId: service.id },
              })
            }
            style={styles.bookButton}
            testID={`offer-detail_button_${isExhausted ? "season-cap-reached" : !saleOpen ? "season-closed" : "book"}`}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  headerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  content: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    maxWidth: MaxContentWidth,
    width: "100%",
    alignSelf: "center",
    gap: Spacing.three,
  },
  providerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#ffffff", fontWeight: "800" },
  providerHeaderText: { flex: 1, gap: Spacing.half },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  section: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: 12,
    gap: Spacing.two,
  },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: Spacing.two },
  addOnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.half,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  areaTags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  areaTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 8,
    borderWidth: 1,
  },
  reviewCard: {
    padding: Spacing.two,
    borderWidth: 1,
    borderRadius: 8,
    gap: Spacing.half,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookButton: {
    width: Platform.OS === "web" ? undefined : "100%",
    alignSelf: "center",
    marginTop: Spacing.two,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.four,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
});
