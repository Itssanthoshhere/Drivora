import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar, useColorScheme } from "react-native";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          {/* <Stack.Screen
            name="booking-success"
            options={{ gestureEnabled: false }}
          /> */}
        </Stack>

        <StatusBar barStyle="dark-content" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
