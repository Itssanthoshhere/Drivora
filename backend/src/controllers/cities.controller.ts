import { Request, Response, NextFunction } from "express";
import { citiesService } from "../services/cities.service";
import { sendError, sendSuccess } from "../types";
import { NotFoundError } from "../errors/NotFoundError";
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
      if (err instanceof NotFoundError) {
        sendError(res, err.message, 404);
        return;
      }

      next(err);
    }
  },
};
