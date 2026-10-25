import { Stack } from "expo-router";

export default function AuthLayout(): React.JSX.Element {
  const isLoggedIn: boolean = false;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerBackButtonDisplayMode: "minimal",
        gestureEnabled: false,
      }}
    >
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="sign-up"
          options={{ title: "Create account" }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="forgot-password"
          options={{ title: "Forgot password" }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="reset-password"
          options={{ title: "Choose a new password" }}
        />
      </Stack.Protected>
    </Stack>
  );
}
