import { carsService } from "@/src/services/cars.service";
import { useBookingStore } from "@/src/store/booking.store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FUEL_COLORS: Record<string, string> = {
  PETROL: "#4CAF50",
  DIESEL: "#FF9800",
  ELECTRIC: "#2196F3",
  CNG: "#9C27B0",
};

const FUEL_LABELS: Record<string, string> = {
  PETROL: "Petrol",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  CNG: "CNG",
};

export default function CarDetail() {
  const { draft } = useBookingStore();
  const car = draft.car;

  const [pricing, setPricing] = useState<any>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    if (car && draft.startTime && draft.endTime) {
      loadPricing();
    } else {
      setLoadingPrice(false);
    }
  }, [car, draft.startTime, draft.endTime]);

  const loadPricing = async () => {
    try {
      const data = await carsService.calculatePrice({
        carId: car!.id,
        startTime: draft.startTime!.toISOString(),
        endTime: draft.endTime!.toISOString(),
      });

      setPricing(data);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to calculate pricing. Please try again.");
    } finally {
      setLoadingPrice(false);
    }
  };

  useEffect(() => {
    if (!car) router.back();
  }, [car]);

  if (!car) return null;

  const fuelColor = FUEL_COLORS[car?.fuelType] || "#9494AB";

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const specItems = [
    { label: "Fuel Type", value: FUEL_LABELS[car.fuelType] },
    {
      label: "Transmission",
      value: car.transmission === "AUTOMATIC" ? "Automatic" : "Manual",
    },
    { label: "Seats", value: `${car.seats} Persons` },
    { label: "Year", value: `${car.year}` },
    { label: "KM Limit", value: `${car.kmLimitPerDay} km/day` },
    { label: "Extra KM", value: `₹${car.extraKmCharge}/km` },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center"
        >
          <Text className="text-base font-bold text-white">←</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white">Car Details</Text>

        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View
          className="mx-6 mb-6 overflow-hidden bg-white rounded-3xl"
          style={{ height: 220 }}
        >
          <Image
            source={{ uri: car.images?.[0] }}
            className="w-full h-full"
            resizeMode="contain"
          />

          <View
            className="absolute px-3 top-4 left-4 rounded-xl py-1.5"
            style={{ backgroundColor: fuelColor + "25" }}
          >
            <Text className="text-xs font-bold" style={{ color: fuelColor }}>
              {FUEL_LABELS[car.fuelType]}
            </Text>
          </View>

          <View className="absolute right-4 top-4 px-3 py-1.5 border border-gray-200 bg-white/80 rounded-xl">
            <Text className="text-xs font-semibold text-gray-600">
              {car.transmission === "AUTOMATIC" ? "Automatic" : "Manual"}
            </Text>
          </View>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-white">{car.name}</Text>

              <Text className="text-[#9494A8] text-base font-medium mt-1">
                {car.brand} · {car.year}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-[#E8500A] font-bold text-3xl">
                ₹{car.pricePerDay.toLocaleString()}
              </Text>

              <Text className="text-[#9494A8] text-sm font-medium">
                per day
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 bg-[#13131A] border border-[#22222E] rounded-3xl p-5 mb-6">
          <Text className="text-[#9494A8] text-xs font-bold tracking-widest uppercase mb-4">
            Pickup Details
          </Text>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-[#9494A8] text-xs font-semibold uppercase tracking-wider mb-1">
                From
              </Text>

              <Text className="text-base font-bold text-white">
                {draft.sublocation?.name}
              </Text>

              <Text className="text-[#5A5A72] text-xs mt-0.5">
                {draft?.sublocation?.address}
              </Text>
            </View>

            <View className="w-px bg-[#22222E]" />

            <View className="flex-1 ml-3">
              <Text className="text-[#9494A8] text-xs font-semibold uppercase tracking-wider mb-1">
                City
              </Text>

              <Text className="text-base font-bold text-white">
                {draft.city?.name}
              </Text>

              <Text className="text-[#5A5A72] text-xs mt-0.5">
                {draft.city?.state}
              </Text>
            </View>
          </View>

          <View className="h-px bg-[#22222E] mb-4" />

          <View className="flex-row">
            <View className="flex-1 mr-3">
              <Text className="text-[#9494A8] font-semibold text-xs tracking-wider uppercase mb-1">
                Pickup
              </Text>

              <Text className="text-base font-bold text-white">
                {draft.startTime ? formatDate(draft.startTime) : "-"}
              </Text>

              <Text className="text-[#5A5A72] text-xs mt-0.5">
                {draft.startTime ? formatTime(draft.startTime) : "-"}
              </Text>
            </View>

            <View className="flex-1 mr-3">
              <Text className="text-[#9494A8] font-semibold text-xs tracking-wider uppercase mb-1">
                Return
              </Text>

              <Text className="text-base font-bold text-white">
                {draft.endTime ? formatDate(draft.endTime) : "-"}
              </Text>

              <Text className="text-[#5A5A72] text-xs mt-0.5">
                {draft.endTime ? formatTime(draft.endTime) : "-"}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="mb-4 text-xl font-bold text-white">
            Specifications
          </Text>

          <View className="flex-row flex-wrap" style={{ gap: 10 }}>
            {specItems.map((spec, i) => (
              <View
                key={i}
                className="bg-[#13131A] border border-[#22222E] rounded-2xl p-4"
                style={{ width: "47%" }}
              >
                <Text className="text-[#9494A8] text-xs font-semibold uppercase tracking-wider mb-1">
                  {spec.label}
                </Text>

                <Text className="text-base font-bold text-white">
                  {spec.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="mb-4 text-xl font-bold text-white">Features</Text>

          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {car.features.map((f, i) => (
              <View
                key={i}
                className="bg-[#13131A] border border-[#22222E] rounded-2xl px-4 py-2.5 flex-row items-center"
              >
                <View className="w-1.5 h-1.5 rounded-full bg-[#E8500A] mr-2" />

                <Text className="text-sm font-semibold text-white">{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="mb-4 text-xl font-bold text-white">
            Pricing Breakdown
          </Text>

          <View className="bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden">
            {loadingPrice ? (
              <View className="p-8">
                <ActivityIndicator color={"#E8500A"} />
              </View>
            ) : pricing ? (
              <>
                {[
                  {
                    label: `Base Price (${pricing.days} day${pricing.days > 1 ? "s" : ""})`,
                    value: `₹${pricing.basePrice.toLocaleString()}`,
                    highlight: false,
                  },
                  {
                    label: `KM Limit`,
                    value: `${pricing.kmLimitTotal} km total`,
                    highlight: false,
                  },
                  {
                    label: `Extra KM Charge`,
                    value: `₹${pricing.extraKmCharge}/km`,
                    highlight: false,
                  },
                  {
                    label: `Hourly Rate`,
                    value: `₹${pricing.pricePerHour}/hr`,
                    highlight: false,
                  },
                ].map((row, i, arr) => (
                  <View
                    className={`flex-row items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-[#22222E]" : ""}`}
                    key={i}
                  >
                    <Text className="text-[#9494A8] text-sm font-medium">
                      {row.label}
                    </Text>
                    <Text className="text-sm font-bold text-white">
                      {row.value}
                    </Text>
                  </View>
                ))}
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 px-6 pt-4 pb-8 right-0 bg-[#0A0A0F] border-t border-[#22222E]">
        <TouchableOpacity
          onPress={() => router.push("/(main)/booking-confirm")}
          activeOpacity={0.85}
          disabled={loadingPrice || !pricing}
          className={`rounded-2xl py-5 items-center ${loadingPrice || !pricing ? "bg-[#E8500A50]" : "bg-[#E8500A]"}`}
        >
          <Text className="text-base font-bold tracking-widest text-white uppercase">
            Confirm Booking ⋅{" "}
            {pricing ? `₹${pricing.basePrice.toLocaleString()}` : "..."}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
