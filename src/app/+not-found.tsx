import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type Season = "winter" | "spring" | "summer" | "fall";

interface SeasonConfig {
  season: Season;
  service: string;
  image: ImageSource;
  accent: string;
}

function getSeason(): SeasonConfig {
  const month: number = new Date().getMonth();

  if (month === 11 || month <= 1) {
    return {
      season: "winter",
      service: "Snow removal",
      image: require("@/assets/images/404/winter.jpg"),
      accent: "#0ea5e9",
    };
  }

  if (month >= 2 && month <= 4) {
    return {
      season: "spring",
      service: "Hedge trimming",
      image: require("@/assets/images/404/spring.jpg"),
      accent: "#16a34a",
    };
  }

  if (month >= 5 && month <= 7) {
    return {
      season: "summer",
      service: "Lawn mowing",
      image: require("@/assets/images/404/summer.jpg"),
      accent: "#22c55e",
    };
  }

  return {
    season: "fall",
    service: "Leaf blowing",
    image: require("@/assets/images/404/fall.jpg"),
    accent: "#d97706",
  };
}

export default function NotFoundScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const { service, image, accent } = getSeason();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const isDesktop: boolean = Platform.OS === "web" && screenWidth >= 768;
  const heroHeight: number = screenHeight * (isDesktop ? 0.25 : 0.75);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { height: heroHeight }]}>
        <Image
          source={image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />

        <View style={[StyleSheet.absoluteFill, styles.dimOverlay]} />

        <LinearGradient
          colors={["transparent", colors.background]}
          style={styles.gradient}
        />
      </View>

      <View style={styles.content}>
        <ThemedText
          type="h1"
          style={[styles.code, { color: accent }]}
        >
          404
        </ThemedText>
        <ThemedText
          type="h3"
          align="center"
          style={styles.title}
        >
          This page doesn&apos;t exist.
        </ThemedText>
        <ThemedText
          type="muted"
          align="center"
          style={styles.body}
        >
          In the meantime, {service.toLowerCase()} season is here.
        </ThemedText>
        <Link
          href="/"
          dismissTo
          asChild
          testID="not-found_link_go-back-home"
        >
          <Button
            label="Go back home"
            style={styles.button}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { position: "relative", width: "100%" },
  dimOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  content: {
    position: "absolute",
    bottom: "15%",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  code: {
    fontSize: 64,
    lineHeight: 64,
    fontWeight: "800",
    marginBottom: Spacing.two,
  },
  title: { marginBottom: Spacing.two },
  body: { marginBottom: Spacing.five },
  button: { minWidth: 180 },
});
