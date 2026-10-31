import { Pressable, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  testID?: string;
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  testID,
}: FavoriteButtonProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Remove from favorites" : "Add to favorites"
      }
      accessibilityState={{ selected: isFavorite }}
      style={styles.button}
      testID={testID}
    >
      <Heart
        size={20}
        color={isFavorite ? colors.primary : colors.textSecondary}
        fill={isFavorite ? colors.primary : "transparent"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.one,
    minWidth: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
