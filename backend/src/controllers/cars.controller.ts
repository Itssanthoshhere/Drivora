import { FuelType, TransmissionType } from "@prisma/client";
import z from "zod";
import { Request, Response, NextFunction } from "express";
import { carsService } from "../services/cars.service";
import { sendError, sendSuccess } from "../types";

const availabilitySchema = z.object({
  sublocationId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  fuelType: z.nativeEnum(FuelType).optional(),
  transmission: z.nativeEnum(TransmissionType).optional(),
  seats: z.coerce.number().int().min(2).max(8).optional(),
});

export const carsController = {
  async getAvailableCars(req: Request, res: Response, next: NextFunction) {
    const input = availabilitySchema.parse(req.query);

    const startTime = new Date(input.startTime);
    const endTime = new Date(input.endTime);

    if (endTime <= startTime) {
      sendError(res, "End time must be after start time", 400);
      return;
    }

    const minHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (minHours < 1) {
      sendError(res, "Minimum booking duration is 1 hour", 400);
      return;
    }

    const cars = await carsService.getAvailableCars({
      ...input,
      startTime,
      endTime,
    });

    sendSuccess(res, "Available cars fetched", cars);
  },

  async getCarById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"] as string;
      const car = await carsService.getCarById(id);

      sendSuccess(res, "Car fetched", car);
    } catch (err) {
      if (err instanceof Error && err.message == "Car not found") {
        sendError(res, "Car not found", 404);
        return;
      }

      next(err);
    }
  },

  async calculatePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { carId, startTime, endTime } = z
        .object({
          carId: z.string().uuid(),
          startTime: z.string().datetime(),
          endTime: z.string().datetime(),
        })
        .parse(req.query);

      const pricing = await carsService.calculatePrice(
        carId,
        new Date(startTime),
        new Date(endTime),
      );

      sendSuccess(res, "Price Calculated", pricing);
    } catch (err) {
      next(err);
    }
  },
};
