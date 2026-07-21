import { useBookingStore } from "@/src/store/booking.store";
import { bookingsService } from "@/src/services/bookings.service";
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

export default function BookingConfirm() {
  const { draft, resetDraft } = useBookingStore();
  const [loading, setLoading] = useState(false);

  const car = draft.car;
  const startTime = draft.startTime;
  const endTime = draft.endTime;

  useEffect(() => {
    if (!car || !startTime || !endTime) {
      router.back();
    }
  }, []);

  if (!car || !startTime || !endTime) {
    return <View className="flex-1 bg-[#0A0A0F]" />;
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const totalHours = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  );

  const totalDays = Math.ceil(totalHours / 24);
  const basePrice =
    totalHours <= 12 ? car.pricePerHour * totalHours : car.pricePerDay * totalDays;
  const totalPrice = Math.round(basePrice);
  const kmLimitTotal = car.kmLimitPerDay * totalDays;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const booking = await bookingsService.createBooking({
        carId: car.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      resetDraft();
      // Use dismissAll to clear entire stack first
      router.dismissAll();
      router.replace({
        pathname: "/(main)/booking-success",
        params: { bookingId: booking.id },
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Booking failed. Please try again";
      Alert.alert("Booking failed", msg, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center mr-4"
        >
          <Text className="text-base font-bold text-white">←</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white">Confirm Booking</Text>

        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <View className="flex-row items-center px-6 mb-8">
          {["Select Car", "Review", "Confirm"].map((step, i) => (
            <View key={i} className="flex-row items-center flex-1">
              <View className="items-center">
                <View className="items-center justify-center w-8 h-8 rounded-full bg-[#E8500A]">
                  <Text className="text-xs font-bold text-white">{i + 1}</Text>
                </View>

                <Text className="text-[#E8500A] text-xs mt-1 font-semibold">
                  {step}
                </Text>
              </View>

              {i < 2 && <View className="flex-1 h-px mx-2 mb-4 bg-[#E8500A]" />}
            </View>
          ))}
        </View>

        <View className="mx-6 bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden mb-6">
          <View className="items-center justify-center bg-white h-44">
            <Image
              source={{ uri: car.images[0] }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <View className="p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white">
                  {car.name}
                </Text>

                <Text className="text-[#9494A8] text-sm font-medium mt-0.5">
                  {car.brand} ⋅ {car.year}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-[#E8500A] font-bold text-2xl">
                  ₹{car.pricePerDay.toLocaleString()}
                </Text>

                <Text className="text-[#9494A8] text-xs font-medium">
                  per day
                </Text>
              </View>
            </View>

            <View className="flex-row mt-4" style={{ gap: 8 }}>
              {[
                `${car.seats} Seats`,
                car.transmission === "AUTOMATIC" ? "Auto" : "Manual",
                car.fuelType,
              ].map((s, i) => (
                <View
                  key={i}
                  className="bg-[#0A0A0F] border border-[#22222E] rounded-xl px-3 py-1.5"
                >
                  <Text className="text-xs font-semibold text-white">{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="mb-4 text-xl font-bold text-white">
            Trip Details
          </Text>

          <View className="bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden">
            <View className="p-5">
              <View className="flex-row items-stretch">
                <View className="items-center mr-4">
                  <View className="w-3 h-3 rounded-full bg-[#E8500A]" />
                  <View className="flex-1 w-px bg-[#22222E] my-1" />
                  <View className="w-3 h-3 rounded-full bg-[#00D4AA]" />
                </View>

                <View className="flex-1">
                  <View className="mb-5">
                    <Text className="text-[#E8500A] text-xs font-bold tracking-widest uppercase mb-1">
                      Pickup
                    </Text>

                    <Text className="text-base font-bold text-white">
                      {formatDate(startTime)}
                    </Text>

                    <Text className="text-[#9494A8] text-sm font-medium">
                      {formatTime(startTime)} ⋅ {draft.sublocation?.name}
                    </Text>

                    <Text
                      className="text-[#5A5A72] text-xs mt-0.5"
                      numberOfLines={1}
                    >
                      {draft.sublocation?.address}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-[#E8500A] text-xs font-bold tracking-widest uppercase mb-1">
                      Return
                    </Text>

                    <Text className="text-base font-bold text-white">
                      {formatDate(endTime)}
                    </Text>

                    <Text className="text-[#9494A8] text-sm font-medium">
                      {formatTime(endTime)} ⋅ {draft.sublocation?.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row border-[#22222E] border-t">
              <View className="flex-1 py-3 items-center border-r border-[#22222E]">
                <Text className="text-xl font-bold text-white">
                  {totalDays}
                </Text>
                <Text className="text-[#9494A8] text-xs font-medium">Days</Text>
              </View>

              <View className="flex-1 py-3 items-center border-r border-[#22222E]">
                <Text className="text-xl font-bold text-white">
                  {totalHours}
                </Text>
                <Text className="text-[#9494A8] text-xs font-medium">
                  Hours
                </Text>
              </View>

              <View className="flex-1 py-3 items-center border-r border-[#22222E]">
                <Text className="text-xl font-bold text-white">
                  {kmLimitTotal}
                </Text>
                <Text className="text-[#9494A8] text-xs font-medium">
                  KM Limit
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="mb-4 text-xl font-bold text-white">
            Price Breakdown
          </Text>
          <View className="bg-[#13131A] border border-[#22222E] rounded-3xl px-5 pt-2 pb-1">
            {[
              {
                label: `Daily Rate × ${totalDays} day${totalDays > 1 ? "s" : ""}`,
                value: `₹${car.pricePerDay.toLocaleString()} × ${totalDays}`,
              },
              { label: "KM Limit", value: `${kmLimitTotal} km` },
              { label: "Extra KM Charge", value: `₹${car.extraKmCharge}/km` },
              { label: "Taxes & Fees", value: "Included" },
            ].map((row, i) => (
              <View
                key={i}
                className="flex-row items-center justify-between py-3.5 border-b border-[#22222E]"
              >
                <Text className="text-[#9494A8] text-sm font-medium">
                  {row.label}
                </Text>
                <Text className="text-base font-bold text-white">
                  {row.value}
                </Text>
              </View>
            ))}
            <View className="flex-row items-center justify-between py-4">
              <Text className="text-lg font-bold text-white">Total Amount</Text>
              <Text className="text-[#E8500A] font-bold text-3xl">
                ₹{totalPrice.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 bg-[#00D4AA10] border border-[#00D4AA30] rounded-2xl px-4 py-4">
          <Text className="text-[#00D4AA] text-xs font-bold tracking-widest uppercase mb-2">
            Cancellation Policy
          </Text>
          <Text className="text-[#9494A8] text-sm leading-6">
            Free Cancellation up to 1 hour before pickup, No refund after that
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-8 bg-[#0A0A0F] border-t border-[#22222E]">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-[#9494A8] text-xs font-medium mb-1">
              Total Payable
            </Text>
            <Text className="text-3xl font-bold text-white">
              ₹{totalPrice.toLocaleString()}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-[#9494A8] text-xs font-medium mb-1">
              Duration
            </Text>
            <Text className="text-base font-bold text-white">
              {totalDays} day{totalDays > 1 ? "s" : ""} ⋅ {totalHours}h
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          activeOpacity={0.85}
          className="bg-[#E8500A] rounded-2xl py-5 items-center justify-center"
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color={"#fff"} size={"small"} />
              <Text className="ml-3 text-base font-bold text-white">
                Confirming Booking...
              </Text>
            </View>
          ) : (
            <Text className="text-base font-bold tracking-widest text-white uppercase">
              Confirm & Book Now
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
