import { carsService } from "@/src/services/cars.service";
import { useBookingStore } from "@/src/store/booking.store";
import { Car } from "@/src/types";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

type FilterType =
  | "ALL"
  | "PETROL"
  | "DIESEL"
  | "ELECTRIC"
  | "CNG"
  | "MANUAL"
  | "AUTOMATIC";

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "ALL" },
  { label: "Petrol", value: "PETROL" },
  { label: "Diesel", value: "DIESEL" },
  { label: "Electric", value: "ELECTRIC" },
  { label: "CNG", value: "CNG" },
  { label: "Manual", value: "MANUAL" },
  { label: "Auto", value: "AUTOMATIC" },
];

export default function Cars() {
  const { draft, setCar } = useBookingStore();
  const [cars, setCars] = useState<Car[]>([]);
  const [filtered, setFiltered] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [sortBy, setSortBy] = useState<"price" | "seats">("price");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!draft.sublocation || !draft.startTime || !draft.endTime) {
      router.replace("/(main)/home");
      return;
    }

    setReady(true);
  }, []);

  const loadCars = async () => {
    if (!draft.sublocation || !draft.startTime || !draft.endTime) return;

    setLoading(true);
    try {
      const params: any = {
        sublocationId: draft.sublocation.id,
        startTime: draft.startTime.toISOString(),
        endTime: draft.endTime.toISOString(),
      };

      if (activeFilter !== "ALL") {
        if (["PETROL", "DIESEL", "ELECTRIC", "CNG"].includes(activeFilter)) {
          params.fuelType = activeFilter;
        } else {
          params.transmission = activeFilter;
        }
      }

      const data = await carsService.getAvailableCars(params);
      setCars(data);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load available cars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready) {
      loadCars();
    }
  }, [ready, activeFilter]);

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const totalDays =
    draft.startTime && draft.endTime
      ? Math.ceil(
          (draft.endTime.getTime() - draft.startTime.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 1;

  const applySort = useCallback(() => {
    let result = [...cars];

    if (sortBy == "price") {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else {
      result.sort((a, b) => b.seats - a.seats);
    }

    setFiltered(result);
  }, [cars, sortBy]);

  useEffect(() => {
    applySort();
  }, [cars, applySort, sortBy]);

  const handleSelectCar = (car: Car) => {
    setCar(car);
    router.push("/(main)/car-detail");
  };

  if (!ready) {
    return <View className="flex-1 bg-[#0A0A0F]" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="flex-row items-center px-6 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center mr-4"
        >
          <Text className="text-base font-bold text-white">←</Text>
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-xl font-bold text-white">Available Cars</Text>
          <Text className="text-[#5A5A72] text-xs mt-0.5">
            {draft.sublocation?.name} * {formatDate(draft.startTime)} →{" "}
            {formatDate(draft.endTime)}
          </Text>
        </View>
      </View>

      <View className="mx-6 mb-4 bg-[#13131A] border border-[#22222E] rounded-2xl px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-[#E8500A] mr-2" />

          <Text className="text-sm font-semibold text-white">
            {draft?.city?.name}
          </Text>
        </View>

        <View className="w-px h-4 bg-[#22222E]" />

        <Text className="text-[#9494A8] text-sm">
          {totalDays} {totalDays > 1 ? "days" : "day"}
        </Text>

        <View className="w-px h-4 bg-[#22222E]" />

        <View className="bg-[#E8500A20] rounded-lg px-2 py-0.5">
          <Text className="text-[#E8500A] text-xs font-bold">
            {loading ? "..." : `${filtered.length} cars`}
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6"
          contentContainerStyle={{ gap: 8 }}
        >
          {filters?.map((f) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(f.value)}
              className={`px-4 py-2 rounded-xl border ${activeFilter === f.value ? "bg-[#E8500A] border border-[#E8500A]" : "bg-[#13131A] border-[#22222E]"}`}
              key={f.value}
            >
              <Text
                className={`text-xs font-semibold ${activeFilter == f.value ? "text-white" : "text-[#9494A8]"}`}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="flex-row items-center px-6 mb-4">
        <Text className="text-[#5A5A72] text-xs mr-3">Sort By:</Text>

        <TouchableOpacity
          onPress={() => setSortBy("price")}
          className={`px-3 py-1.5 rounded-lg mr-2 ${sortBy === "price" ? "bg-[#E8500A20]" : ""}`}
        >
          <Text
            className={`text-xs font-semibold ${sortBy == "price" ? "text-[#E8500A]" : "text-[#5A5A72]"}`}
          >
            Price
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortBy("seats")}
          className={`px-3 py-1.5 rounded-lg ${sortBy === "seats" ? "bg-[#E8500A20]" : ""}`}
        >
          <Text
            className={`text-xs font-semibold ${sortBy === "seats" ? "text-[#E8500A]" : "text-[#5A5A72]"}`}
          >
            Seats
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator color={"#E8500A"} size={"large"} />

          <Text className="text-[#5A5A72] text-sm mt-4">
            Finding Available Cars
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View className="items-center justify-center flex-1 px-8">
          <View className="w-20 h-20 rounded-3xl bg-[#13131A] border border-[#22222E] items-center justify-center mb-6">
            <Text style={{ fontSize: 36 }}>🚗</Text>
          </View>

          <Text className="mb-2 text-xl font-bold text-center text-white">
            No Cars Available
          </Text>

          <Text className="text-[#5A5A72] text-sm text-center leading-6 mb-8">
            No cars match your current filters.{"\n"}Try a different filter or
            clear them all.
          </Text>

          <TouchableOpacity
            onPress={() => setActiveFilter("ALL")}
            className="bg-[#E8500A] rounded-2xl px-8 py-3.5"
          >
            <Text className="text-sm font-bold tracking-wider text-white">
              Clear Filters
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 40,
            gap: 16,
          }}
          renderItem={({ item }) => (
            <CarCard
              car={item}
              totalDays={totalDays}
              onPress={() => handleSelectCar(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function CarCard({
  car,
  totalDays,
  onPress,
}: {
  car: Car;
  totalDays: number;
  onPress: () => void;
}) {
  const totalPrice = car.pricePerDay * totalDays;
  const fuelColor = FUEL_COLORS[car.fuelType] || "#9494A8";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-[#13131A] rounded-3xl border border-[#22222E] overflow-hidden"
    >
      <View>
        <Image
          source={{ uri: car.images?.[0] }}
          className="w-full h-44"
          resizeMode="contain"
        />

        <View
          style={{ backgroundColor: fuelColor + "20" }}
          className="absolute px-3 py-1 top-3 left-3 rounded-xl"
        >
          <Text style={{ color: fuelColor }} className="text-xs font-bold">
            {FUEL_LABELS[car.fuelType]}
          </Text>
        </View>

        <View className="absolute px-3 py-1 border border-gray-200 rounded-xl bg-white/80 top-3 right-3">
          <Text className="text-xs font-semibold text-gray-600">
            {car.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">{car.name}</Text>
            <Text className="text-[#9494AB] text-sm font-medium mt-0.5">
              {car.brand} ⋅ {car.year}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-[#E8500A] font-bold text-2xl">
              ₹{car.pricePerDay.toLocaleString()}
            </Text>

            <Text className="text-[#9494A8] text-xs font-medium">Per Day</Text>
          </View>
        </View>

        <View className="flex-row gap-2 mb-4">
          {[
            `${car.seats} Seats`,
            `${car.kmLimitPerDay} km/day`,
            `₹${car.extraKmCharge}/km extra`,
          ].map((spec, i) => (
            <View
              key={i}
              className="bg-[#0A0A0F] border border-[#22222E] rounded-xl px-3 py-1.5"
            >
              <Text className="text-xs font-semibold text-white">{spec}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row flex-wrap gap-2 mb-4">
          {car.features.slice(0, 3).map((f, i) => (
            <View key={i} className="bg-[#E8500A15] rounded-lg px-2 py-1">
              <Text className="text-[#E8500A] text-xs font-semibold">{f}</Text>
            </View>
          ))}

          {car.features.length > 3 && (
            <View className="bg-[#22222E] rounded-lg px-2 py-1">
              <Text className="text-[#9494A8]">
                +{car.features.length - 3} more
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between pt-3 border-t border-[#22222E]">
          <View>
            <Text className="text-[#9494A8] text-xs font-medium">
              Total for {totalDays} {totalDays > 1 ? "days" : "day"}
            </Text>

            <Text className="text-2xl font-bold text-white">
              ₹{totalPrice.toLocaleString()}
            </Text>
          </View>

          <View className="bg-[#E8500A] rounded-2xl px-5 py-3">
            <Text className="text-sm font-bold tracking-wider text-white">
              Book Now
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
