import { userAuthStore } from "@/src/store/auth.store";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { loadUser } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      await loadUser();

      const state = userAuthStore.getState();

      if (state.isAuthenticated) {
        router.replace("/(main)/home");
      } else {
        router.replace("/(auth)/onboarding");
      }
    } else {
      router.replace("/(auth)/onboarding");
    }
  };
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <ActivityIndicator color={"#E8500A"} size={"large"} />
    </View>
  );
}
