import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuthStore } from "@/src/store/auth.store";
import { City, Sublocation } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { citiesService } from "@/src/services/cities.service";
import { useBookingStore } from "@/src/store/booking.store";
import { router } from "expo-router";

function getGreeting() {
  const h = new Date().getHours();

  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";

  return "Evening";
}

export default function Home() {
  const { user } = useAuthStore();
  const { draft, setCity, setSublocation, setTimes } = useBookingStore();
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

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const data = await citiesService.getCities();
      setCities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    if (!subSearch.trim()) {
      setFilteredSubs(sublocations);
      return;
    }
    const query = subSearch.toLowerCase();
    setFilteredSubs(
      sublocations.filter(
        (sub) =>
          sub.name.toLowerCase().includes(query) ||
          sub.address.toLowerCase().includes(query),
      ),
    );
  }, [subSearch, sublocations]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const totalHours = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
  );

  const totalDays = Math.ceil(totalHours / 24);

  useEffect(() => {
    setTimes(startTime, endTime);
  }, [startTime, endTime]);

  const canSearch = !!draft.city && !!draft.sublocation;

  const handleSelectCity = useCallback(async (city: City) => {
    setCity(city);
    setShowCityModal(false);
    setLoadingSubs(true);
    setSubSearch("");

    try {
      const data = await citiesService.getSublocations(city.id);
      setSublocations(data);
      setFilteredSubs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubs(false);
    }
  }, []);

  const handleSelectSub = useCallback((sub: Sublocation) => {
    setSublocation(sub);
    setShowSubModal(false);
    setSubSearch("");
  }, []);

  const handleSearch = () => {
    if (!draft.city || !draft.sublocation) return;
    setTimes(startTime, endTime);
    router.push("/(main)/cars");
  };

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

        <View className="mx-6 bg-[#13131A] rounded-3xl border border-[#22222E] p-5 mb-6">
          <Text className="mb-6 text-2xl font-bold text-white">
            Plan Your Ride
          </Text>

          <View className="mb-4">
            <Text className="text-[#9494AB] text-xs font-bold tracking-widest uppercase mb-2">
              City
            </Text>

            <TouchableOpacity
              onPress={() => setShowCityModal(true)}
              className="bg-[#0A0A0F] border border-[#22222E] rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View
                  className={`w-2.5 h-2.5 rounded-full mr-3 ${draft.city ? "bg-[#E8500A]" : "bg-[#22222E]"}`}
                />

                <Text
                  className={`text-lg font-semibold ${draft.city ? "text-white" : "text-[#5A5A72]"}`}
                >
                  {draft?.city?.name || "Select City"}
                </Text>
              </View>

              {loadingCities ? (
                <ActivityIndicator size={"small"} color={"#E8500A"} />
              ) : (
                <Text className="text-[#E8500A] font-bold text-2xl">›</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-[#9494AB] text-xs font-bold tracking-widest uppercase mb-2">
              Pick up Point
            </Text>

            <TouchableOpacity
              onPress={() => draft.city && setShowSubModal(true)}
              disabled={!draft.city}
              className={`bg-[#0A0A0F] border rounded-2xl px-4 py-4 flex-row items-center justify-between ${!draft.city ? "opacity-40 border-[#22222E]" : "border-[#22222E]"}`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-2.5 h-2.5 rounded-full mr-3 ${draft.sublocation ? "bg-[#E8500A]" : "bg-[#22222E]"}`}
                />

                <Text
                  numberOfLines={1}
                  className={`text-lg font-semibold ${draft.sublocation ? "text-white" : "text-[#5A5A72]"}`}
                >
                  {draft?.sublocation?.name || "Select Pickup Point"}
                </Text>
              </View>

              {loadingSubs ? (
                <ActivityIndicator size={"small"} color={"#E8500A"} />
              ) : (
                <Text className="text-[#E8500A] font-bold text-2xl">›</Text>
              )}
            </TouchableOpacity>

            {draft.sublocation && (
              <Text
                className="text-[#5A5A72] text-sm mt-2 ml-6 font-medium"
                numberOfLines={1}
              >
                {draft.sublocation.address}
              </Text>
            )}
          </View>

          <View className="h-px bg-[#22222E] mb-6" />

          <Text className="text-[#9494AB] text-xs font-bold tracking-widest uppercase mb-4">
            Rental Period
          </Text>

          <View className="flex-row mb-4" style={{ gap: 10 }}>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              disabled={!canSearch}
              className={`flex-1 bg-[#0A0A0F] border rounded-2xl p-4 ${!canSearch ? "opacity-40 border-[#22222E]" : "border-[#22222E]"}`}
            >
              <Text className="text-[#E8500A] text-xs font-bold tracking-widest uppercase mb-2">
                Pickup
              </Text>

              <Text className="mb-1 text-2xl font-bold text-white">
                {formatDate(startTime)}
              </Text>
              <Text className="text-[#9494AB] text-sm font-medium">
                {formatTime(startTime)}
              </Text>
            </TouchableOpacity>

            <View className="items-center justify-center px-1">
              <View className="w-px h-8 bg-[#22222E]" />
              <Text className="text-[#E8500A] font-bold text-xl my-1">→</Text>
              <View className="w-px h-8 bg-[#22222E]" />
            </View>

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              disabled={!canSearch}
              className={`flex-1 bg-[#0A0A0F] border rounded-2xl p-4 ${!canSearch ? "opacity-40 border-[#22222E]" : "border-[#22222E]"}`}
            >
              <Text className="mb-2 font-bold tracking-widest text-[#00D4AA] uppercase text-xs">
                Return
              </Text>

              <Text className="mb-1 text-2xl font-bold text-white">
                {formatDate(endTime)}
              </Text>

              <Text className="text-[#9494AB] text-sm font-medium">
                {formatTime(endTime)}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-[#0A0A0F] border border-[#22222E] rounded-2xl px-4 py-4 flex-row items-center justify-between mb-6">
            <Text className="text-[#9494AB] text-base font-medium">
              Duration
            </Text>

            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className="bg-[#E8500A20] rounded-xl px-4 py-1.5">
                <Text className="text-[#E8500A] text-sm font-bold">
                  {totalDays}D
                </Text>
              </View>

              <View className="bg-[#00D4AA20] rounded-xl px-4 py-1.5">
                <Text className="text-[#00D4AA] text-sm font-bold">
                  {totalHours}H
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSearch}
            disabled={!canSearch}
            activeOpacity={0.85}
            className={`rounded-2xl py-5 items-center ${canSearch ? "bg-[#E8500A]" : "bg-[#1C1C26]"}`}
          >
            <Text
              className={`font-bold text-base tracking-widest uppercase ${canSearch ? "text-white" : "text-[#5A5A72]"}`}
            >
              {canSearch ? "Search Available Cars" : "Select City & Location"}
            </Text>
          </TouchableOpacity>
        </View>

        {!loadingCities && cities.length > 0 && (
          <View className="mb-6">
            <Text className="px-6 mb-4 text-2xl font-bold text-white">
              Quick Select
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-6"
            >
              <View className="flex-row" style={{ gap: 12 }}>
                {cities?.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    onPress={() => handleSelectCity(city)}
                    className={`px-5 py-4 rounded-2xl border ${draft.city?.id === city.id ? "bg-[#E8500A] border-[#E8500A]" : "bg-[#13131A] border-[#22222E]"}`}
                  >
                    <Text
                      className={`font-bold text-base ${draft.city?.id === city?.id ? "text-white" : "text-white"}`}
                    >
                      {city.name}
                    </Text>

                    <Text
                      className={`text-sm mt-0.5 font-medium ${draft.city?.id === city.id ? "text-white opacity-80" : "text-[#5A5A72]"}`}
                    >
                      {city._count.sublocations} locations
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <TouchableOpacity className="mx-6 bg-[#13131A] border border-[#22222E] rounded-3xl p-5 flex-row items-center justify-between">
          <View>
            <Text className="mb-1 text-xl font-bold text-white">
              My Bookings
            </Text>

            <Text className="text-[#5A5A72] text-base font-medium">
              View Active & Past rides
            </Text>
          </View>

          <View className="w-12 h-12 rounded-2xl bg-[#0A0A0F] border border-[#22222E] items-center justify-center">
            <Text className="text-[#E8500A] font-bold text-2xl">›</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCityModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCityModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowCityModal(false)}
          className="justify-end flex-1 bg-black/60"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-[#13131A] rounded-t-3xl pt-5 pb-10"
          >
            <View className="w-10 h-1 rounded-full bg-[#22222E] self-center mb-6" />

            <Text className="px-6 mb-6 text-2xl font-bold text-white">
              Select City
            </Text>

            {cities?.map((city) => (
              <TouchableOpacity
                onPress={() => handleSelectCity(city)}
                key={city.id}
                className={`flex-row items-center justify-between px-6 py-4 mx-4 rounded-2xl mb-3 ${draft.city?.id === city?.id ? "bg-[#E8500A15] border border-[#E8500A40]" : "bg-[#0A0A0F] border border-[#22222E]"}`}
              >
                <View>
                  <Text
                    className={`font-bold text-lg ${draft.city?.id === city.id ? "text-[#E8500A]" : "text-white"}`}
                  >
                    {city?.name}
                  </Text>

                  <Text className="text-[#5A5A72] text-sm font-medium mt-0.5">
                    {city._count.sublocations} pickup points
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showSubModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSubModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSubModal(false)}
          className="justify-end flex-1 bg-black/60"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-[#13131A] rounded-t-3xl pt-5 pb-10"
            style={{ maxHeight: "80%" }}
          >
            <View className="w-10 h-1 rounded-full bg-[#22222E] self-center mb-5" />

            <Text className="px-6 mb-1 text-2xl font-bold text-white">
              Pickup Point
            </Text>

            <Text className="text-[#5A5A72] text-base font-medium px-6 mb-4">
              {draft?.city?.name} - {sublocations.length}
            </Text>

            <View className="mx-4 mb-4 bg-[#0A0A0F] border border-[#22222E] rounded-2xl px-4 py-3.5 flex-row items-center">
              <Text className="text-[#5A5A72] mr-2 text-base"></Text>

              <TextInput
                value={subSearch}
                onChangeText={setSubSearch}
                placeholder="Search Location"
                placeholderTextColor={"#5A5A72"}
                className="flex-1 text-base text-white"
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={filteredSubs}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 20,
                gap: 8,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectSub(item)}
                  className={`flex-row items-center justify-between py-4 px-4 rounded-2xl ${draft.sublocation?.id === item.id ? "bg-[#E8500A15] border border-[#E8500A40]" : "bg-[#0A0A0F] border border-[#22222E]"}`}
                >
                  <View className="flex-1 mr-3">
                    <Text
                      className={`font-bold text-base ${draft.sublocation?.id === item?.id ? "text-[#E8500A]" : "text-white"}`}
                    >
                      {item?.name}
                    </Text>

                    <Text
                      className="text-[#5A5A72] text-sm font-medium mt-0.5"
                      numberOfLines={1}
                    >
                      {item?.address}
                    </Text>
                  </View>

                  {draft?.sublocation?.id === item?.id && (
                    <View className="rounded-full w-7 h-7 bg-[#E8500A] items-center justify-center">
                      <Text className="text-sm font-bold text-white">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <DateTimePickerModal
        isVisible={showStartPicker}
        mode="datetime"
        themeVariant="dark"
        isDarkModeEnabled={true}
        buttonTextColorIOS="#E8500A"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setShowStartPicker(false);
          setStartTime(date);
          if (date > endTime) {
            setEndTime(new Date(date.getTime() + 24 * 60 * 60 * 1000));
          }
        }}
        onCancel={() => setShowStartPicker(false)}
      />

      <DateTimePickerModal
        isVisible={showEndPicker}
        mode="datetime"
        themeVariant="dark"
        isDarkModeEnabled={true}
        buttonTextColorIOS="#E8500A"
        minimumDate={startTime}
        onConfirm={(date) => {
          setShowEndPicker(false);
          setEndTime(date);
        }}
        onCancel={() => setShowEndPicker(false)}
      />
    </SafeAreaView>
  );
}
