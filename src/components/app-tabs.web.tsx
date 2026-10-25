import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { APP_NAME } from "@/constants/app";
import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";

export default function AppTabs(): React.JSX.Element {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger
            name="home"
            href="/"
            asChild
          >
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger
            name="services"
            href="/services"
            asChild
          >
            <TabButton>Services</TabButton>
          </TabTrigger>
          <TabTrigger
            name="booking"
            href="/booking"
            asChild
          >
            <TabButton>Book</TabButton>
          </TabTrigger>
          <TabTrigger
            name="invoices"
            href="/invoices"
            asChild
          >
            <TabButton>Invoices</TabButton>
          </TabTrigger>
          <TabTrigger
            name="profile"
            href="/profile"
            asChild
          >
            <TabButton>Profile</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps): React.JSX.Element {
  // Exclude ref to avoid type conflict with Pressable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref: _ref, ...pressableProps } = props as TabTriggerSlotProps & {
    ref?: unknown;
  };

  return (
    <Pressable
      {...pressableProps}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={styles.tabButtonView}
      >
        <ThemedText
          type="small"
          themeColor={isFocused ? "text" : "textSecondary"}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View
      {...props}
      style={styles.tabListContainer}
    >
      <ThemedView
        type="backgroundElement"
        style={styles.innerContainer}
      >
        <ThemedText
          type="smallBold"
          style={styles.brandText}
        >
          {APP_NAME}
        </ThemedText>

        {props.children}

        <ExternalLink
          href="https://www.github.com/Chelny/yardly"
          asChild
        >
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">GitHub</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: "arrow.up.right.square", web: "link" }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: "absolute",
    width: "100%",
    padding: Spacing.three,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: "auto",
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
