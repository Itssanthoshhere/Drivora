import { Request, Response, NextFunction } from "express";
import { citiesService } from "../services/cities.service";
import { sendError, sendSuccess } from "../types";

export const citiesController = {
  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = await citiesService.getAllCities();

      sendSuccess(res, "Cities fetched", cities);
    } catch (err) {
      next(err);
    }
  },

  async getSublocation(req: Request, res: Response, next: NextFunction) {
    try {
      const cityId = req.params["cityId"] as string;
      const sublocations = await citiesService.getSublocations(cityId);

      sendSuccess(res, "Sublocation Fetched", sublocations);
    } catch (err) {
      if (err instanceof Error && err.message == "City not found") {
        sendError(res, "City not found", 404);
        return;
      }

      next(err);
    }
  },
};
