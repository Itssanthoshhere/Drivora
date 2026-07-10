import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { userAuthStore } from "@/src/store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isLoading, error, clearError } = userAuthStore();

  const clearFieldError = useCallback((field: string) => {
    setErrors((e) => ({ ...e, [field]: "" }));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim()) e.lastName = "Required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!phone) e.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(phone))
      e.phone = "Enter valid 10-digit Indian mobile";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Minimum 8 Characters";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone,
        password,
      });
      router.replace("/(main)/home");
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-8 pb-10">
            <TouchableOpacity onPress={() => router.back()} className="mb-10">
              <View className="w-10 h-10 rounded-xl bg-[#13131A] border border-[#22222E] items-center justify-center">
                <Text className="text-lg text-white">←</Text>
              </View>
            </TouchableOpacity>

            <View className="mb-10">
              <Text className="text-[#9494AB] text-sm font-medium tracking-wider uppercase mb-3">
                Get Started
              </Text>
              <Text className="text-5xl font-bold leading-tight text-white">
                Create your {"\n"}Account
              </Text>
            </View>

            <View className="min-h-[52px] mb-6 justify-center">
              {error ? (
                <View className="bg-[#FF4D4D15] border border-[#FF4D4D40] rounded-2xl px-4 py-3">
                  <Text className="text-[#FF4D4D] text-sm font-medium">
                    {error}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="mb-8" style={{ gap: 16 }}>
              <View className="flex-row" style={{ gap: 12 }}>
                <View className="flex-1">
                  <Text className="text-[#9494AB] text-xs font-semibold tracking-widest uppercase mb-2 ml-1">
                    First Name
                  </Text>

                  <View
                    className={`bg-[#13131A] border rounded-2xl px-4 py-4 flex-row items-center ${errors.firstName ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                  >
                    <TextInput
                      value={firstName}
                      onChangeText={(t) => {
                        setFirstName(t);
                        clearFieldError("firstName");
                      }}
                      placeholder="Santhosh"
                      placeholderTextColor={"#545A72"}
                      autoCorrect={false}
                      className="flex-1 text-base text-white"
                    />
                  </View>

                  {errors.firstName ? (
                    <Text className="text-[#FF4D4D] text-xs mt-1.5 ml-1">
                      {errors.firstName}
                    </Text>
                  ) : null}
                </View>

                <View className="flex-1">
                  <Text className="text-[#9494AB] text-xs font-semibold tracking-widest uppercase mb-2 ml-1">
                    Last Name
                  </Text>

                  <View
                    className={`bg-[#13131A] border rounded-2xl px-4 py-4 flex-row items-center ${errors.lastName ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                  >
                    <TextInput
                      value={lastName}
                      onChangeText={(t) => {
                        setLastName(t);
                        clearFieldError("lastName");
                      }}
                      placeholder="V S"
                      placeholderTextColor={"#545A72"}
                      autoCorrect={false}
                      className="flex-1 text-base text-white"
                    />
                  </View>

                  {errors.lastName ? (
                    <Text className="text-[#FF4D4D] text-xs mt-1.5 ml-1">
                      {errors.lastName}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View>
                <Text className="text-[#9494AB] text-xs font-semibold tracking-widest uppercase mb-2 ml-1">
                  Email Address
                </Text>

                <View
                  className={`bg-[#13131A] border rounded-2xl px-4 py-4 flex-row items-center ${errors.email ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      clearFieldError("email");
                    }}
                    placeholder="you@example.com"
                    placeholderTextColor={"#545A72"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    className="flex-1 text-base text-white"
                  />
                </View>

                {errors.email ? (
                  <Text className="text-[#FF4D4D] text-xs mt-1.5 ml-1">
                    {errors.email}
                  </Text>
                ) : null}
              </View>

              <View>
                <Text className="text-[#9494AB] text-xs font-semibold tracking-widest uppercase mb-2 ml-1">
                  Mobile Number
                </Text>

                <View
                  className={`bg-[#13131A] border rounded-2xl px-4 py-4 flex-row items-center ${errors.phone ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={phone}
                    onChangeText={(t) => {
                      setPhone(t);
                      clearFieldError("phone");
                    }}
                    placeholder="9876543210"
                    placeholderTextColor={"#545A72"}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    className="flex-1 text-base text-white"
                  />
                </View>

                {errors.phone ? (
                  <Text className="text-[#FF4D4D] text-xs mt-1.5 ml-1">
                    {errors.phone}
                  </Text>
                ) : null}
              </View>

              <View>
                <Text className="text-[#9494AB] text-xs font-semibold tracking-widest uppercase mb-2 ml-1">
                  Password
                </Text>

                <View
                  className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.password ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      clearFieldError("password");
                    }}
                    placeholder="Min. 8 characters"
                    placeholderTextColor={"#545A72"}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    className="flex-1 text-base text-white"
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-2 py-1 ml-3"
                  >
                    <Text className="text-[#5A5A72] text-xs font-semibold tracking-wider uppercase">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {errors.password ? (
                  <Text className="text-[#FF4D4D] text-xs mt-1.5 ml-1">
                    {errors.password}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <TouchableOpacity
            disabled={isLoading}
            onPress={handleRegister}
            className="bg-[#E8500A] rounded-2xl py-5 items-center mb-5 mt-5"
          >
            {isLoading ? (
              <ActivityIndicator color={"#fff"} />
            ) : (
              <Text className="text-sm font-bold tracking-widest text-white uppercase">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center mt-2"
          >
            <Text className="text-sm text-center text-white">
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
