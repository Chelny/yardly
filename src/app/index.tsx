import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface Slide {
  id: string;
  title: string;
  description: string;
  image: ImageSource;
}

const SLIDES: Slide[] = [
  {
    id: "winter",
    title: "Snow removal, on schedule",
    description:
      "Book driveway, walkway, and step clearing before the snow piles up. Track how many visits you have left this season.",
    image: require("@/assets/images/404/winter.jpg"),
  },
  {
    id: "spring",
    title: "Hedge trimming, done right",
    description:
      "Keep your hedges shaped and healthy with seasonal trims. Pick the date, we handle the rest.",
    image: require("@/assets/images/404/spring.jpg"),
  },
  {
    id: "pool",
    title: "Pool cleaning, every week",
    description:
      "Skim, vacuum, and balance your pool water. Book weekly or bi-weekly visits and track how many are left this season.",
    image: require("@/assets/images/404/summer.jpg"),
  },
  {
    id: "fall",
    title: "Leaf blowing, before it piles up",
    description:
      "Clear leaves from your lawn, walkway, and gutters. Every visit tracked. Every invoice in one place.",
    image: require("@/assets/images/404/fall.jpg"),
  },
];

export default function OnboardingScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const isLast = activeIndex === SLIDES.length - 1;
  const heroHeight = screenHeight * 0.5;

  const handleNext = (): void => {
    if (isLast) return;
    const nextIndex = activeIndex + 1;
    setActiveIndex(nextIndex);
    scrollRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
  };

  const handleSkip = (): void => {
    const lastIndex = SLIDES.length - 1;
    setActiveIndex(lastIndex);
    scrollRef.current?.scrollTo({ x: lastIndex * screenWidth, animated: true });
  };

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ): void => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {SLIDES.map((item: Slide) => (
          <View
            key={item.id}
            style={[styles.slide, { width: screenWidth }]}
          >
            <View style={[styles.hero, { height: heroHeight }]}>
              <Image
                source={item.image}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              <View style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={["transparent", colors.background]}
                style={styles.gradient}
              />
            </View>

            <View style={styles.textArea}>
              <ThemedText
                type="h1"
                style={styles.slideTitle}
              >
                {item.title}
              </ThemedText>
              <ThemedText
                type="body"
                themeColor="textSecondary"
                style={styles.slideDescription}
              >
                {item.description}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      <SafeAreaView
        style={styles.topBar}
        edges={["top"]}
        pointerEvents="box-none"
      >
        <View
          style={styles.topBarInner}
          pointerEvents="box-none"
        >
          {!isLast ? (
            <Pressable
              onPress={handleSkip}
              hitSlop={12}
              accessibilityRole="button"
            >
              <ThemedText
                type="label"
                themeColor="primary"
              >
                Skip
              </ThemedText>
            </Pressable>
          ) : (
            <View />
          )}
        </View>
      </SafeAreaView>

      <SafeAreaView
        style={styles.bottomBar}
        edges={["bottom"]}
        pointerEvents="box-none"
      >
        <View style={styles.bottomBarInner}>
          <View style={styles.bullets}>
            {SLIDES.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.bullet,
                  {
                    backgroundColor:
                      index === activeIndex ? colors.primary : colors.border,
                    width: index === activeIndex ? 20 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {isLast ? (
            <View style={styles.authRow}>
              <Link
                href="/sign-in"
                asChild
              >
                <Button
                  label="Sign In"
                  variant="outline"
                  style={styles.authButton}
                />
              </Link>
              <Link
                href="/sign-up"
                asChild
              >
                <Button
                  label="Sign Up"
                  style={styles.authButton}
                />
              </Link>
            </View>
          ) : (
            <Button
              label="Next"
              onPress={handleNext}
              style={styles.nextButton}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  slide: { flex: 1 },
  hero: { width: "100%", position: "relative" },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  textArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.three,
  },
  slideTitle: { fontSize: 34, lineHeight: 40, fontWeight: "800" },
  slideDescription: { lineHeight: 24 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topBarInner: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarInner: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  bullets: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.one,
  },
  bullet: { height: 8, borderRadius: 4 },
  nextButton: { width: "100%" },
  authRow: { flexDirection: "row", gap: Spacing.two },
  authButton: { flex: 1 },
});
