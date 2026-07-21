import { Router } from "express";
import authRoutes from "../v1/auth.routes";
import citiesRoutes from "./cities.routes";
import carsRoutes from "./cars.routes";
import bookingsRoutes from "./bookings.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cities", citiesRoutes);
router.use("/cars", carsRoutes);
router.use("/bookings", bookingsRoutes);

export default router;
