import { create } from "zustand";
import { Car, City, Sublocation } from "../types";

interface BookingDraft {
  city: City | null;
  sublocation: Sublocation | null;
  car: Car | null;
  startTime: Date | null;
  endTime: Date | null;
}

interface BookingStore {
  draft: BookingDraft;
  setCity: (city: City) => void;
  setSublocation: (sublocation: Sublocation) => void;
  setCar: (car: Car) => void;
  setTimes: (startTime: Date, endTime: Date) => void;
  resetDraft: () => void;
}

const emptyDraft: BookingDraft = {
  city: null,
  sublocation: null,
  car: null,
  startTime: null,
  endTime: null,
};

export const useBookingStore = create<BookingStore>((set) => ({
  draft: emptyDraft,

  setCity: (city) =>
    set((s) => ({
      draft: { ...s.draft, city, sublocation: null, car: null },
    })),

  setSublocation: (sublocation) =>
    set((s) => ({
      draft: { ...s.draft, sublocation, car: null },
    })),

  setCar: (car) =>
    set((s) => ({
      draft: { ...s.draft, car },
    })),

  setTimes: (startTime, endTime) =>
    set((s) => ({
      draft: { ...s.draft, startTime, endTime },
    })),

  resetDraft: () => set({ draft: emptyDraft }),
}));
