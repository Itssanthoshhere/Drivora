import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { bookingsController } from "../../controllers/bookings.controller";

const router = Router();

router.use(authenticate);

router.post("/", bookingsController.createBooking);
router.get("/", bookingsController.getMyBookings);
router.get("/:id", bookingsController.getBookingsByID);
router.patch("/:id/cancel", bookingsController.cancelBooking);

export default router;
