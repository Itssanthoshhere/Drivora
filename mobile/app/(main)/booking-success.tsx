import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSuccess() {
  const { bookingId } = useLocalSearchParams();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <Animated.View
        className="items-center justify-center flex-1 px-6"
        style={{ opacity: fadeAnim }}
      >
        {/* Success circle */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="w-32 h-32 rounded-full bg-[#00D4AA] items-center justify-center mb-8"
        >
          <Text className="text-5xl font-bold text-white">✓</Text>
        </Animated.View>

        {/* Text */}
        <Text className="text-[#00D4AA] text-xs font-bold tracking-[4px] uppercase mb-4">
          Booking Confirmed
        </Text>
        <Text className="mb-4 text-4xl font-bold leading-tight text-center text-white">
          You're all{"\n"}set to drive!
        </Text>
        <Text className="text-[#9494A8] text-base text-center leading-7 mb-8">
          Your booking has been confirmed.{"\n"}Have a great ride!
        </Text>

        {/* Booking ID */}
        <View className="bg-[#13131A] border border-[#22222E] rounded-2xl px-6 py-4 mb-10 w-full items-center">
          <Text className="text-[#5A5A72] text-xs font-medium mb-1">
            Booking ID
          </Text>
          <Text className="text-lg font-bold text-white">
            #{(bookingId as string)?.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={() => router.replace("/(main)/bookings" as any)}
          className="bg-[#E8500A] rounded-2xl py-5 mb-4 w-full items-center"
        >
          <Text className="text-sm font-bold tracking-widest text-white uppercase">
            View My Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(main)/home" as any)}
          className="border border-[#22222E] rounded-2xl py-5 w-full items-center"
        >
          <Text className="text-sm font-semibold tracking-widest text-white uppercase">
            Back to Home
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
