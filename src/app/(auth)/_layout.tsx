import { Stack } from "expo-router";

export default function AuthLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: "minimal",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ title: "Create account" }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot password" }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ title: "Choose a new password" }}
      />
    </Stack>
  );
}
