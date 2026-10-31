import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface OnboardingStepProps {
  children: React.ReactNode;
  nextHref?: string;
  nextLabel?: string;
  onNext?: () => void;
  testID?: string;
  hero?: React.ReactNode;
  safeTop?: boolean;
}

export function OnboardingStep({
  children,
  nextHref,
  nextLabel = "Next",
  onNext,
  testID,
  hero,
  safeTop = true,
}: OnboardingStepProps): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = (): void => {
    if (onNext) {
      onNext();
      return;
    }
    if (nextHref) {
      router.push(nextHref as never);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        _,
        gestureState: PanResponderGestureState
      ) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        if (gestureState.dx < -50) {
          handleNext();
        }
      },
    })
  ).current;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
      {...panResponder.panHandlers}
    >
      {hero}
      <View
        style={[
          styles.content,
          safeTop && { paddingTop: insets.top + Spacing.five },
        ]}
      >
        {children}
      </View>
      <SafeAreaView
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom,
          },
        ]}
        edges={["bottom"]}
      >
        <Button
          label={nextLabel}
          onPress={handleNext}
          testID={testID}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
});
