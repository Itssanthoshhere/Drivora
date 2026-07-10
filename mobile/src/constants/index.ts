export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__
  ? "http://192.168.1.33:3000/api/v1/"
  : "https://your-production-url.com/api/v1/");

export const FUEL_TYPE_LABELS: Record<string, string> = {
  PETROL: "Petrol",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  CNG: "CNG",
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  AUTOMATIC: "Automatic",
};
