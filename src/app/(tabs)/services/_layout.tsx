import { Stack } from "expo-router";

export default function ServicesLayout(): React.JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTransparent: false,
          title: "Services",
        }}
      />
    </Stack>
  );
}
