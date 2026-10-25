import { EventSubscription, Platform } from "expo";
import * as Linking from "expo-linking";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

SplashScreen.preventAutoHideAsync();

// Map our palette onto React Navigation's theme shape
const navigationTheme = (scheme: "light" | "dark") => {
  const palette = scheme === "dark" ? Colors.dark : Colors.light;
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.primary,
      background: palette.background,
      card: palette.background,
      text: palette.text,
      border: palette.border,
    },
  };
};

export default function RootLayout(): React.JSX.Element {
  const scheme = useColorScheme() ?? "light";
  const legalScreenPresentation =
    Platform.OS === "ios" || Platform.OS === "android"
      ? "formSheet"
      : undefined;
  const isLoggedIn: boolean = false;

  // Handle Supabase recovery deep link: lawn-snow-app://reset-password#access_token=...
  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      const parsed = Linking.parse(url);
      const hash = url.split("#")[1];
      if (!hash) return;
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
      }
      void parsed;
    };

    Linking.getInitialURL().then(handleUrl);
    const sub: EventSubscription = Linking.addEventListener(
      "url",
      (event: Linking.EventType) => handleUrl(event.url)
    );
    return () => sub.remove();
  }, []);

  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        <Stack.Screen
          name="terms"
          options={{
            presentation: legalScreenPresentation,
            headerShown: true,
            title: "Terms of Service",
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            presentation: legalScreenPresentation,
            headerShown: true,
            title: "Privacy Policy",
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{ title: "Not Found" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
