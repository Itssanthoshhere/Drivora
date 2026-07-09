import { User } from "../types";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/auth.service";
import { api } from "../lib/axios";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  loadUser: () => Promise<void>;
}

export const userAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");

      if (!token) return;

      const payload = jwtDecode<{ exp: number }>(token);

      if (payload.exp * 1000 < Date.now()) return;

      const res = await api.get("/auth/me");
      set({ user: res.data.data, isAuthenticated: true });
    } catch (e) {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await authService.login(email, password);
      set({ user: res.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message;
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const res = await authService.register(data);
      set({ user: res.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message;
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true });

    await authService.logout();

    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearError: () => set({ error: null }),
}));
