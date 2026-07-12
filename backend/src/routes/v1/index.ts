import { Router } from "express";
import authRoutes from "../v1/auth.routes";
import citiesRoutes from "./cities.routes";
import carsRoutes from "./cars.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cities", citiesRoutes);
router.use("/cars", carsRoutes);

export default router;
