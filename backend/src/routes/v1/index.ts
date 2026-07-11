import { Router } from "express";
import authRoutes from "../v1/auth.routes";
import citiesRoutes from "./cities.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cities", citiesRoutes);

export default router;
