import { BookingStatus } from "@prisma/client";
import { NextFunction, Response } from "express";
import { z } from "zod";
import { bookingsService } from "../services/bookings.service";
import { AuthenticateRequest, sendError, sendSuccess } from "../types";

const createBookingSchema = z.object({
  carId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const bookingsController = {
  async createBooking(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const input = createBookingSchema.parse(req.body);
      const startTime = new Date(input.startTime);
      const endTime = new Date(input.endTime);

      if (endTime <= startTime) {
        sendError(res, "End time must be after start time", 400);
        return;
      }

      const hours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      if (hours < 1) {
        sendError(res, "Minimum booking duration is 1 hour", 400);
        return;
      }

      if (startTime < new Date()) {
        sendError(res, "Start Time cannot be in the past", 400);
        return;
      }

      const booking = await bookingsService.createBooking({
        userId: req.user!.userId,
        carId: input.carId,
        startTime,
        endTime,
      });

      sendSuccess(res, "Booking confirmed", booking, 201);
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message.includes("not available") ||
          err.message.includes("not found")
        ) {
          sendError(res, err.message, 400);
          return;
        }
        if (err.message.includes("maintenance")) {
          sendError(res, err.message, 400);
          return;
        }
      }
      next(err);
    }
  },

  async getMyBookings(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { status } = req.query;
      const bookings = await bookingsService.userBookings(
        req.user!.userId,
        status as BookingStatus | undefined,
      );
      sendSuccess(res, "Bookings fetched", bookings);
    } catch (err) {
      next(err);
    }
  },

  async getBookingsByID(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params["id"] as string;
      const booking = await bookingsService.getBookingById(
        id,
        req.user!.userId,
      );
      sendSuccess(res, "Booking fetched", booking);
    } catch (err) {
      if (err instanceof Error && err.message === "Booking is not found") {
        sendError(res, "Booking not found", 404);
        return;
      }
      if (err instanceof Error && err.message === "Unauthorized") {
        sendError(res, "Unauthorized", 403);
        return;
      }
      next(err);
    }
  },

  async cancelBooking(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params["id"] as string;
      const booking = await bookingsService.cancelBooking(id, req.user!.userId);
      sendSuccess(res, "Booking cancelled", booking);
    } catch (err) {
      if (err instanceof Error) {
        const clientErrors = [
          "Booking not found",
          "already cancelled",
          "Cannot cancel",
          "less than 1 hour",
        ];
        if (clientErrors.some((e) => err.message.includes(e))) {
          sendError(res, err.message, 400);
          return;
        }
        if (err.message === "Unauthorized") {
          sendError(res, "Unauthorized", 403);
          return;
        }
      }
      next(err);
    }
  },
};
