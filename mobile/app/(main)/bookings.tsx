import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Booking } from "@/src/types";
import { bookingsService } from "@/src/services/bookings.service";
import { formatDate, formatTime } from "@/src/utils/date";
import { useMemo } from "react";

type TabType = "ALL" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pending", color: "#FFB800", bg: "#FFB80015" },
  CONFIRMED: { label: "Confirmed", color: "#00D4AA", bg: "#00D4AA15" },
  ACTIVE: { label: "Active", color: "#2196F3", bg: "#2196F315" },
  COMPLETED: { label: "Completed", color: "#9494A8", bg: "#9494A815" },
  CANCELLED: { label: "Cancelled", color: "#FF4D4D", bg: "#FF4D4D15" },
};

const tabs: { label: string; value: TabType }[] = [
  { label: "All", value: "ALL" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingsService.getMyBookings();
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "ALL") {
      return bookings;
    }
    return bookings.filter((b) => b.status === activeTab);
  }, [activeTab, bookings]);

  const handleCancel = async (id: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setCancelling(id);
            try {
              await bookingsService.cancelBooking(id);
              await loadBookings();
            } catch (e: any) {
              Alert.alert(
                "Error",
                e?.response?.data?.message || "Failed to cancel booking",
              );
            } finally {
              setCancelling(null);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="px-6 pt-4 pb-6">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(main)/home" as any);
            }
          }}
          className="w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center mb-6"
        >
          <Text className="text-base font-bold text-white">←</Text>
        </TouchableOpacity>
        <Text className="text-[#9494A8] text-xs tracking-[3px] uppercase mb-1">
          Your Rides
        </Text>
        <Text className="text-3xl font-bold text-white">Bookings</Text>
      </View>

      <View className="mb-4">
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item.value)}
              className={`px-4 py-2 rounded-xl border ${
                activeTab === item.value
                  ? "bg-[#E8500A] border-[#E8500A]"
                  : "bg-[#13131A] border-[#22222E]"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === item.value ? "text-white" : "text-[#9494A8]"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator color="#E8500A" size="large" />
          <Text className="text-[#5A5A72] text-sm mt-4">
            Loading Bookings...
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View className="items-center justify-center flex-1 px-6">
          <View className="w-20 h-20 rounded-3xl bg-[#13131A] border border-[#22222E] items-center justify-center mb-6">
            <Text className="text-4xl">🚗</Text>
          </View>
          <Text className="mb-2 text-2xl font-bold text-white">
            No Bookings
          </Text>
          <Text className="text-[#5A5A72] text-center">
            {activeTab === "ALL"
              ? "You haven't made any bookings yet."
              : `No ${activeTab.toLowerCase()} bookings found.`}
          </Text>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#E8500A"
            />
          }
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              formatDate={formatDate}
              formatTime={formatTime}
              onCancel={handleCancel}
              cancelling={cancelling}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function BookingCard({
  booking,
  formatDate,
  formatTime,
  onCancel,
  cancelling,
}: {
  booking: Booking;
  formatDate: (s: string) => string;
  formatTime: (s: string) => string;
  onCancel: (id: string) => void;
  cancelling: string | null;
}) {
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CONFIRMED;
  const canCancel =
    booking.status === "CONFIRMED" || booking.status === "PENDING";
  const isCancelling = cancelling === booking.id;

  return (
    <View className="bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden">
      <View className="relative items-center justify-center h-40 bg-white">
        <Image
          className="w-full h-36"
          resizeMode="contain"
          source={{ uri: booking.car.images[0] }}
        />

        <View
          style={{ backgroundColor: status.bg }}
          className="absolute top-3 right-3 rounded-xl px-3 py-1.5"
        >
          <Text className="text-xs font-bold" style={{ color: status.color }}>
            {status.label}
          </Text>
        </View>

        <View className="absolute top-3 left-3 bg-black/30 rounded-xl px-3 py-1.5">
          <Text className="text-xs font-bold text-white">
            #{booking.id.slice(0, 6).toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 mr-3">
            <Text className="text-xl font-bold text-white">
              {booking.car.name}
            </Text>
            <Text className="text-[#9494A8] text-sm font-medium mt-0.5">
              {booking.car.brand} • {booking.car.model}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-[#E8500A] font-bold text-xl">
              ₹{booking.totalPrice.toLocaleString("en-IN")}
            </Text>
            <Text className="text-[#5A5A72]">Total</Text>
          </View>
        </View>

        <View className="bg-[#0A0A0F] border border-[#22222E] rounded-2xl p-4 mb-4">
          <View className="flex-row items-stretch">
            <View className="items-center mr-3">
              <View className="w-2.5 h-2.5 rounded-full bg-[#E8500A]" />
              <View className="w-px flex-1 bg-[#22222E] my-1" />
              <View className="w-2.5 h-2.5 rounded-full bg-[#00D4AA]" />
            </View>
            <View className="flex-1">
              <View className="mb-3">
                <Text className="text-[#E8500A] text-xs font-bold uppercase tracking-wider mb-0.5">
                  Pickup
                </Text>
                <Text className="text-sm font-semibold text-white">
                  {formatDate(booking.startTime)}
                </Text>
                <Text className="text-[#9494A8] text-xs">
                  {formatTime(booking.startTime)}
                </Text>
              </View>
              <View>
                <Text className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-0.5">
                  Return
                </Text>
                <Text className="text-sm font-semibold text-white">
                  {formatDate(booking.endTime)}
                </Text>
                <Text className="text-[#9494A8] text-xs">
                  {formatTime(booking.endTime)}
                </Text>
              </View>
            </View>

            <View className="items-end justify-between">
              <View className="items-end">
                <Text className="text-lg font-bold text-white">
                  {booking.totalHours}
                </Text>
                <Text className="text-[#5A5A72] text-xs">Duration</Text>
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-white">
                  {booking.kmLimitTotal}
                </Text>
                <Text className="text-[#5A5A72] text-xs">KM limit</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row items-center mb-4">
          <View className="w-1.5 h-1.5 rounded-full bg-[#E8500A] mr-2" />
          <Text
            className="text-[#9494A8] text-sm font-medium flex-1"
            numberOfLines={1}
          >
            {booking.car.sublocation.name} • {booking.car.sublocation.city.name}
          </Text>
        </View>

        <View
          className="flex-row pt-3 border-t border-[#22222E]"
          style={{ gap: 8 }}
        >
          {[`${booking.car.seats} Seats`, booking.car.fuelType].map((s, i) => (
            <View
              key={i}
              className="bg-[#0A0A0F] border border-[#22222E] rounded-xl px-3 py-1.5"
            >
              <Text className="text-xs font-semibold text-white">{s}</Text>
            </View>
          ))}
        </View>

        {canCancel && (
          <TouchableOpacity
            className="mt-4 py-4 rounded-2xl border border-[#FF4D4D40] bg-[#FF4D4D10] items-center"
            disabled={isCancelling}
            onPress={() => onCancel(booking.id)}
          >
            {isCancelling ? (
              <ActivityIndicator color={"#FF4D4D"} size={"small"} />
            ) : (
              <Text className="text-[#FF4D4D] font-bold text-sm tracking-widest uppercase">
                Cancel Booking
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
