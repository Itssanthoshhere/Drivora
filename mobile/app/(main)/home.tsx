import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { City, Sublocation } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";

function getGreeting() {
  const h = new Date().getHours();

  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";

  return "Evening";
}

export default function Home() {
  const { user } = useAuthStore();
  const [cities, setCities] = useState<City[]>([]);
  const [sublocations, setSublocations] = useState<Sublocation[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<Sublocation[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [subSearch, setSubSearch] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const [startTime, setStartTime] = useState<Date>(tomorrow);
  const [endTime, setEndTime] = useState<Date>(dayAfter);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row items-center justify-between px-6 pt-6 pb-8">
          <View>
            <Text className="text-[#9494AB] text-sm font-semibold tracking-[3px] uppercase mb-1">
              Good {getGreeting()}
            </Text>

            <Text className="text-3xl font-bold text-white">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>

          <TouchableOpacity className="w-14 h-14 rounded-2xl bg-[#E8500A] items-center justify-center">
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {user?.firstName?.[0]?.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mx-6 rounded-3xl bg-[#13131A] border border-[#22222E] overflow-hidden mb-8">
          <View className="p-6">
            <View className="bg-[#E8500A] self-start rounded-full px-4 py-1.5 mb-5">
              <Text className="text-xs font-bold tracking-widest text-white uppercase">
                Self Drive
              </Text>
            </View>

            <Text className="mb-2 text-4xl font-bold leading-tight text-white">
              Where to today?
            </Text>
          </View>
        </View>

        <View className="flex-row border-t border-[#22222E]">
          {[
            { label: "Cities", value: "5" },
            { label: "Locations", value: "75" },
            { label: "Cars", value: "300+" },
          ].map((stat, i) => (
            <View
              key={i}
              className={`flex-1 py-5 items-center ${i < 2 ? "border-r border-[#22222E]" : ""}`}
            >
              <Text className="text-2xl font-bold text-white mb-0.5">
                {stat.value}
              </Text>
              <Text className="text-[#5A5A72] text-sm font-medium">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
