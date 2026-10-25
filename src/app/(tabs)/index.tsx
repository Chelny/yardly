import { ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";

export default function OverviewScreen(): React.JSX.Element {
  return (
    <ScrollView>
      <ThemedText type="muted">Test Overview.</ThemedText>
    </ScrollView>
  );
}
