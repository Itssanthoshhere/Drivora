import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const slides = [
  {
    id: "1",
    tag: "WELCOME TO DRIVORA",
    title: "Drive Anywhere,\nAnytime.",
    subtitle:
      "Premium self-drive cars available across Bengaluru, Mumbai & Hyderabad.",
    image: require("../../assets/images/onboarding-1.jpg"),
    accentClass: "bg-[#E8500A]",
    accentText: "text-[#E8500A]",
    btnClass: "bg-[#E8500A]",
  },
  {
    id: "2",
    tag: "EASY BOOKING",
    title: "Book in Under\n60 Seconds.",
    subtitle:
      "Choose your city, pick a location near you, select your car and go.",
    image: require("../../assets/images/onboarding-2.jpg"),
    accentClass: "bg-[#00D4AA]",
    accentText: "text-[#00D4AA]",
    btnClass: "bg-[#00D4AA]",
  },
  {
    id: "3",
    tag: "YOUR TERMS",
    title: "Fuel Up &\nDrive Free.",
    subtitle:
      "Transparent pricing, daily km limits and zero hidden charges. Always.",
    image: require("../../assets/images/onboarding-3.jpg"),
    accentClass: "bg-[#E8500A]",
    accentText: "text-[#E8500A]",
    btnClass: "bg-[#E8500A]",
  },
];

const Onboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const slide = slides[activeIndex];

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      const next = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setActiveIndex(next);
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="items-end">
        {activeIndex < slides.length - 1 ? (
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            className="px-6 py-2"
          >
            <Text className="text-sm font-medium tracking-widest text-[#5A5A72] uppercase">
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="px-6 py-2 opacity-0">
            <Text>Skip</Text>
          </View>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width }} className="px-6">
            <View className="rounded-3xl bg-[#13131A] border border-[#22222E] h-80 overflow-hidden mb-10 items-center justify-center">
              <View className="absolute top-4 left-4 bg-[#0A0A0F] rounded-full px-3 py-1 border border-[#22222E]">
                <Text className="text-[#9494A8] text-sm tracking-widest uppercase">
                  Self Drive
                </Text>
              </View>

              <Image
                source={item.image}
                className="w-full h-52"
                resizeMode="contain"
              />

              <View
                className={`absolute bottom-0 left-0 right-0 h-1 ${item.accentClass} opacity-60`}
              />
            </View>

            <View>
              <View className="flex-row items-center mb-3">
                <View className={`w-5 h-0.5 mr-2 ${item.accentClass}`} />
                <Text
                  className={`text-xs font-bold tracking-[3px] ${item.accentText}`}
                >
                  {item?.tag}
                </Text>
              </View>

              <Text className="mb-4 text-5xl font-bold leading-tight text-white">
                {item?.title}
              </Text>

              <Text className="text-[#9494A8] text-lg leading-8">
                {item.subtitle}
              </Text>
            </View>
          </View>
        )}
      />

      <View className="px-6 pb-10">
        <View className="flex-row items-center mb-8">
          {slides?.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full mr-1.5 ${i === activeIndex ? `w-6 ${slide.accentClass}` : `w-1.5 bg-[#22222E]`}`}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className={`${slide.btnClass} rounded-2xl py-5 items-center`}
          onPress={handleNext}
        >
          <Text className="text-sm font-bold tracking-widest text-white uppercase">
            {activeIndex === slides.length - 1 ? "Let's Go" : "Continue"}
          </Text>
        </TouchableOpacity>

        {activeIndex === slides.length - 1 && (
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            className="items-center mt-5"
          >
            <Text className="text-[#5A5A72] text-sm">
              Already have an account?{" "}
              <Text className="text-[#E8500A] font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
