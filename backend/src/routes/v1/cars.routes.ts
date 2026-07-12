import { Router } from "express";
import { carsController } from "../../controllers/cars.controller";

const router = Router();

router.get("/", carsController.getAvailableCars);
router.get("/price", carsController.calculatePrice);
router.get("/:id", carsController.getCarById);

export default router;
