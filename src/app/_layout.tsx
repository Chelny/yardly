import { EventSubscription } from "expo";
import * as Linking from "expo-linking";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { isWeb } from "@/constants/platform";
import { Colors, Palette } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/utils/auth-store";

SplashScreen.preventAutoHideAsync();

const navigationTheme = (scheme: "light" | "dark") => {
  const palette: Palette = scheme === "dark" ? Colors.dark : Colors.light;
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

export default function RootLayout(): React.ReactNode {
  const scheme = useColorScheme() ?? "light";
  const { _hasHydrated, isLoggedIn, hasCompletedOnboarding, logIn, logOut } =
    useAuthStore();
  const legalScreenPresentation =
    Platform.OS === "web" ? undefined : "formSheet";

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        if (session) logIn();
        else logOut();
      })
      .catch(() => {
        logOut();
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session) logIn();
        else logOut();
      }
    );

    return () => subscription.unsubscribe();
  }, [logIn, logOut]);

  // Handle Supabase recovery deep link: yardly://reset-password#access_token=...
  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      const parsed: Linking.ParsedURL = Linking.parse(url);
      const hash: string | undefined = url.split("#")[1];
      if (!hash) return;
      const params: URLSearchParams = new URLSearchParams(hash);
      const access_token: string | null = params.get("access_token");
      const refresh_token: string | null = params.get("refresh_token");
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

  useEffect(() => {
    if (_hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [_hasHydrated]);

  if (!_hasHydrated && !isWeb) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected
          guard={!isWeb && !hasCompletedOnboarding && !isLoggedIn}
        >
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        <Stack.Protected
          guard={!isLoggedIn && (hasCompletedOnboarding || isWeb)}
        >
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="offers/[id]"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
            }}
          />
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
