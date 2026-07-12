import { useAuthStore } from "@/src/store/auth.store";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      await loadUser();
      // Check store state - if loadUser failed, user will still be null
      const { user } = useAuthStore.getState();

      if (user) {
        router.replace("/(main)/home");
      } else {
        // Token was invalid/expired and got cleared
        router.replace("/(auth)/login");
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
