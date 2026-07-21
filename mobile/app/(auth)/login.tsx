import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { login, isLoading, error, clearError } = useAuthStore();

  const clearFieldError = (field: "email" | "password") => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Minimum 8 Characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    clearError();

    if (!validate()) return;

    try {
      await login(email.trim().toLowerCase(), password);
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
            <View>
              <View className="flex-row items-center mb-10">
                <Image
                  source={require("@/assets/images/icon.png")}
                  className="w-8 h-8 rounded-lg mr-2"
                />

                <Text className="text-lg font-bold tracking-wider text-white">
                  Drivora
                </Text>
              </View>

              <Text className="text-[#9494AB] text-sm font-medium tracking-[3px] uppercase mb-3">
                Welcome back
              </Text>

              <Text className="text-5xl font-bold leading-tight text-white">
                Sign in to{"\n"}your account.
              </Text>
            </View>

            <View className="min-h-[52px] mt-4 mb-2 justify-center">
              {error ? (
                <View className="bg-[#FF4D4D15] border border-[#FF4D4D40] rounded-2xl px-4 py-3">
                  <Text className="text-[#FF4D4D] text-sm font-medium">
                    {error}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="mb-6" style={{ gap: 16 }}>
              <View>
                <Text className="text-[#9494A8] text-xs font-semibold tracking-widest uppercase mb-2 ml-1">
                  Email Address
                </Text>

                <View
                  className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.email ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      clearFieldError("email");
                    }}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    placeholderTextColor={"#5A5A72"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    className="flex-1 text-base text-white"
                  />
                </View>

                {errors?.email && (
                  <Text className="text-xs text-red-500 mt-1.5 ml-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-[#9494A8] text-xs font-semibold tracking-widest uppercase mb-2 ml-1">
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
                    placeholder="Min. 8 Characters"
                    placeholderTextColor={"#5A5A72"}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    className="flex-1 text-base text-white"
                  />

                  <TouchableOpacity
                    className="px-2 py-1 ml-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text className="text-[#5A5A72] text-xs font-semibold tracking-wider uppercase">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {errors?.password && (
                  <Text className="text-xs text-red-500 mt-1.5 ml-1">
                    {errors.password}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              disabled={isLoading}
              activeOpacity={0.85}
              className="bg-[#E8500A] rounded-2xl py-5 items-center mb-5"
              onPress={handleLogin}
            >
              {isLoading ? (
                <ActivityIndicator color={"#fff"} />
              ) : (
                <Text className="text-sm font-bold tracking-widest text-white uppercase">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center mb-5">
              <View className="flex-1 h-px bg-[#22222E]" />
              <Text className="text-[#5A5A72] text-xs mx-4 tracking-widest uppercase">
                or
              </Text>
              <View className="flex-1 h-px bg-[#22222E]" />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              activeOpacity={0.85}
              className="border border-[#22222E] rounded-2xl py-5 items-center"
            >
              <Text className="text-sm font-semibold text-white uppercase">
                Create Account
              </Text>
            </TouchableOpacity>

            <Text className="text-[#5A5A72] text-xs text-center mt-8 leading-5">
              By continuing, you agree to our{" "}
              <Text className="text-[#9494A8]">Terms of Service</Text> and{" "}
              <Text className="text-[#9494A8]">Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
