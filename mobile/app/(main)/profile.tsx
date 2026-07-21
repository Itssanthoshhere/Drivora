import { bookingsService } from "@/src/services/bookings.service";
import { useAuthStore } from "@/src/store/auth.store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, logout, isLoading } = useAuthStore();
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const bookings = await bookingsService.getMyBookings();
      setStats({
        total: bookings.length,
        confirmed: bookings.filter(
          (b) => b.status === "CONFIRMED" || b.status === "ACTIVE",
        ).length,
        completed: bookings.filter((b) => b.status === "COMPLETED").length,
        cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login" as any);
        },
      },
    ]);
  };

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  const menuItems = [
    {
      section: "Account",
      items: [
        {
          label: "My Bookings",
          sub: "View all your rides",
          onPress: () => router.push("/(main)/bookings" as any),
          arrow: true,
        },
        {
          label: "Book a Car",
          sub: "Start a new booking",
          onPress: () => router.push("/(main)/home" as any),
          arrow: true,
        },
      ],
    },
    {
      section: "Support",
      items: [
        {
          label: "Help & Support",
          sub: "FAQs and contact",
          onPress: () => {},
          arrow: true,
        },
        {
          label: "Terms of Service",
          sub: "Read our terms",
          onPress: () => {},
          arrow: true,
        },
        {
          label: "Privacy Policy",
          sub: "How we use your data",
          onPress: () => {},
          arrow: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center mb-6"
          >
            <Text className="text-base font-bold text-white">←</Text>
          </TouchableOpacity>
          <Text className="text-[#9494A8] text-xs tracking-[3px] uppercase mb-1">
            Account
          </Text>
          <Text className="text-3xl font-bold text-white">Profile</Text>
        </View>

        {/* Avatar + info card */}
        <View className="mx-6 bg-[#13131A] border border-[#22222E] rounded-3xl p-6 mb-6">
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="w-20 h-20 rounded-2xl bg-[#E8500A] items-center justify-center mr-5">
              <Text
                style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "bold" }}
              >
                {initials}
              </Text>
            </View>

            {/* Info */}
            <View className="flex-1">
              <Text
                style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "bold" }}
              >
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={{ color: "#9494A8", fontSize: 13, marginTop: 4 }}>
                {user?.email}
              </Text>
              <Text style={{ color: "#9494A8", fontSize: 13, marginTop: 2 }}>
                +91 {user?.phone}
              </Text>
            </View>
          </View>

          {/* Verified badge */}
          <View className="mt-5 pt-4 border-t border-[#22222E] flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  user?.isVerified ? "bg-[#00D4AA]" : "bg-[#FFB800]"
                }`}
              />
              <Text
                style={{
                  color: user?.isVerified ? "#00D4AA" : "#FFB800",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {user?.isVerified ? "Verified Account" : "Verification Pending"}
              </Text>
            </View>
            <View className="bg-[#E8500A20] rounded-xl px-3 py-1">
              <Text
                style={{ color: "#E8500A", fontSize: 12, fontWeight: "600" }}
              >
                {user?.role}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="mx-6 mb-6">
          <Text className="mb-4 text-xl font-bold text-white">Your Stats</Text>
          {loadingStats ? (
            <View className="bg-[#13131A] border border-[#22222E] rounded-3xl py-8 items-center">
              <ActivityIndicator color="#E8500A" />
            </View>
          ) : (
            <View className="bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden">
              <View className="flex-row">
                {[
                  { label: "Total", value: stats.total, color: "#E8500A" },
                  { label: "Active", value: stats.confirmed, color: "#00D4AA" },
                  { label: "Done", value: stats.completed, color: "#9494A8" },
                ].map((stat, i) => (
                  <View
                    key={i}
                    className={`flex-1 py-5 items-center ${i < 2 ? "border-r border-[#22222E]" : ""}`}
                  >
                    <Text
                      className="mb-1 text-3xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </Text>
                    <Text className="text-[#9494A8] text-xs font-medium">
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Cancelled */}
              {stats.cancelled > 0 && (
                <View className="border-t border-[#22222E] px-5 py-3 flex-row items-center justify-between">
                  <Text className="text-[#9494A8] text-sm font-medium">
                    Cancelled bookings
                  </Text>
                  <Text className="text-[#FF4D4D] font-bold text-base">
                    {stats.cancelled}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Menu sections */}
        {menuItems.map((section, si) => (
          <View key={si} className="mx-6 mb-6">
            <Text className="text-[#9494A8] text-xs font-bold tracking-[3px] uppercase mb-3">
              {section.section}
            </Text>
            <View className="bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden">
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                  className={`flex-row items-center justify-between px-5 py-4 ${
                    ii < section.items.length - 1
                      ? "border-b border-[#22222E]"
                      : ""
                  }`}
                >
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-white">
                      {item.label}
                    </Text>
                    <Text className="text-[#5A5A72] text-xs mt-0.5">
                      {item.sub}
                    </Text>
                  </View>
                  {item.arrow && (
                    <Text className="text-[#E8500A] font-bold text-xl ml-3">
                      ›
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App info */}
        <View className="mx-6 mb-6 bg-[#13131A] border border-[#22222E] rounded-3xl px-5 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold text-white">Drivora</Text>
            <Text className="text-[#5A5A72] text-xs mt-0.5">Version 1.0.0</Text>
          </View>
          <View className="w-10 h-10 rounded-2xl bg-[#E8500A] items-center justify-center">
            <Text className="text-base font-bold text-white">D</Text>
          </View>
        </View>

        {/* Logout */}
        <View className="mx-6">
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoading}
            activeOpacity={0.85}
            className="border border-[#FF4D4D40] bg-[#FF4D4D10] rounded-2xl py-5 items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#FF4D4D" size="small" />
            ) : (
              <Text className="text-[#FF4D4D] font-bold text-sm tracking-widest uppercase">
                Sign Out
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
