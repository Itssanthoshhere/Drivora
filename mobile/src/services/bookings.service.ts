import { api } from "../lib/axios";
import { Booking } from "../types";

export const bookingsService = {
  async createBooking(data: {
    carId: string;
    startTime: string;
    endTime: string;
  }): Promise<Booking> {
    const res = await api.post("/bookings", data);
    return res.data.data;
  },

  async getMyBookings(status?: string): Promise<Booking[]> {
    const res = await api.get("/bookings", {
      params: status ? { status } : {},
    });
    return res.data.data;
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data.data;
  },
};
